import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { CreateCAUserComponent } from './user/create-ca/create-ca.component';
import { AdminGuard } from './security/guards/admin.guards';
import { AccessGuard } from './security/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomepageComponent, canActivate: [AccessGuard] },
  { path: 'create-ca-user', component: CreateCAUserComponent, canActivate: [AdminGuard]},
  { path: '**', redirectTo: '/home' },
];
