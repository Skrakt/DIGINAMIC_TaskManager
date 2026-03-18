import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from '@/login';
import { AuthService } from '@/core/services/auth';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: { navigateByUrl: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    authService = { login: vi.fn() };
    router = { navigateByUrl: vi.fn().mockResolvedValue(true) };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: authService as unknown as AuthService },
        { provide: Router, useValue: router as unknown as Router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('doit être créé', () => {
    expect(component).toBeTruthy();
  });

  it('doit se connecter et naviguer vers le tableau de bord', () => {
    authService.login.mockReturnValue(
      of({
        accessToken: 'token',
        user: { id: '1', email: 'john@doe.com', role: 'user' },
      }),
    );
    component.loginFormGroup.setValue({
      email: 'john@doe.com',
      password: 'secret',
    });

    component.submitLoginForm();

    expect(authService.login).toHaveBeenCalledWith({
      email: 'john@doe.com',
      password: 'secret',
    });
    expect(router.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it("doit afficher un message d'erreur quand la connexion échoue", () => {
    authService.login.mockReturnValue(throwError(() => new Error('Non autorisé')));
    component.loginFormGroup.setValue({
      email: 'john@doe.com',
      password: 'bad-password',
    });

    component.submitLoginForm();

    expect(component.loginErrorMessage).toBe('Identifiants invalides');
  });
});
