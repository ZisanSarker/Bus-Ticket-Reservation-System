import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, ToastMessage } from '../../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="fixed bottom-4 right-4 z-50 space-y-2 w-80">
  @for (t of toasts; track t.id) {
    <div
      class="rounded-md shadow-md text-white px-4 py-3 flex items-start gap-3"
      [class.bg-green-600]="t.type === 'success'"
      [class.bg-red-600]="t.type === 'error'"
      [class.bg-blue-600]="t.type === 'info'"
    >
      <div class="flex-1 break-words">{{ t.text }}</div>
      <button class="opacity-80 hover:opacity-100" (click)="remove(t.id)">×</button>
    </div>
  }
  
  @if (toasts.length === 0) {
    <ng-container></ng-container>
  }
</div>
  `,
  styles: [`
.toast-enter {
  opacity: 0;
  transform: translateY(10px);
}

.toast-enter-active {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 150ms, transform 150ms;
}

.toast-exit {
  opacity: 1;
}

.toast-exit-active {
  opacity: 0;
  transition: opacity 150ms;
}
  `]
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
