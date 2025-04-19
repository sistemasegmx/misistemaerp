import { Component, Input } from '@angular/core';
import { IAccount } from 'src/app/pages/interfaces/iaccount';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { ISale } from 'src/app/pages/interfaces/isale';
import { ISaleItems } from 'src/app/pages/interfaces/isaleitems';
import { IUser } from 'src/app/pages/interfaces/iuser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html'
})
export class InfoComponent {
  @Input() sale!: ISale;
  @Input() ente!: IEnte;
  @Input() carrito: ISaleItems[];
  @Input() account: IAccount;
  @Input() staff: IUser;
  @Input() calculatedValues = { subtotal: 0, taxAmount: 0, total: 0, due: 0 };

  baseUrl: string = environment.baseUrl;

  public printableContent(): string {
    const contentId = this.sale.countrycode === 'MX' ? 'infoComponentContentES' : 'infoComponentContentEN';
    return document.getElementById(contentId)?.innerHTML || '';
  }
}
