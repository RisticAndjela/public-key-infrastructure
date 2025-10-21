import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const keycloak = inject(AuthService);
  if (!keycloak || !keycloak.isReady()) {return next(req);}
  return from(keycloak.updateTokenIfNeeded()).pipe(
    switchMap((token) => {
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
