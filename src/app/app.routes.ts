import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'role-selection',
    loadComponent: () => import('./features/auth/role-selection/role-selection.component').then(m => m.RoleSelectionComponent)
  },
  {
    path: 'citizen-dashboard',
    loadComponent: () => import('./pages/citizen-dashboard/citizen-dashboard.component').then(m => m.CitizenDashboardComponent)
  },
  {
    path: 'collector-dashboard',
    loadComponent: () => import('./pages/collector-dashboard/collector-dashboard.component').then(m => m.CollectorDashboardComponent)
  },
  {
    path: 'admin-dashboard',
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'rewards',
    loadComponent: () => import('./pages/rewards/rewards.component').then(m => m.RewardsComponent)
  },
  {
    path: 'my-requests',
    loadComponent: () => import('./pages/my-requests/my-requests.component').then(m => m.MyRequestsComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./features/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'notifications',
    loadComponent: () => import('./features/notifications/notifications.component').then(m => m.NotificationsComponent)
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
  },
  {
    path: '**',
    loadComponent: () => import('./features/errors/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

