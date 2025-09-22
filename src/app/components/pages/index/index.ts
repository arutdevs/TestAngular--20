import { 
  Component, 
  computed, 
  effect, 
  inject, 
  Injector, 
  runInInjectionContext, 
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  JsonPlaceholderUser,
  UserManagementService,
} from '../../../services/usermanagement.service';

@Component({
  selector: 'app-index',
  imports: [CommonModule],
  templateUrl: './index.html',
  styleUrl: './index.scss',
})
export class Index {
  userList = signal<JsonPlaceholderUser[]>([]);
  usersResource = signal<any>(null);
  
  private userService = inject(UserManagementService);
  private injector = inject(Injector); // ⭐ เพิ่มตัวนี้

  dataEffect = effect(() => {
    const resource = this.usersResource();
    if (!resource) return;

    switch (resource.status()) {
      case 'loading':
        console.log('กำลังโหลดข้อมูล...');
        break;
      case 'resolved':
        const users = resource.value();
        this.userList.set(users || []);
        console.log('Users loaded:', users?.length ?? 0);
        break;
      case 'error':
        console.error('Error:', resource.error());
        break;
    }
  });

  // ⭐ แก้ไข loadData method
  loadData() {
    console.log('🚀 สร้าง resource และโหลดข้อมูล...');
    
    // ใช้ runInInjectionContext
    runInInjectionContext(this.injector, () => {
      const resource = this.userService.getUsersResource();
      this.usersResource.set(resource);
    });
  }

  refreshData() {
    const resource = this.usersResource();
    if (resource) {
      resource.reload();
    }
  }
}