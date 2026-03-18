import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '@/core/services/auth';

export const authGuard: CanActivateFn = () => {
  const authenticationService = inject(AuthService);
  const router = inject(Router);

  if (authenticationService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
