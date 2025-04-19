import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { IAccount } from '../../../interfaces/iaccount';
import { ITax } from '../../../interfaces/itax';
import { ICurrency } from '../../../interfaces/icurrency';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html'
})
export class HeroeComponent implements OnInit, AfterViewInit {
  @ViewChild('fullnameInput') fullnameInput!: ElementRef;
  filename: string = '';
  letsdoitForm: FormGroup;
  module: string = 'account';

  heroe: IAccount = {
    id: '',
    currencyid: '',
    taxid: '',
    nationality: '',
    fullname: '',
    rfc: '',
    fiscalname: '',
    fulladdress: '',
    description: '',
    phone: '',
    company_usa: '',
    address_usa: '',
    phone_usa: '',
    type: '',
    status: 'activo',
    image: '/assets/img/nofoto.png'
  };

  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  basetypes = environment.modules.basetypes;
  allTax: ITax[] = [];
  allCurrency: ICurrency[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.createForm();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.loadAllTax();
    this.loadAllCurrency();
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      fullname: ['', [Validators.required]],
      fiscalname: ['', []],
      rfc: ['', []],
      nationality: ['MX', []],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', []],
      company_usa: ['', []],
      address_usa: ['', []],
      phone_usa: ['', []],
      defaultcomments: ['', []],
      fulladdress: ['', []],
      description: ['', []],
      currencyid: ['', [Validators.required]],
      taxid: ['', [Validators.required]],
      type: ['', [Validators.required]],
      status: ['activo', [Validators.required]]
    });
  }


  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; this.loadHeroeData(this.user.accountid); }); }

  private loadAllTax(): void {
    this.repositoryService.getAllDataFiltered('tax', { 'status': 'activo' })
      .subscribe({
        next: (resp: ITax[]) => { this.allTax = resp; this.cdr.detectChanges(); },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  private loadAllCurrency(): void {
    this.repositoryService.getAllDataFiltered('currency', { 'status': 'activo' })
      .subscribe({
        next: (resp: ICurrency[]) => { this.allCurrency = resp; this.cdr.detectChanges(); },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  private loadHeroeData(accountId: string): void {
    this.repositoryService.getOneById(this.module, { id: accountId }).subscribe(
      (resp: IAccount) => {
        if (this.letsdoitForm) {
          this.heroe = resp;
          this.letsdoitForm.patchValue({
            currencyid: resp.currencyid,
            taxid: resp.taxid,
            nationality: resp.nationality,
            fullname: resp.fullname,
            rfc: resp.rfc,
            fiscalname: resp.fiscalname,
            fulladdress: resp.fulladdress,
            description: resp.description,
            phone: resp.phone,
            company_usa: resp.company_usa,
            address_usa: resp.address_usa,
            phone_usa: resp.phone_usa,
            defaultcomments: resp.defaultcomments,
            email: resp.email,
            type: resp.type,
            status: resp.status
          });
          this.cdr.detectChanges();
        }
      },
      error => { console.error('Error loading data:', error); }
    );
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) return;
    const payload = { ...this.heroe, ...this.letsdoitForm.value };
    const { currencyid, taxid, status } = this.letsdoitForm.value;
    const currency = this.allCurrency.find(c => c.id == currencyid);
    const tax = this.allTax.find(t => t.id == taxid);
    const currencyName = currency ? currency.fullname : 'Desconocido';
    const taxName = tax ? tax.fullname : 'Desconocido';

    Swal.fire({
      title: '¿Estás completamente seguro?',
      html: `Estos cambios afectarán el comportamiento del sistema.<br><br>
             <strong>Moneda:</strong> ${currencyName}<br>
             <strong>Impuesto:</strong> ${taxName}<br>
             <strong>Status:</strong> ${status}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar'
    }).then((result) => { if (result.isConfirmed) { this.updateItem(payload); } });

  }

  private updateItem(item: IAccount): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: () => { Swal.fire('Actualizado!', 'Los cambios han sido actualizados.', 'success').then(() => { window.location.reload(); }); },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.filename = file.name;
      const formData = new FormData();
      formData.append('id', this.heroe.id);
      formData.append('module', this.module);
      formData.append('file', file);

      this.repositoryService.uploadFile(formData).subscribe((resp: string) => this.heroe.image = '/' + resp);
    }
  }
}
