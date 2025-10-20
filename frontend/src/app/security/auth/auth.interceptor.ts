import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export const tokenInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthService);

  if (!auth || !auth.isLoggedIn()) {
    return next(request);
  }

  return from(auth.updateTokenIfNeeded()).pipe(
    switchMap((jwt) => {
      if (!jwt) {
        return next(request);
      }

      const modifiedRequest = request.clone({
        setHeaders: { Authorization: `Bearer ${jwt}` },
      });

      return next(modifiedRequest);
    })
  );
};
