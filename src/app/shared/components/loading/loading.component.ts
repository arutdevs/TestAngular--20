import { Component, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../services/loading.service';

export type LoadingType = 'full' | 'container' | 'button';
@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  private loadingService = inject(LoadingService);

  @Input() type: LoadingType = 'full';

  // อ่านค่าจาก service (signals)
  show = this.loadingService.isLoading;
  message = this.loadingService.message;

  // ตัวอย่าง: ถ้าคุณอยากได้ class binding จาก signal
  overlayClass = computed(() => ({
    'loading-overlay': true,
    show: this.show(),
  }));
}
