import { Routes } from '@angular/router';
import { ShellComponent } from './shared/ui/shell/shell.component';

export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard.component').then(
            (m) => m.DashboardComponent
          ),
      },
      {
        path: 'customers',
        loadComponent: () =>
          import('./features/customers/customers.component').then(
            (m) => m.CustomersComponent
          ),
      },
      {
        path: 'leads',
        loadComponent: () =>
          import('./features/leads/leads.component').then(
            (m) => m.LeadsComponent
          ),
      },
      {
        path: 'deals',
        loadComponent: () =>
          import('./features/deals/deals.component').then(
            (m) => m.DealsComponent
          ),
      },
      {
        path: 'tasks',
        loadComponent: () =>
          import('./features/tasks/tasks.component').then(
            (m) => m.TasksComponent
          ),
      },
      {
        path: 'customers/:id',
        loadComponent: () =>
          import(
            './features/customers/customer-detail/customer-detail.component'
          ).then((m) => m.CustomerDetailComponent),
      },

      {
        path: 'settings',
        loadComponent: () =>
          import('./features/settings/settings.component').then(
            (m) => m.SettingsComponent
          ),
      },
    ],
  },

  { path: '**', redirectTo: 'dashboard' },
];
