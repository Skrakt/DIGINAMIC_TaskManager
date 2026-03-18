import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@/core/services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authenticationService = inject(AuthService);
  const accessToken = authenticationService.getToken();

  if (accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  return next(req);
};
