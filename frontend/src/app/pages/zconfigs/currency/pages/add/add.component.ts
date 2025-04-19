import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { ICurrency } from 'src/app/pages/interfaces/icurrency';
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
  module: string = 'currency';
  heroe!: ICurrency;
  user!: UserModel;
  baseUrl = environment.baseUrl;
  basestatus = environment.modules.basestatus;
  basecurrency = environment.modules.basecurrency;
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
      code: ['', []],
      amount: [0, [Validators.required]],
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
      code: '',
      amount: '0',
      status: 'activo',
      created_by: this.user.id,
      modified_by: this.user.id
    };
  }

  private loadHeroeData(id: string): void {
    this.repositoryService.getOneById(this.module, { id }).subscribe((resp: ICurrency) => {
      this.letsdoitForm.patchValue({
        fullname: resp.fullname,
        code: resp.code,
        amount: resp.amount,
        status: resp.status
      });
      this.heroe = resp;
    });
  }

  saveItem(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }
    const { fullname, code, amount, status } = this.letsdoitForm.value;
    const payload = { ...this.heroe, fullname, code, amount, status };
    this.isEditMode && this.itemId ? this.updateItem(payload) : this.createItem(payload);
  }

  private updateItem(item: ICurrency): void {
    this.repositoryService.putItem(this.module, item).subscribe({
      next: () => this.router.navigate(['configuracion-de-monedas']),
      error: () => Swal.fire('Error', 'No se pudo actualizar el Registro', 'error')
    });
  }

  private createItem(item: ICurrency): void {
    this.repositoryService.postItem(this.module, item).subscribe({
      next: (resp: ICurrency) => { this.router.navigate(['configuracion-de-monedas']); },
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
          next: () => this.router.navigate(['configuracion-de-monedas']),
          error: () => Swal.fire('Error', 'No se pudo eliminar el registro', 'error')
        });
      }
    });
  }

  onCurrencyChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const selectedCurrencyCode = selectElement.value;
    this.changeCurrency(selectedCurrencyCode);
  }

  changeCurrency(currencyCode: string) {
    const foundCurrency = this.basecurrency.find(currency => currency.ccode === currencyCode);

    if (foundCurrency) {
      this.heroe.name = foundCurrency.cname;
      this.fullnameInput.nativeElement.value = foundCurrency.cname;
    }
  }
}

