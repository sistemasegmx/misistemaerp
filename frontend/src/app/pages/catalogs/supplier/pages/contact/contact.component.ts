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
  itemId: string | null | undefined = null;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private repositoryService: RepositoryService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.letsdoitForm = this.createForm();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => { this.itemId = params.get('id') || 'defaultEnteId'; this.loadContacts(); });
    this.subscribeToCurrentUser();
  }

  ngAfterViewInit(): void { this.fullnameInput.nativeElement.focus(); }

  private subscribeToCurrentUser(): void { this.authService.currentUserSubject.subscribe(user => { this.user = user; }); }

  private createForm(): FormGroup {
    return this.formBuilder.group({
      fullname: ['', [Validators.required]],
      position: [''],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern(/^\d+$/)]],
      enteid: ['']
    });
  }


  private loadContacts(): void {
    this.repositoryService.getAllDataFiltered('entecontacts', { 'enteid': this.itemId })
      .subscribe({
        next: (resp: IEnteContacts[]) => {
          this.contacts = resp;
          this.letsdoitForm.patchValue({ enteid: this.itemId });
          this.cdr.detectChanges();
        },
        error: () => Swal.fire('Error', 'Error al cargar los contactos', 'error')
      });
  }

  loadContact(contact: IEnteContacts): void {
    this.isEditMode = true;

    this.itemId = contact.id;
    const enteid = contact.enteid;

    this.letsdoitForm.patchValue({
      fullname: contact.fullname,
      position: contact.position,
      email: contact.email,
      phone: contact.phone,
      enteid: enteid
    });
  }

  saveContact(): void {
    if (this.letsdoitForm.invalid) {
      Swal.fire('Formulario inválido', 'Por favor revise los campos', 'error');
      return;
    }

    const formValue = this.letsdoitForm.value;
    const enteidValue = formValue.enteid || this.itemId;

    const payload: IEnteContacts = {
      fullname: formValue.fullname,
      position: formValue.position,
      email: formValue.email,
      phone: formValue.phone,
      enteid: enteidValue,
      created_by: this.user.id,
      modified_by: this.user.id
    };

    if (this.isEditMode && this.itemId) {
      payload.id = this.itemId;
      this.updateContact(payload);
    } else {
      this.createContact(payload);
    }
  }

  private createContact(contact: IEnteContacts): void {
    if (!contact.enteid) { Swal.fire('Error', 'El ID del ente es requerido', 'error'); return; }

    this.repositoryService.postItem('entecontacts', contact).subscribe({
      next: (newContact: IEnteContacts) => {
        this.contacts.push(newContact);
        this.letsdoitForm.reset();
        this.isEditMode = false;
        this.cdr.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudo crear el Contacto', 'error')
    });
  }


  private updateContact(contact: IEnteContacts): void {
    const observer = {
      next: () => {
        const index = this.contacts.findIndex(c => c.id === contact.id);
        if (index !== -1) { this.contacts[index] = contact; }
        this.letsdoitForm.reset();
        this.isEditMode = false;
        this.cdr.detectChanges();
      },
      error: () => Swal.fire('Error', 'No se pudo actualizar el Contacto', 'error')
    };

    this.repositoryService.putItem('entecontacts', contact).subscribe(observer);
  }

  deleteContact(contact: IEnteContacts): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminarlo'
    }).then(result => {
      if (result.isConfirmed) {
        const observer = {
          next: () => {
            this.contacts = this.contacts.filter(c => c.id !== contact.id);
            Swal.fire('Eliminado', 'El contacto ha sido eliminado.', 'success');
            this.cdr.detectChanges();
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar el Contacto', 'error')
        };

        this.repositoryService.deleteItem('entecontacts', contact.id).subscribe(observer);
      }
    });
  }

  cancelEdit(): void { this.isEditMode = false; this.letsdoitForm.reset(); }
}
