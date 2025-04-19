import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
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
  module: string = 'staff';
  heroe!: IStaff;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  isEditMode = false;
  itemId: string | null = null;
  allStaff: IStaff[] = [];

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
      this.loadAllStaff();
      if (this.isEditMode) this.loadHeroeData(this.itemId!);
    });
  }

  ngAfterViewInit(): void {
    this.fullnameInput.nativeElement.focus();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      managerid: ['', []],
      fullname: ['', [Validators.required]],
      dob: ['', []],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', []],
      fulladdress: ['', []],
      hire_date: ['', [Validators.required]],
      salary: ['', []],
      have_user: ['', []],
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
      managerid: '',
      managername: '',
      fullname: '',
      dob: '',
      email: '',
      phone: '',
      fulladdress: '',
      hire_date: '',
      salary: '',
      have_user: '',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadAllStaff(): void {
    this.repositoryService.getAllData('staff')
      .subscribe({
        next: (staff: IStaff[]) => {
          this.allStaff = staff;
          this.cdr.detectChanges();
        },
        error: (error) => { console.error('Error loading data:', error); }
      });
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe(
      (resp: IStaff) => {
        this.heroe = resp;
        this.letsdoitForm.patchValue({
          managerid: resp.managerid,
          fullname: resp.fullname,
          dob: resp.dob,
          email: resp.email,
          phone: resp.phone,
          fulladdress: resp.fulladdress,
          hire_date: resp.hire_date,
          salary: resp.salary,
          have_user: resp.have_user,
          status: resp.status
        });
        this.cdr.detectChanges();
      },
      error => { console.error('Error loading data:', error); }
    );
  }

  private getManagerName(managerid: string): string {
    const manager = this.allStaff.find(staff => staff.id == managerid);
    return manager ? manager.fullname : '';
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    const { managerid, fullname, dob, email, phone, fulladdress, hire_date, salary, have_user, status } = this.letsdoitForm.value;
    const managername = this.getManagerName(managerid);
    const payload = { ...this.heroe, managerid, managername, fullname, dob, email, phone, fulladdress, hire_date, salary, have_user, status };
    this.isEditMode ? this.updateItem(payload) : this.createItem(payload);
  }

  private updateItem(item: IStaff): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: () => this.router.navigate(['administracion-de-empleados']),
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  private createItem(item: IStaff): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: IStaff) => { this.router.navigate(['administracion-de-empleados']); },
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
          next: () => this.router.navigate(['administracion-de-empleados']),
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
