import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
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
  module: string = 'user';
  heroe!: IUser;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  itemId: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private formBuilder: FormBuilder
  ) {
    this.letsdoitForm = this.createForm();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToRouteParams();
  }

  ngAfterViewInit(): void {
    this.fullnameInput.nativeElement.focus();
  }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['', [Validators.required, Validators.minLength(6)]]
    }, { validators: this.passwordMatchValidator });
  }

  private subscribeToCurrentUser(): void {
    this.authService.currentUserSubject.subscribe(user => {
      this.user = user;
      this.initializeHeroe();
    });
  }

  private subscribeToRouteParams(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id');
      if (this.itemId) { this.loadHeroeData(this.itemId); }
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      accountid: this.user.accountid,
      employeeid: '',
      email: '',
      username: '',
      password: '',
      fullname: '',
      phone: '',
      description: '',
      lastlogin: '',
      type: 'staff',
      image: '/assets/img/nofoto.png',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe((resp: IUser) => {
      this.letsdoitForm.patchValue({
        fullname: resp.fullname,
        email: resp.email,
        password: resp.password
      });
      this.heroe = resp;
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    const { fullname, email, password } = this.letsdoitForm.value;
    const payload = { ...this.heroe, fullname, email, password };
    this.createItem(payload);
  }

  private createItem(item: IUser): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: IUser) => { this.router.navigate(['configuracion-de-usuarios']); },
      error: () => Swal.fire('Error', 'No se pudo crear el Registro', 'error')
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

  private passwordMatchValidator: ValidatorFn = (formGroup: AbstractControl): { [key: string]: boolean } | null => {
    const password = formGroup.get('password');
    const confirmPassword = formGroup.get('confirm_password');
    return password && confirmPassword && password.value !== confirmPassword.value ? { 'mismatch': true } : null;
  };
}

