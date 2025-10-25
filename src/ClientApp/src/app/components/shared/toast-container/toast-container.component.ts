import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-container.component.html',
  styleUrl: './toast-container.component.css'
})
export class ToastContainerComponent {
  toasts: ToastMessage[] = [];

  constructor(private toast: ToastService) {
    this.toast.messages$.subscribe(msgs => (this.toasts = msgs));
  }

  remove(id: number) {
    this.toast.remove(id);
  }
}
