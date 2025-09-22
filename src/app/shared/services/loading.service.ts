import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSignal = signal(false);
  private messageSignal = signal<string | undefined>(undefined);

  readonly isLoading = this.loadingSignal.asReadonly();
  readonly message = this.messageSignal.asReadonly();

  show(message?: string): void {
    this.loadingSignal.set(true);
    this.messageSignal.set(message);
  }

  hide(): void {
    this.loadingSignal.set(false);
    this.messageSignal.set(undefined);
  }
}
