import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnte } from 'src/app/pages/interfaces/iente';
import { IUser } from 'src/app/pages/interfaces/iuser';
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
  allSellers: IUser[] = [];

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
      if (this.isEditMode) { this.loadHeroeData(this.itemId!); }
    });
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      staffid: [''],
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
      id: '',
      accountid: this.user.accountid,
      staffid: '',
      code: '',
      fullname: '',
      nationality: 'MX',
      rfc: '',
      fiscalname: '',
      fulladdress: '',
      email: '',
      phone: '',
      level: '1',
      type: 'cliente',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    forkJoin({
      allSellers: this.repository.getAllData('user') as Observable<IUser[]>,
      heroeData: this.repository.getOneById(this.module, { id }) as Observable<IEnte>
    }).subscribe({
      next: ({ allSellers, heroeData }) => {
        this.allSellers = allSellers;
        this.heroe = heroeData;
        this.letsdoitForm.patchValue({
          staffid: heroeData.staffid,
          code: heroeData.code,
          fullname: heroeData.fullname,
          nationality: heroeData.nationality,
          rfc: heroeData.rfc,
          fiscalname: heroeData.fiscalname,
          fulladdress: heroeData.fulladdress,
          email: heroeData.email,
          phone: heroeData.phone,
          level: heroeData.level,
          status: heroeData.status
        });
        this.cdr.detectChanges();
      },
      error: (err) => { console.error('Error loading data:', err); },
      complete: () => { console.log('Data loading completed'); }
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    let { staffid, code, fullname, nationality, rfc, fiscalname, fulladdress, email, phone, level, status } = this.letsdoitForm.value;
    fiscalname = fiscalname?.trim() ? fiscalname : fullname;
    const payload = { ...this.heroe, staffid, code, fullname, nationality, rfc, fiscalname, fulladdress, email, phone, level, status };
    this.isEditMode ? this.updateItem(payload) : this.createItem(payload);
  }

  private updateItem(item: IEnte): void {
    this.repository.putItem(this.module, item).subscribe({
      next: () => this.router.navigate(['administracion-de-clientes']),
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  private createItem(item: IEnte): void {
    this.repository.postItem(this.module, item).subscribe({
      next: (resp: IEnte) => {
        if (resp.id) this.router.navigate(['administracion-de-clientes/' + resp.id])
        else this.router.navigate(['administracion-de-clientes']);
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
          next: () => this.router.navigate(['administracion-de-clientes']),
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
