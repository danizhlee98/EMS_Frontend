import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EmployeeService } from '../../../../../core/service/employee-service';
import { Employee } from '../../../models/employee';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-employee-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-table.html',
  styleUrl: './employee-table.scss',
})
export class EmployeeTableComponent implements OnInit {
  employees: Employee[] = [];
  loading = false;
  errorMessage = '';

  constructor(
    private employeeService: EmployeeService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeList().subscribe({
      next: (employees) => {
        this.employees = employees ?? [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching employees:', error);
        this.errorMessage = error?.error?.message || 'Failed to load employees. Please try again.';
        this.loading = false;
      },
    });
  }

  goToCreate(): void {
    this.router.navigate(['/employees/new']);
  }

  editEmployee(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit'], { state: { employee } });
  }

  deleteEmployee(employee: Employee): void {

    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) {
      return;
    }
    this.loading = true;
  
    this.employeeService.deleteEmployee(employee.id).subscribe({
      next: () => {
        this.loading = false;
        this.employees = this.employees.filter(e => e.id !== employee.id);
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = 'Failed to delete employee';
        console.error(err);
      }
    });
  }
  

  formatDate(value: unknown): string {
    if (value === null || value === undefined || value === '') return '—';

    const date = value instanceof Date ? value : new Date(value as never);
    if (Number.isNaN(date.getTime())) return '—';

    return new Intl.DateTimeFormat(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  }
}
