import { Component, Input, OnInit, OnChanges, SimpleChange, SimpleChanges, ChangeDetectorRef } from "@angular/core";
import { IItem } from "src/app/pages/interfaces/iitem";
import { ISale } from "src/app/pages/interfaces/isale";
import { RepositoryService } from "src/app/pages/services/repository.service";
@Component({
  selector: "app-one-item-widget",
  standalone: false,
  templateUrl: "./one-item-widget.component.html",
})
export class OneItemWidgetComponent implements OnChanges {

  @Input() title: string;
  @Input() item: ISale | null;
  @Input() isLoading: boolean;
  @Input() footerLink: string;

  listItems: IItem[] = [];

  constructor(
    private repositoryService: RepositoryService,
    private cd: ChangeDetectorRef
  ) { }

  ngOnChanges(changes: SimpleChanges): void {

    const saleId = this.item?.id ?? '';
    if (changes["item"].currentValue !== null && changes["item"].currentValue !== undefined) {
      this.repositoryService.getListByColumn("saleitems", 'saleid', saleId)
        .subscribe(resp => { this.listItems = resp; this.cd.detectChanges(); });
    }
  }

  toNumber(value: string | undefined): number { return value !== null ? Number(value) : 0; }

  truncateText(text: string | null | undefined, limit = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }

  getTotalFormatted(amount: string | undefined, currency: string | undefined): string { return new Intl.NumberFormat("es-MX", { style: 'currency', currency: "MXN", currencyDisplay: "symbol" }).format(this.toNumber(amount)); }

  getStatusClass(status: string): string { return `badge-light-${status}`; }
}