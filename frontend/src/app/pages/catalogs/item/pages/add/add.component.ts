import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, forkJoin, map, of } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ICategory } from 'src/app/pages/interfaces/icategory';
import { ICurrency } from 'src/app/pages/interfaces/icurrency';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IItem } from 'src/app/pages/interfaces/iitem';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit, AfterViewInit {

  @ViewChild('fullnameInput') fullnameInput!: ElementRef;

  filename: string = '';
  letsdoitForm: FormGroup;
  module: string = 'item';
  heroe!: IItem;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  itemUnits = environment.modules.itemUnits;
  isEditMode = false;
  itemId: string | null = null;
  allCategories: ICategory[] = [];
  allSuppliers: IEnte[] = [];
  allCurrency: ICurrency[] = [];
  currencycost: string = '';
  currencyprice: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private repository: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.createForm();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      this.isEditMode = this.itemId !== null;
      this.loadInitialData();
    });
  }

  private loadInitialData(): void {
    forkJoin({
      categories: this.repository.getAllData('category'),
      suppliers: this.repository.getAllDataFiltered('ente', { 'type': 'proveedor' }),
      currencies: this.repository.getAllData('currency'),
    }).subscribe({
      next: ({ categories, suppliers, currencies }) => {
        this.allCategories = categories;
        this.allSuppliers = suppliers.sort((a: IEnte, b: IEnte) => a.fullname.localeCompare(b.fullname));
        this.allCurrency = currencies;
        this.cdr.detectChanges();

        if (this.isEditMode) { this.loadHeroeData(this.itemId!); }
      },
      error: (error) => { Swal.fire('Error', 'No se pudieron cargar los datos', 'error'); }
    });
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  codeExistsValidator(repositoryService: RepositoryService): AsyncValidatorFn {
    return (control: AbstractControl) => {
      if (!control.value.trim()) { return of(null); }
      return repositoryService.getOneByColumn('item', 'code', control.value).pipe(
        map(result => (result && result.id ? { codeExists: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      code: ['', [Validators.required]],
      code_alternative: ['', []],
      categoryid: ['1', [Validators.required]],
      supplierid: ['1058', []],
      description: ['', []],
      unitkey: ['pieza', []],
      cost: ['0', []],
      price: ['0', [Validators.required]],
      currencycost: ['MXN', []],
      currencyprice: ['MXN', []],
      type: ['catalogo', [Validators.required]],
      status: ['activo', [Validators.required]]
    });
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.initializeHeroe();
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      accountid: this.user.accountid,
      categoryid: '1',
      supplierid: '1058',
      categoryname: '',
      suppliername: '',
      code: '',
      code_alternative: '',
      description: '',
      unitkey: 'pieza',
      cost: '0',
      price: '0',
      currencycost: '',
      currencyprice: '',
      image: '/assets/img/nofoto.png',
      type: 'catalogo',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repository.getOneById(this.module, { id }).subscribe({
      next: (resp: IItem) => {
        this.heroe = resp;
        this.patchHeroeForm(resp);
        this.cdr.detectChanges();
      },
      error: (error) => { Swal.fire('Error', 'No se pudo cargar la información', 'error'); },
    });
  }

  private patchHeroeForm(heroe: IItem): void {
    this.letsdoitForm.patchValue({
      code: heroe.code,
      code_alternative: heroe.code_alternative,
      categoryid: heroe.categoryid,
      supplierid: heroe.supplierid,
      description: heroe.description,
      unitkey: heroe.unitkey,
      cost: heroe.cost,
      price: heroe.price,
      currencycost: heroe.currencycost,
      currencyprice: heroe.currencyprice,
      status: heroe.status,
      type: heroe.type
    });
  }

  private getCategoryName(categoryid: string): string {
    const category = this.allCategories.find(cat => cat.id == categoryid);
    return category ? category.fullname : '';
  }

  private getSupplierName(supplierid: string): string {
    const supplier = this.allSuppliers.find(sup => sup.id == supplierid);
    return supplier ? supplier.fullname : '';
  }

  private getPayload(): IItem {
    const { code, code_alternative, categoryid, supplierid, description, unitkey, cost, price, currencycost, currencyprice, status, type } = this.letsdoitForm.value;
    const categoryname = this.getCategoryName(categoryid);
    const suppliername = this.getSupplierName(supplierid);

    return {
      ...this.heroe,
      code: code ? code.toUpperCase() : '',
      code_alternative: code_alternative ? code_alternative.toUpperCase() : '',
      description: description ? description.toUpperCase() : '',
      categoryid,
      supplierid,
      categoryname,
      suppliername,
      unitkey,
      cost,
      price,
      currencycost,
      currencyprice,
      status,
      type
    };
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }

    const { code } = this.letsdoitForm.value;

    this.repository.getOneByColumn('item', 'code', code).subscribe({
      next: (result) => {
        if (result && result.id) {
          if (!this.isEditMode || result.id !== this.heroe.id) {
            Swal.fire({
              title: 'Código ya existe',
              text: 'El código ingresado ya existe. ¿Desea editar este elemento?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Sí, abrirlo',
              cancelButtonText: 'Cerrar'
            }).then((response) => {
              if (response.isConfirmed) { this.router.navigate(['/administracion-de-partes', result.id, 'edit']); }
              else { this.fullnameInput.nativeElement.focus(); this.cdr.detectChanges(); }
            });
          } else { const payload = this.getPayload(); this.updateItem(payload); }
        } else { const payload = this.getPayload(); this.createItem(payload); }
      },
      error: () => { Swal.fire('Error', 'Hubo un problema al validar el código.', 'error'); }
    });
  }


  private updateItem(item: IItem): void {
    this.repository.putItem(this.module, item).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Se actualizó correctamente.', 'success');
        this.router.navigate(['/administracion-de-partes', item.id]);
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }


  private createItem(item: IItem): void {
    this.repository.postItem(this.module, item).subscribe({
      next: (resp: IItem) => {
        Swal.fire('Creado', 'Se creó correctamente.', 'success');
        this.router.navigate(['/administracion-de-partes', resp.id, 'edit']);
      },
      error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error')
    });
  }


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
        this.repository.deleteItem(this.module, this.heroe.id).subscribe({
          next: () => this.router.navigate(['administracion-de-partes']),
          error: () => Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        });
      }
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

      this.repository.uploadFile(formData).subscribe((resp: string) => this.heroe.image = '/' + resp);
    }
  }
}