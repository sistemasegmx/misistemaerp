import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RepositoryService } from "../services/repository.service";
import { combineLatest, Subject } from "rxjs";
import { IEnte } from "../interfaces/iente";
import { ISale } from "../interfaces/isale";
import { IItem } from "../interfaces/iitem";
import { AuthService, UserModel } from "src/app/modules/auth";
import { environment } from 'src/environments/environment';

export type filterByDateOptionsType =
  | "current-month"
  | "last-three-months"
  | "current-week"
  | "last-six-months"
  | "year"
  | "today";

export interface ItemsWidgetData {
  xAxys: string[];
  values: number[];
}

export interface EntesFromQuotes {
  sale: ISale;
  quantity: number;
  total: number;
}

interface EntesData {
  date: string;
  quantity: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

  user: UserModel;
  baseUrl = environment.baseUrl;

  quotes: IEnte[] = [];
  purchases: IEnte[] = [];
  remisions: IEnte[] = [];
  lastThenQuotes: ISale[] = [];
  lastThenPurchases: ISale[] = [];
  highestTotalQuote: ISale | null = null;
  clientsFromLastThenQuotes: EntesFromQuotes[] = [];
  loadingAllData: boolean = false;
  activeDateFilter: filterByDateOptionsType = "current-month";
  quotesWidgetsData$ = new Subject<ItemsWidgetData>();
  purchasesWidgetsData$ = new Subject<ItemsWidgetData>();
  remisionsWidgetsData$ = new Subject<ItemsWidgetData>();

  highestTotalPurchase: ISale | null = null;
  clientsFromLastThenRemisions: EntesFromQuotes[] = [];
  lastThenRemisions: ISale[] = [];
  highestTotalRemision: ISale | null = null;
  clientsFromLastThenPurchases: EntesFromQuotes[] = [];

  totalCotizaciones: number = 0;
  totalCompras: number = 0;
  totalRemisiones: number = 0;




  dateFilters: { label: string; value: filterByDateOptionsType }[] = [
    { label: 'Hoy', value: 'today' },
    { label: 'Semana actual', value: 'current-week' },
    { label: 'Mes actual', value: 'current-month' },
    { label: 'Últimos 3 meses', value: 'last-three-months' },
    { label: 'Últimos 6 meses', value: 'last-six-months' },
    { label: 'Todo el año', value: 'year' },
  ];


  payload = {
    ascending: "desc",
    startDate: "",
    endDate: "",
    type: "cotizacion",
  };

  constructor(
    private repositoryService: RepositoryService,
    private cd: ChangeDetectorRef,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.authService.currentUserSubject.subscribe(user => { this.user = user; });
    this.loadAllData();
  }

  loadAllData(): void {
    if (!this.payload.startDate || !this.payload.endDate) {
      const currentDate = new Date();
      this.payload.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
      this.payload.endDate = this.getCurrentDateFormatted();
    }

    this.loadingAllData = true;

    combineLatest([
      this.repositoryService.getAllDataFilteredByRange("sale", this.payload),
      this.repositoryService.getAllDataFilteredByRange("sale", { ...this.payload, type: "compra" }),
      this.repositoryService.getAllDataFiltered("sale", { type: "cotizacion", ascending: "desc", limitqty: 10 }),
      this.repositoryService.getAllDataFiltered("sale", { type: "compra", ascending: "desc", limitqty: 10 }),
      this.repositoryService.getAllDataFilteredByRange("sale", { ...this.payload, type: "remision" }),
      this.repositoryService.getAllDataFiltered("sale", { type: "remision", ascending: "desc", limitqty: 10 })
    ]).subscribe(
      ([quoteResp, purchaseResp, lastThenQuotes, lastThenPurchases, remisionResp, lastThenRemisions]) => {
        this.quotes = quoteResp;
        this.purchases = purchaseResp;
        this.remisions = remisionResp;

        this.lastThenQuotes = this.sortByDateDescending(lastThenQuotes);
        this.lastThenPurchases = this.sortByDateDescending(lastThenPurchases);
        this.lastThenRemisions = this.sortByDateDescending(lastThenRemisions);

        this.clientsFromLastThenQuotes = this.getUniqueEntesFromQuotes(this.lastThenQuotes);
        this.clientsFromLastThenPurchases = this.getUniqueEntesFromPurchases(this.lastThenPurchases); // Aquí se llama al método
        this.highestTotalQuote = this.getQuoteWithHighestTotal(this.lastThenQuotes);
        this.highestTotalPurchase = this.getQuoteWithHighestTotal(this.lastThenPurchases);
        this.clientsFromLastThenRemisions = this.getUniqueEntesFromQuotes(this.lastThenRemisions);
        this.highestTotalRemision = this.getQuoteWithHighestTotal(this.lastThenRemisions);

        this.totalCotizaciones = this.quotes.length;
        this.totalCompras = this.purchases.length;
        this.totalRemisiones = this.remisions.length;

        this.loadingAllData = false;
        this.setWidgetData();
        this.cd.detectChanges();
      }
    );


  }

  private sortByDateDescending(sales: ISale[]): ISale[] {
    return [...sales].sort((a, b) => {
      return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
    });
  }

  setDateFilter(filterBy: filterByDateOptionsType): void {
    const currentDate = new Date();
    if (this.loadingAllData || this.activeDateFilter === filterBy) return;

    this.activeDateFilter = filterBy;

    switch (filterBy) {
      case "current-month":
        this.payload.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString().split('T')[0];
        break;
      case "current-week":
        const startOfWeek = this.getStartOfWeek();
        this.payload.startDate = startOfWeek.toISOString().split('T')[0];
        break;
      case "last-six-months":
        this.payload.startDate = this.getMonthsPrior(5).toISOString().split('T')[0];
        break;
      case "last-three-months":
        this.payload.startDate = this.getMonthsPrior(2).toISOString().split('T')[0];
        break;
      case "year":
        this.payload.startDate = new Date(currentDate.getFullYear(), 0, 1).toISOString().split('T')[0];
        break;
      case "today":
        this.payload.startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1).toISOString().split('T')[0];
        break;
    }
    this.payload.endDate = this.getCurrentDateFormatted();
    this.loadAllData();
  }

  private getStartOfWeek(): Date {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));
    return startOfWeek;
  }

  private getMonthsPrior(months: number): Date {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() - months);
    return currentDate;
  }

  private getCurrentDateFormatted(): string {
    const currentDate = new Date();
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 1).toISOString().split('T')[0];
  }

  getTitleForWidget(item: "Cotizaciones" | "Compras" | "Remisiones"): string {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    switch (this.activeDateFilter) {
      case "current-month":
        return `${item} de ${months[new Date().getMonth()]}`;
      case "last-six-months":
        return `${item} de los últimos 6 meses`;
      case "last-three-months":
        return `${item} de los últimos 3 meses`;
      case "today":
        const currentDate = new Date();
        return `${item} de hoy ${currentDate.getDate()}, ${months[currentDate.getMonth()].substring(0, 3)}`;
      case "current-week":
        return `${item} de la semana`;
      case "year":
        return `${item} del año ${new Date().getFullYear()}`;
    }
  }

  private setWidgetData(): void {
    if (["last-six-months", "last-three-months", "year"].includes(this.activeDateFilter)) {
      this.callNextOnWidgetsSubjects(this.filterByMonths());
    } else {
      switch (this.activeDateFilter) {
        case "current-month":
          this.callNextOnWidgetsSubjects(this.filterByMonth());
          break;
        case "current-week":
          this.callNextOnWidgetsSubjects(this.filterByWeek());
          break;
        case "today":
          this.callNextOnWidgetsSubjects(this.filterByToday());
          break;
      }
    }
  }

  private callNextOnWidgetsSubjects(widgetsData: EntesData[][]): void {
    this.quotesWidgetsData$.next(this.createWidgetData(widgetsData[0]));
    this.purchasesWidgetsData$.next(this.createWidgetData(widgetsData[1]));
    this.remisionsWidgetsData$.next(this.createWidgetData(widgetsData[2]));
  }

  private createWidgetData(data: EntesData[]): ItemsWidgetData {
    return {
      values: data.filter(el => el.date !== "" && el.quantity !== 0).map(el => el.quantity),
      xAxys: data.filter(el => el.date !== "" && el.quantity !== 0).map(el => el.date),
    };
  }

  private filterByMonth(): EntesData[][] {
    return this.filterByInterval((d: Date) => d.getDate().toString());
  }

  private filterByMonths(): EntesData[][] {
    const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return this.filterByInterval((d: Date) => months[d.getMonth()]);
  }

  private filterByWeek(): EntesData[][] {
    const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
    return this.filterByInterval((d: Date) => days[d.getDay()]);
  }

  private filterByToday(): EntesData[][] {
    return this.filterByInterval((d: Date) => d.getHours() > 12 ? `${d.getHours() - 12} PM` : `${d.getHours()} AM`);
  }

  private filterByInterval(formatFn: (d: Date) => string): EntesData[][] {
    const quotesData = this.aggregateBy(this.quotes, formatFn);
    const purchasesData = this.aggregateBy(this.purchases, formatFn);
    const remisionsData = this.aggregateBy(this.remisions, formatFn);
    return [quotesData, purchasesData, remisionsData];
  }

  private aggregateBy(data: IEnte[], formatFn: (d: Date) => string): EntesData[] {
    const aggregatedData: EntesData[] = [];
    const sortedData = [...data].sort((a, b) => new Date(a.created_at ?? "").getTime() - new Date(b.created_at ?? "").getTime());

    sortedData.forEach(el => {
      const label = formatFn(new Date(el.created_at ?? ""));
      const existingData = aggregatedData.find(q => q.date === label);
      if (existingData) {
        existingData.quantity += 1;
      } else {
        aggregatedData.push({ date: label, quantity: 1 });
      }
    });

    return aggregatedData;
  }

  private getUniqueEntesFromQuotes(quotes: ISale[]): EntesFromQuotes[] {
    const uniqueEntes: EntesFromQuotes[] = [];
    const seen = new Set<string>();

    quotes.forEach(q => {
      if (!seen.has(q.entecode)) {
        uniqueEntes.push({ sale: q, quantity: 1, total: Number(q.total ?? 0) });
        seen.add(q.entecode);
      } else {
        const enteInQuote = uniqueEntes.find(el => el.sale.entecode === q.entecode);
        if (enteInQuote) {
          enteInQuote.quantity += 1;
          enteInQuote.total += Number(q.total ?? 0);
        }
      }
    });

    return uniqueEntes;

  }

  private getUniqueEntesFromPurchases(purchases: ISale[]): EntesFromQuotes[] {
    const uniqueProviders: EntesFromQuotes[] = [];
    const seen = new Set<string>();

    purchases.forEach(p => {
      if (!seen.has(p.entecode)) {
        uniqueProviders.push({ sale: p, quantity: 1, total: Number(p.total ?? 0) });
        seen.add(p.entecode);
      } else {
        const providerInPurchase = uniqueProviders.find(el => el.sale.entecode === p.entecode);
        if (providerInPurchase) {
          providerInPurchase.quantity += 1;
          providerInPurchase.total += Number(p.total ?? 0);
        }
      }
    });

    return uniqueProviders;
  }

  get salesFromLastThenPurchases(): ISale[] {
    return this.clientsFromLastThenPurchases.map(ente => ente.sale);
  }

  private getQuoteWithHighestTotal(quotes: ISale[]): ISale {
    return quotes.reduce((max, obj) => (Number(obj.total) > Number(max.total) ? obj : max), quotes[0]);
  }

  getLabelForActiveFilter(value: string) {
    const filter = this.dateFilters.find(filter => filter.value === value);
    return filter ? filter.label : '';
  }

}
