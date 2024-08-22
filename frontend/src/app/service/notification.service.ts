import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private toastr: ToastrService) { }

  showSuccess(message: string, title: string = 'Success'): void {
    this.showNotification('success', message, title);
  }

  showError(message: string, title: string = 'Error'): void {
    this.showNotification('error', message, title);
  }

  showInfo(message: string, title: string = 'Info'): void {
    this.showNotification('info', message, title);
  }

  showWarning(message: string, title: string = 'Warning'): void {
    this.showNotification('warning', message, title);
  }

  private showNotification(
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
    title: string
  ): void {
    this.toastr[type](message, title);
  }
}