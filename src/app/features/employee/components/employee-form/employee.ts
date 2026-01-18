import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ActivatedRoute, Router} from '@angular/router';
import { EmployeeService } from '../../../../core/service/employee-service';
import { Employee } from '../../models/employee';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule ],
  templateUrl: './employee.html',
  styleUrl: './employee.scss',
})
export class EmployeeFormComponent implements OnInit {
  employeeForm: FormGroup;
  loading = false;
  loadingEmployee = false;
  successMessage = '';
  errorMessage = '';
  isEditMode = false;
  employeeId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.employeeForm = this.fb.group({
      id: [0],
      name: ['', [Validators.required]],
      code: ['', [Validators.required, Validators.maxLength(4)]],
      createdBy: ['', [Validators.required]],
      createdDate: [{ value: null, disabled: true }]
    });
  }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const parsedId = idParam ? Number(idParam) : null;

    this.employeeId = Number.isFinite(parsedId as number) ? (parsedId as number) : null;
    this.isEditMode = !!this.employeeId;

    if (!this.isEditMode || !this.employeeId) return;

    this.loadEmployeeForEdit();
  }

  private loadEmployeeForEdit(): void {
    if (!this.employeeId) return;
    const stateEmployee = (window.history.state?.employee as Employee | undefined) ?? undefined;
    if (stateEmployee?.id === this.employeeId) {
      this.employeeForm.patchValue({
        id: stateEmployee.id,
        name: stateEmployee.name,
        code: stateEmployee.code,
        createdBy: stateEmployee.createdBy,
        createdDate: stateEmployee.createdDate
      });
      return;
    }

    this.loadingEmployee = true;
    this.errorMessage = '';

    this.employeeService.getEmployeeById(this.employeeId).subscribe(res => {
      this.employeeForm.patchValue(res);
    });
  }

  goBack(): void {
    this.router.navigate(['/employees']);
  }

  onSubmit(): void {
    if (this.employeeForm.valid) {
      this.loading = true;
      this.successMessage = '';
      this.errorMessage = '';

      const formValue = this.employeeForm.value;

      const request$ =
        this.isEditMode && this.employeeId
          ? this.employeeService.updateEmployee(formValue)
          : this.employeeService.createEmployee(formValue);

      request$.subscribe({
        next: () => {
          this.loading = false;
          this.successMessage = this.isEditMode
            ? 'Employee updated successfully!'
            : 'Employee created successfully!';
          this.router.navigate(['/employees']);
        },
        error: (error) => {
          this.loading = false;
          this.errorMessage =
            error?.error?.message ||
            (this.isEditMode
              ? 'Failed to update employee. Please try again.'
              : 'Failed to create employee. Please try again.');
          console.error(this.isEditMode ? 'Error updating employee:' : 'Error creating employee:', error);
        },
      });
    } else {
      this.employeeForm.markAllAsTouched();
    }
  }

  get name() {
    return this.employeeForm.get('name');
  }

  get code() {
    return this.employeeForm.get('code');
  }

  get createdBy() {
    return this.employeeForm.get('createdBy');
  }

  get createdDate() {
    return this.employeeForm.get('createdDate');
  }

  onCodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const upperValue = input.value.toUpperCase().slice(0, 4);
    this.employeeForm.patchValue({ code: upperValue }, { emitEvent: false });
    input.value = upperValue;
  }
}
