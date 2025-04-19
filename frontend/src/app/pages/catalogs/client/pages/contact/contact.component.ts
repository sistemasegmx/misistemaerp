import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserModel } from 'src/app/modules/auth';
import { IEnteContacts } from 'src/app/pages/interfaces/ientecontacts';
import { RepositoryService } from 'src/app/pages/services/repository.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit, AfterViewInit {

  @ViewChild('fullnameInput') fullnameInput!: ElementRef;
  letsdoitForm: FormGroup;
  contacts: IEnteContacts[] = [];
  user!: UserModel;
  isEditMode = false;
  itemId: string | null = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repository: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      position: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d+$/)]],
      enteid: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.itemId = params.get('id') || 'defaultEnteId';
      this.letsdoitForm.patchValue({ enteid: this.itemId });
      this.loadContacts();
    });
    this.authService.currentUserSubject.subscribe(user => this.user = user);
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private loadContacts(): void {
    this.repository.getAllDataFiltered('entecontacts', { 'enteid': this.itemId })
      .subscribe({
        next: (resp: IEnteContacts[]) => { this.contacts = resp; this.cdr.detectChanges(); },
        error: () => Swal.fire('Error', 'Error al cargar los contactos', 'error')
      });
  }

  loadContact(contact: IEnteContacts): void {
    this.isEditMode = true;
    this.itemId = contact.id ?? null;
    this.letsdoitForm.patchValue(contact);
  }


  saveContact(): void {
    if (this.letsdoitForm.invalid) { Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error'); return; }

    const formValue = this.letsdoitForm.value;
    const enteidValue = formValue.enteid || this.itemId;

    const payload: IEnteContacts = {
      enteid: enteidValue,
      fullname: formValue.fullname,
      position: formValue.position,
      email: formValue.email,
      phone: formValue.phone,
      created_by: this.user.id,
      modified_by: this.user.id,
    };

    if (this.isEditMode && this.itemId) { payload.id = this.itemId; this.updateContact(payload); }
    else { this.createContact(payload); }
  }


  private createContact(contact: IEnteContacts): void {
    this.repository.postItem('entecontacts', contact).subscribe({
      next: (newContact: IEnteContacts) => {
        this.contacts.push(newContact);
        this.letsdoitForm.reset(); this.isEditMode = false; this.cdr.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudo crear el Contacto', 'error')
    });
  }

  private updateContact(contact: IEnteContacts): void {
    this.repository.putItem('entecontacts', contact).subscribe({
      next: () => {
        const index = this.contacts.findIndex(c => c.id === contact.id);
        if (index !== -1) this.contacts[index] = contact;
        this.letsdoitForm.reset(); this.isEditMode = false; this.cdr.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Contacto', 'error')
    });
  }

  deleteContact(contact: IEnteContacts): void {
    Swal.fire({
      title: '¿Estás seguro?', text: 'No podrás revertir esto.', icon: 'warning', showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then(result => {
      if (result.isConfirmed) {
        this.repository.deleteItem('entecontacts', contact.id).subscribe({
          next: () => {
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
            Swal.fire('Eliminado', 'El contacto ha sido eliminado.', 'success');
            this.cdr.detectChanges();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el Contacto', 'error')
        });
      }
    });
  }

  cancelEdit(): void { this.isEditMode = false; this.letsdoitForm.reset(); }
}
