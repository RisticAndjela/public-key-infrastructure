import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { AccessGuard } from './security/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, canActivate: [AccessGuard] },
  { path: '**', redirectTo: '/home' },
];
