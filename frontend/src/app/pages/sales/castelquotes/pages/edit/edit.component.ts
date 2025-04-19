import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ICurrency } from 'src/app/pages/interfaces/icurrency';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IEnteContacts } from 'src/app/pages/interfaces/ientecontacts';
import { IPricelevel } from 'src/app/pages/interfaces/ipricelevel';
import { ISale } from 'src/app/pages/interfaces/isale';
import { ITax } from 'src/app/pages/interfaces/itax';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

  @ViewChild('enteSearchInput', { static: false }) enteSearchInput!: ElementRef;

  filename: string = '';
  letsdoitForm: FormGroup;
  module: string = 'sale';
  heroe!: ISale;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  salestatus = environment.modules.salestatus;
  shippingMethods = environment.modules.shippingMethods;
  itemId: string | null = null;
  allEntes: IEnte[] = [];
  allContacts: IEnteContacts[] = [];
  allTax: ITax[] = [];
  allCurrency: ICurrency[] = [];
  allPricelevel: IPricelevel[] = [];
  searchResults: IEnte[] = [];
  selectedEnte: IEnte;
  currentPage: number = 1;
  pageSize: number = 10;

  activeSection: string = 'shoppingCart';
  enteSearch: string = '';
  defaultcomments: string[] = [];

  private formSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.createForm();
    this.initializeEnte();
  }

  ngOnInit(): void {
    if (!this.router.url.includes('edit')) { return; }
    this.subscribeToCurrentUser();
    this.route.paramMap.subscribe(params => { this.itemId = params.get('id'); if (this.itemId) { this.loadHeroeStatus(this.itemId); } });
    this.formSubscription = this.letsdoitForm.valueChanges.subscribe(changes => { Object.assign(this.heroe, this.letsdoitForm.value); });
  }

  ngAfterViewInit(): void { if (this.enteSearchInput) { this.enteSearchInput.nativeElement.focus(); } }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      enteid: ['', []],
      enteorder: [''],
      entecode: [''],
      entename: ['', []],
      entecontact: [''],
      currency: ['', [Validators.required]],
      parity: ['', [Validators.required]],
      taxname: ['', [Validators.required]],
      taxamount: ['', [Validators.required]],
      pricelevel: ['', [Validators.required]],
      salename: ['', []],
      validity: ['15', []],
      startdate: ['', []],
      enddate: ['', []],
      defaultcomment: ['', []],
      description: ['', []],
      status: ['', []],
    });
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;

      this.defaultcomments = Array.isArray(this.user.account.defaultcomments)
        ? this.user.account.defaultcomments
        : this.user.account.defaultcomments?.split("\n") || [];

      this.initializeHeroe();
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
      entecontact: '',
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
      type: 'castel-cotizacion',
      countrycode: '',
      items: '',
      startdate: '',
      enddate: '',
      defaultcomment: '',
      description: '',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private initializeEnte(): void {
    this.selectedEnte = {
      id: '',
      accountid: '',
      code: '',
      fullname: '',
      nationality: '',
      rfc: '',
      fiscalname: '',
      fulladdress: '',
      email: '',
      phone: '',
      level: '',
      type: '',
      image: '/assets/img/nofoto.png',
      status: '',
      created_by: '',
      modified_by: ''
    };
  }

  private loadHeroeStatus(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe({
      next: (resp: ISale) => {
        if (resp.status === 'inactivo' || resp.status === 'finalizada') { this.router.navigate(['castel-cotizacion/' + resp.id]); }
        else { this.heroe = resp; this.loadAdditionalData(); }
      },
      error: (error) => { console.error('Error loading sale status:', error); }
    });
  }

  private loadAdditionalData(): void {
    forkJoin({
      taxes: this.repositoryService.getAllData('tax'),
      currencies: this.repositoryService.getAllData('currency'),
      pricelevels: this.repositoryService.getAllData('pricelevel'),
      entes: this.repositoryService.getAllDataFiltered('ente', { 'type': 'cliente' })
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
        if (this.itemId) { this.loadHeroeData(this.itemId); }
      },
      error: (error) => { console.error('Error loading additional data:', error); }
    });
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe({
      next: (resp: ISale) => {
        this.heroe = resp;

        this.letsdoitForm.patchValue({
          enteid: resp.enteid,
          enteorder: resp.enteorder,
          entecode: resp.entecode,
          entename: resp.entename,
          entecontact: resp.entecontact,
          currency: resp.currency,
          parity: resp.parity,
          taxname: resp.taxname,
          taxamount: resp.taxamount,
          pricelevel: resp.pricelevel,
          salename: resp.salename,
          validity: resp.validity,
          startdate: resp.startdate,
          enddate: resp.enddate,
          defaultcomment: resp.defaultcomment,
          description: resp.description,
          status: resp.status
        });

        const ente = this.allEntes.find(e => e.id === resp.enteid);
        if (ente) { this.selectEnte(ente); }
        this.cdr.detectChanges();
      },
      error: (error) => { console.error('Error loading sale data:', error); }
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }

    this.letsdoitForm.patchValue({
      enteorder: this.letsdoitForm.value.enteorder?.toUpperCase() || '',
      salename: this.letsdoitForm.value.salename?.toUpperCase() || '',
      description: this.letsdoitForm.value.description?.toUpperCase() || '',
    });

    const { enteid, enteorder, entecode, entename, entecontact, currency, parity, taxname, taxamount, pricelevel, salename, validity, startdate, enddate, defaultcomment, description, status } = this.letsdoitForm.value;
    
    const payload = {
      ...this.heroe,
      enteid,
      enteorder,
      entecode,
      entename,
      entecontact,
      currency,
      parity,
      taxname,
      taxamount,
      pricelevel,
      salename,
      validity,
      startdate,
      enddate,
      defaultcomment,
      description,
      status
    };
    this.updateItem(payload);
  }

  putEnte(): void {
    const payload = { id: this.heroe.id, enteid: this.selectedEnte.id, entecode: this.selectedEnte.code, entename: this.selectedEnte.fiscalname, entecontact: this.letsdoitForm.value.entecontact };
    this.updateItem(payload);
  }

  private updateItem(item: {}): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: (resp) => { if (resp === 200) { this.toggleSection('shoppingCart'); this.cdr.detectChanges(); } },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  onCurrencyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCurrencyCode = selectElement.value;
    this.changeCurrency(selectedCurrencyCode);
  }

  changeCurrency(code: string) {
    const foundCurrency = this.allCurrency.find(currency => currency.code === code);
    if (foundCurrency) this.letsdoitForm.patchValue({ parity: foundCurrency.amount.toString() });
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
    if (foundTax) this.letsdoitForm.patchValue({ taxamount: foundTax.amount.toString() });
  }

  searchEnte(): void {
    const searchTerm = this.enteSearch?.trim().toLowerCase() || '';
    this.searchResults = searchTerm
      ? this.allEntes.filter(ente => ente.fiscalname?.toLowerCase().includes(searchTerm))
      : [...this.allEntes];

    this.cdr.detectChanges();
  }


  selectEnte(client: IEnte): void {
    this.selectedEnte = client;
    this.repositoryService.getAllDataFiltered('entecontacts', { 'enteid': this.selectedEnte.id })
      .subscribe({
        next: (contacts: IEnteContacts[]) => {
          this.allContacts = contacts;
          const existingContactName = this.heroe.entecontact;
          if (existingContactName) {
            const selectedContact = contacts.find(contact => contact.fullname === existingContactName);
            this.letsdoitForm.patchValue({ entecontact: selectedContact ? selectedContact.fullname : '' });
          }
        },
        error: (err) => { console.error('Error al cargar los contactos:', err); }
      });

    this.letsdoitForm.patchValue({
      enteid: client.id,
      entecode: client.code,
      entename: client.fiscalname,
      enteSearch: ''
    });

    this.searchResults = this.allEntes;
    if (this.enteSearchInput) { this.enteSearchInput.nativeElement.focus(); }
    this.cdr.detectChanges();
  }

  onSelectEnte(item: IEnte): void {
    this.selectEnte(item);
    this.putEnte();
  }

  preventSubmit(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (this.searchResults.length === 1) { this.selectEnte(this.searchResults[0]); }
    }
  }

  truncateText(text: string | null, limit: number = 80): string { return !text ? '' : text.length > limit ? text.substring(0, limit) + '...' : text; }
  toggleSection(section: string): void { this.activeSection = section; }

  deleteItem(): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminarlo'
    }).then(result => {
      if (result.isConfirmed) {
        this.repositoryService.deleteItem(this.module, this.heroe.id).subscribe({
          next: () => this.router.navigate(['castel-cotizacion']),
          error: () => Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        });
      }
    });
  }

  ngOnDestroy(): void { if (this.formSubscription) { this.formSubscription.unsubscribe(); } }
}
