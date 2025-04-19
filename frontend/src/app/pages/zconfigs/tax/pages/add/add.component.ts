import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ITax } from 'src/app/pages/interfaces/itax';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html'
})
export class AddComponent implements OnInit, AfterViewInit {
  @ViewChild('fullnameInput') fullnameInput!: ElementRef;
  letsdoitForm: FormGroup;
  module: string = 'tax';
  heroe!: ITax;
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
      description: ['', []],
      amount: [0, [Validators.required, Validators.min(0), Validators.max(1)]],
      status: ['activo', [Validators.required]]
    });
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
      if (this.itemId) {
        this.isEditMode = true;
        this.loadHeroeData(this.itemId);
      }
    });
  }

  private initializeHeroe(): void {
    this.heroe = {
      id: '',
      accountid: this.user.accountid,
      fullname: '',
      description: '',
      amount: '0',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe((resp: ITax) => {
      this.letsdoitForm.patchValue({
        fullname: resp.fullname,
        description: resp.description,
        amount: resp.amount,
        status: resp.status
      });
      this.heroe = resp;
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    const { fullname, description, amount, status } = this.letsdoitForm.value;
    const payload = { ...this.heroe, fullname, description, amount, status };
    this.isEditMode && this.itemId ? this.updateItem(payload) : this.createItem(payload);
  }

  private updateItem(item: ITax): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: () => this.router.navigate(['configuracion-de-impuestos']),
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  private createItem(item: ITax): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: ITax) => { this.router.navigate(['configuracion-de-impuestos']); },
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
          next: () => this.router.navigate(['configuracion-de-impuestos']),
          error: () => Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        });
      }
    });
  }
}

