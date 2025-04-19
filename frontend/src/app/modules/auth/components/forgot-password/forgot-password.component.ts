import { ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormatResponse } from '../../models/auth.model';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent implements OnInit, OnDestroy, AfterViewInit {

  @ViewChild('emailInput') emailInput!: ElementRef;

  defaultAuth: any = { email: '' };
  forgotPasswordForm: FormGroup;
  hasError: boolean;
  hasState: boolean;
  returnUrl: string;
  isLoading$: Observable<boolean>;

  private unsubscribe: Subscription[] = [];

  get f() { return this.forgotPasswordForm.controls; }

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    if (this.authService.currentUserValue.id) this.router.navigate(['/']);

    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || '/';
  }

  ngAfterViewInit() {
    this.emailInput.nativeElement.focus();
  }


  initForm() {
    this.forgotPasswordForm = this.fb.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ]
    });
  }

  submit() {
    this.hasError = false;
    this.hasState = false;
    const forgotPasswordSubscr = this.authService.forgotPassword(this.f.email.value)
      .pipe(first())
      .subscribe((resp: FormatResponse) => { resp != undefined && resp.status === 200 ? this.hasError = true : this.hasState = true; });
    this.unsubscribe.push(forgotPasswordSubscr);
  }

  ngOnDestroy() { this.unsubscribe.forEach((sb) => sb.unsubscribe()); }
}
