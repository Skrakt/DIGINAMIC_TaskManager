import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@/core/services/auth';

import { HeaderComponent } from '@/header';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let isAuthenticated = false;
  let authService: {
    isAuthenticated: () => boolean;
    clearToken: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    isAuthenticated = false;
    authService = {
      isAuthenticated: () => isAuthenticated,
      clearToken: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: authService as unknown as AuthService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
  });

  it('doit être créé', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('doit afficher le bouton de connexion quand utilisateur non authentifié', () => {
    isAuthenticated = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Connexion');
  });

  it('doit afficher le bouton de déconnexion quand utilisateur authentifié', () => {
    isAuthenticated = true;
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Se déconnecter');
  });

  it('doit vider le jeton, rediriger vers accueil et rafraîchir la page après confirmation de déconnexion', async () => {
    isAuthenticated = true;
    fixture.detectChanges();
    const dialog = (component as unknown as { dialog: MatDialog }).dialog;
    vi.spyOn(dialog, 'open').mockReturnValue({
      afterClosed: () => of(true),
    } as ReturnType<MatDialog['open']>);
    const router = TestBed.inject(Router);
    const navigationSpy = vi.spyOn(router, 'navigateByUrl').mockResolvedValue(true);
    const refreshSpy = vi
      .spyOn(component as unknown as { refreshPage: () => void }, 'refreshPage')
      .mockImplementation(() => {});

    component.askForLogoutConfirmation();
    await fixture.whenStable();

    expect(authService.clearToken).toHaveBeenCalled();
    expect(navigationSpy).toHaveBeenCalledWith('/home');
    expect(refreshSpy).toHaveBeenCalled();
  });
});
