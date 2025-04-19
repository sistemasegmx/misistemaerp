import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ICurrency } from 'src/app/pages/interfaces/icurrency';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IPricelevel } from 'src/app/pages/interfaces/ipricelevel';
import { ISale } from 'src/app/pages/interfaces/isale';
import { ITax } from 'src/app/pages/interfaces/itax';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit, AfterViewInit {
  @ViewChild('fullnameInput') fullnameInput!: ElementRef;

  filename: string = '';
  letsdoitForm: FormGroup;
  module: string = 'sale';
  heroe!: ISale;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;
  shippingMethods = environment.modules.shippingMethods;
  allEntes: IEnte[] = [];
  allTax: ITax[] = [];
  allCurrency: ICurrency[] = [];
  allPricelevel: IPricelevel[] = [];
  searchResults: IEnte[] = [];
  selectedEnte: IEnte;

  constructor(
    private authService: AuthService,
    private router: Router,
    private repositoryService: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.createForm();
    this.initializeEnte();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.loadData();
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      enteid: ['', []],
      enteorder: [''],
      entecode: [''],
      entename: ['', []],
      currency: ['', [Validators.required]],
      parity: ['', [Validators.required]],
      taxname: ['', [Validators.required]],
      taxamount: ['', [Validators.required]],
      pricelevel: ['1', []],
      salename: ['', []],
      validity: ['15', []],
      shippingmethod: ['sin envío', []],
      from: ['', []],
      deliver_to: ['', []],
      startdate: ['', []],
      enddate: ['', []],
      description: ['', []],
      status: ['borrador', []],
      enteSearch: ['', []],
      countrycode: ['', []]
    });
  }


  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.initializeHeroe();
      if (this.user.accountid) {
        this.loadCurrencyInfo(this.user.account.currencyid);
        this.loadPricelevelInfo('1');
        this.loadTaxInfo(this.user.account.taxid);
      }
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      saleid: '',
      accountid: this.user.accountid,
      enteid: '1',
      enteorder: '',
      entecode: '',
      entename: '',
      currency: '',
      parity: '',
      taxname: '',
      taxamount: '',
      pricelevel: '',
      subtotal: '',
      total: '',
      cost: '',
      paid: '',
      salename: '',
      validity: '15',
      shippingmethod: '',
      from: '',
      deliver_to: '',
      type: 'cotizacion',
      countrycode: 'MX',
      items: '',
      startdate: '',
      enddate: '',
      description: '',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private initializeEnte(): void {
    this.selectedEnte = {
      id: '1',
      accountid: '',
      code: 'PUBLICO',
      fullname: 'Cliente Público',
      nationality: 'USA',
      rfc: 'XAXX010101000',
      fiscalname: 'Cliente Público',
      fulladdress: '405 Howard Street, San Francisco, CA 94105',
      email: 'aspentec.tj@gmail.com',
      phone: '',
      level: '1',
      type: 'cliente',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user ? this.user.id : '',
      modified_by: this.user ? this.user.id : ''
    };
  }

  private loadCurrencyInfo(id: string): void {
    this.repositoryService.getOneById('currency', { id }).subscribe({
      next: (resp: ICurrency) => { this.updateFormWithCurrency(resp); },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private loadTaxInfo(id: string): void {
    this.repositoryService.getOneById('tax', { id }).subscribe({
      next: (resp: ITax) => { this.updateFormWithTax(resp); },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private loadPricelevelInfo(id: string): void {
    this.repositoryService.getOneById('pricelevel', { id }).subscribe({
      next: (resp: IPricelevel) => { this.updateFormWithPricelevel(resp); },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  private updateFormWithCurrency(currency: ICurrency): void {
    this.letsdoitForm.patchValue({ currency: currency.code, parity: currency.amount });
    this.cdr.detectChanges();
  }

  private updateFormWithTax(tax: ITax): void {
    this.letsdoitForm.patchValue({ taxname: tax.fullname, taxamount: tax.amount });
    this.cdr.detectChanges();
  }

  private updateFormWithPricelevel(pricelevel: IPricelevel): void {
    this.letsdoitForm.patchValue({ pricelevel: pricelevel.id });
    this.cdr.detectChanges();
  }

  private loadData(): void {
    forkJoin({
      taxes: this.repositoryService.getAllData('tax'),
      currencies: this.repositoryService.getAllData('currency'),
      pricelevels: this.repositoryService.getAllData('pricelevel'),
      entes: this.repositoryService.getAllDataFiltered('ente', { 'type': 'cliente', 'status': 'activo' })
    }).subscribe({
      next: ({ taxes, currencies, pricelevels, entes }) => {
        this.allTax = taxes;
        this.allCurrency = currencies;
        this.allPricelevel = pricelevels;
        this.allEntes = entes.sort((a: IEnte, b: IEnte) => {
          const nameA = a.fiscalname || '';
          const nameB = b.fiscalname || '';
          return nameA.localeCompare(nameB);
        });
        this.searchResults = this.allEntes;
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading data:', error); }
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }

    this.letsdoitForm.patchValue({
      enteorder: this.letsdoitForm.value.enteorder?.toUpperCase() || '',
      salename: this.letsdoitForm.value.salename?.toUpperCase() || '',
      description: this.letsdoitForm.value.description?.toUpperCase() || '',
    });

    const { enteid, enteorder, entecode, entename, currency, parity, taxname, taxamount, pricelevel, salename, validity, shippingmethod, from, deliver_to, startdate, enddate, description, status, countrycode } = this.letsdoitForm.value;

    const payload: ISale = {
      ...this.heroe,
      enteid,
      enteorder,
      entecode,
      entename,
      currency,
      parity,
      taxname,
      taxamount,
      pricelevel,
      salename,
      validity,
      shippingmethod,
      from,
      deliver_to,
      startdate,
      enddate,
      description,
      status,
      countrycode
    };
    this.createItem(payload);
  }

  private createItem(item: ISale): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: ISale) => { this.router.navigate(['movimiento-de-cotizacion/' + resp.id + '/edit']); },
      error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error')
    });
  }

  onCurrencyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCurrencyCode = selectElement.value;
    this.changeCurrency(selectedCurrencyCode);
  }

  changeCurrency(code: string) {
    const foundCurrency = this.allCurrency.find(currency => currency.code === code);
    if (foundCurrency) { this.letsdoitForm.patchValue({ parity: foundCurrency.amount.toString() }); }
  }

  onPricelevelChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedPricelevelId = selectElement.value;
    this.changePricelevel(selectedPricelevelId);
  }

  changePricelevel(id: string) {
    const foundPricelevel = this.allPricelevel.find(pricelevel => pricelevel.id === id);
    if (foundPricelevel) { this.letsdoitForm.patchValue({ pricelevel: foundPricelevel.id }); }
  }

  onTaxChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedTaxName = selectElement.value;
    this.changeTax(selectedTaxName);
  }

  changeTax(name: string) {
    const foundTax = this.allTax.find(tax => tax.fullname === name);
    if (foundTax) { this.letsdoitForm.patchValue({ taxamount: foundTax.amount.toString() }); }
  }

  searchEnte(): void {
    const enteSearchValue = this.letsdoitForm.get('enteSearch')?.value;
    if (enteSearchValue.trim() === '') {
      this.searchResults = this.allEntes;
    } else {
      this.searchResults = this.allEntes.filter(ente => {
        const fiscalname = ente.fiscalname ? ente.fiscalname.toLowerCase() : '';
        return fiscalname.includes(enteSearchValue.toLowerCase());
      });
    }
    this.cdr.detectChanges();
  }

  truncateText = (text: string | null | undefined, limit: number = 80): string => text ? (text.length > limit ? text.substring(0, limit) + '...' : text) : '';

  selectEnte(ente: IEnte): void {
    this.selectedEnte = ente;
    this.letsdoitForm.patchValue({
      enteid: ente.id,
      entecode: ente.code,
      entename: ente.fiscalname,
      enteSearch: ''
    });
    this.searchResults = this.allEntes;
    this.cdr.detectChanges();
    this.fullnameInput.nativeElement.focus();
  }

  preventSubmit(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.searchResults.length === 1) {
        this.selectEnte(this.searchResults[0]);
      }
    }
  }

  submitWithCountry(code: string): void { this.letsdoitForm.patchValue({ countrycode: code }); this.saveItem(); }
}
