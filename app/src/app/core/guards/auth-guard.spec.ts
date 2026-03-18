import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth';
import { authGuard } from '@/core/guards/auth-guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let authService: { isAuthenticated: ReturnType<typeof vi.fn> };
  let router: { createUrlTree: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    authService = { isAuthenticated: vi.fn() };
    router = { createUrlTree: vi.fn().mockReturnValue({} as any) };

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService as unknown as AuthService },
        { provide: Router, useValue: router as unknown as Router },
      ],
    });
  });

  it('doit autoriser accès quand utilisateur authentifié', () => {
    authService.isAuthenticated.mockReturnValue(true);

    const result = executeGuard({} as any, {} as any);

    expect(result).toBe(true);
  });

  it('doit rediriger vers connexion quand utilisateur non authentifié', () => {
    authService.isAuthenticated.mockReturnValue(false);

    const result = executeGuard({} as any, {} as any);

    expect(router.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBe(router.createUrlTree.mock.results[0]?.value);
  });
});
