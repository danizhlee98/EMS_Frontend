import { Routes } from '@angular/router';
import { EmployeeFormComponent } from './features/employee/components/employee-form/employee';
import { EmployeeTableComponent } from './features/employee/components/table/employee-table/employee-table';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'employees',
  },
  {
    path: 'employees',
    component: EmployeeTableComponent,
  },
  {
    path: 'employees/new',
    component: EmployeeFormComponent,
  },
  {
    path: 'employees/:id/edit',
    component: EmployeeFormComponent,
  },
  // Backward-compatible route
  {
    path: 'employee-form',
    pathMatch: 'full',
    redirectTo: 'employees/new',
  },
  {
    path: '**',
    redirectTo: 'employees',
  },
];
