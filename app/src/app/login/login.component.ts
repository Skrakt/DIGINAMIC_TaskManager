import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '@/core/services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  readonly loginFormGroup;
  isLoginRequestInProgress = false;
  loginErrorMessage = '';

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
  ) {
    this.loginFormGroup = this.formBuilder.nonNullable.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  submitLoginForm() {
    if (this.loginFormGroup.invalid || this.isLoginRequestInProgress) {
      this.loginFormGroup.markAllAsTouched();
      return;
    }

    this.isLoginRequestInProgress = true;
    this.loginErrorMessage = '';

    this.authService
      .login(this.loginFormGroup.getRawValue())
      .pipe(finalize(() => (this.isLoginRequestInProgress = false)))
      .subscribe({
        next: async () => {
          await this.router.navigateByUrl('/dashboard');
        },
        error: () => {
          this.loginErrorMessage = 'Identifiants invalides';
        },
      });
  }
}
