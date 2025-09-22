// usermanagement.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';

export interface EmployeeInfoAllModel {
  empcode?: string;
  departmentcode?: string;
  divisioncode?: string;
  positioncode?: string;
  emptype?: string;
  empstatus?: string;
}

export interface EmployeeInfoListModel {
  empcode: string;
  emptype: string;
  emptypename: string;
  emptitlecode: string;
  empnamelocal: string;
  empsurnamelocal: string;
  empnicknamelocal: string;
  empnameen: string;
  empsurnameen: string;
  empnicknameen: string;
  empphone: string;
  empemail: string;
  emppositioncode: string;
  emppositionlocal: string;
  emppositionen: string;
  empdepartmentcode: string;
  empdepartmentlocal: string;
  empdepartmenten: string;
  empdivisioncode: string;
  empdivisionlocal: string;
  empdivisionen: string;
  empimage: string; // Base64 image string
  empstatus: string;
  startdate: string; // ISO date string
  resigndate: string | null; // nullable
  branchcode: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: string[];
}

@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  private http = inject(HttpClient);
  private baseUrl = 'https://sit-hris-api.api-soft.in.th'; // adjust base URL as needed

  // Modern httpResource approach for getting employee data
  getEmployeeResource(searchParams: EmployeeInfoAllModel) {
    return httpResource<ApiResponse<EmployeeInfoListModel[]>>(() => ({
      url: `${this.baseUrl}/UserManagement/EmployeeInfoAll`,
      method: 'POST',
      body: searchParams,
      headers: {
        'Content-Type': 'application/json',
      },
    }));
  }

  // Alternative: Traditional Observable approach (for comparison)
  getEmployeeInfoAll(employeeinfo: EmployeeInfoAllModel) {
    const url = `${this.baseUrl}/UserManagement/EmployeeInfoAll`;
    return this.http.post<ApiResponse<EmployeeInfoListModel[]>>(url, employeeinfo);
  }
}
