import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Employee } from '../../features/employee/models/employee';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private readonly baseUrl = 'http://localhost:5193/api/Employee';

  constructor(private http: HttpClient) {}

  getEmployeeList(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.baseUrl}/list`).pipe(
      catchError((error) => {
        console.error('Failed to fetch employee list:', error);
        return throwError(() => error);
      }),
    );
  }

  getEmployeeById(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Failed to fetch employee:', error);
        return throwError(() => error);
      }),
    );
  }

  createEmployee(
    employee: Omit<Employee, 'id' | 'createdDate' | 'updatedDate'>,
  ): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/create`, employee).pipe(
      catchError((error) => {
        console.error('Failed to create employee:', error);
        return throwError(() => error);
      }),
    );
  }

  updateEmployee(
    employee: Employee,
  ): Observable<Employee> {
    return this.http.post<Employee>(`${this.baseUrl}/update`, employee).pipe(
      catchError((error) => {
        console.error('Failed to update employee:', error);
        return throwError(() => error);
      }),
    );
  }

  deleteEmployee(
    id: Number,
  ): Observable<Employee> {
    return this.http.put<Employee>(`${this.baseUrl}/remove/${id}`, id).pipe(
      catchError((error) => {
        console.error('Failed to update employee:', error);
        return throwError(() => error);
      }),
    );
  }
}
