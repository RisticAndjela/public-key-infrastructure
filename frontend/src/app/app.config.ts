import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app-routing.module';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { AuthService } from './security/auth/auth.service';
import { tokenInterceptor } from './security/auth/auth.interceptor';

function setupAuth(auth: AuthService) {
  return () => auth.init();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: setupAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
};
