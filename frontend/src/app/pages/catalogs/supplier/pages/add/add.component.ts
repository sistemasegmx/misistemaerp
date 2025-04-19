import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IStaff } from 'src/app/pages/interfaces/istaff';

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
  module: string = 'ente';
  heroe!: IEnte;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  isEditMode = false;
  itemId: string | null = null;

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
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      this.isEditMode = this.itemId !== null;
      if (this.isEditMode) { this.loadHeroeData(this.itemId!); }
    });
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      code: ['', [Validators.required]],
      fullname: ['', [Validators.required]],
      nationality: ['MX', []],
      rfc: ['', []],
      fiscalname: ['', []],
      fulladdress: ['', []],
      email: ['', []],
      phone: ['', []],
      level: ['1', []],
      status: ['activo', [Validators.required]]
    });
  }

  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; this.initializeHeroe(); }); }

  private initializeHeroe(): void {
    this.heroe = {
      id: '1058',
      accountid: this.user.accountid,
      code: 'PROVEEDOR',
      fullname: 'Sin Proveedor',
      nationality: 'USA',
      rfc: '',
      fiscalname: 'Sin Proveedor',
      fulladdress: '405 Howard Street, San Francisco, CA 94105',
      email: '',
      phone: '',
      level: '1',
      type: 'proveedor',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe(
      (resp: IEnte) => {
        this.heroe = resp;
        this.letsdoitForm.patchValue({
          code: resp.code,
          fullname: resp.fullname,
          nationality: resp.nationality,
          rfc: resp.rfc,
          fiscalname: resp.fiscalname,
          fulladdress: resp.fulladdress,
          email: resp.email,
          phone: resp.phone,
          level: resp.level,
          status: resp.status
        });
        this.cdr.detectChanges();
      },
      error => { console.error('Error loading data:', error); }
    );
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    let { code, fullname, nationality, rfc, fiscalname, fulladdress, email, phone, level, status } = this.letsdoitForm.value;
    fiscalname = fiscalname?.trim() ? fiscalname : fullname;
    const payload = { ...this.heroe, code, fullname, nationality, rfc, fiscalname, fulladdress, email, phone, level, status };
    this.isEditMode ? this.updateItem(payload) : this.createItem(payload);
  }

  private updateItem(item: IEnte): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: () => this.router.navigate(['administracion-de-proveedores']),
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  private createItem(item: IEnte): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: IEnte) => { this.router.navigate(['administracion-de-proveedores']); },
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
        this.repositoryService.deleteItem(this.module, this.heroe.id).subscribe({
          next: () => this.router.navigate(['administracion-de-proveedores']),
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

      this.repositoryService.uploadFile(formData).subscribe((resp: string) => this.heroe.image = '/' + resp);
    }
  }
}
