import { Component, effect, inject, OnInit, runInInjectionContext, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  EmployeeInfoListModel,
  UserManagementService,
} from '../../../services/usermanagement.service';
import { single } from 'rxjs';
@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index {
  employeeList = signal<EmployeeInfoListModel[]>([]);
  private userService = inject(UserManagementService);

  userResource = this.userService.getEmployeeResource({ empstatus: '' });

  // ✅ effect ถูกสร้างใน injection context (field initializer)
  logEffect = effect(() => {
    if (this.userResource.hasValue()) {
      const response = this.userResource.value();
      if (response?.success) {
        this.employeeList.set(response.data);
      }
    }

    console.log('Status:', this.userResource.status());
    console.log('Loading:', this.userResource.isLoading());
  });
}
