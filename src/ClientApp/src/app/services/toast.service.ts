import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: number;
  type: ToastType;
  text: string;
  timeoutMs: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private messages: ToastMessage[] = [];
  private subject = new BehaviorSubject<ToastMessage[]>([]);
  messages$ = this.subject.asObservable();

  private nextId = 1;

  success(text: string, timeoutMs = 3000) {
    this.push('success', text, timeoutMs);
  }

  error(text: string, timeoutMs = 4000) {
    this.push('error', text, timeoutMs);
  }

  info(text: string, timeoutMs = 3000) {
    this.push('info', text, timeoutMs);
  }

  private push(type: ToastType, text: string, timeoutMs: number) {
    const msg: ToastMessage = { id: this.nextId++, type, text, timeoutMs };
    this.messages = [...this.messages, msg];
    this.subject.next(this.messages);

    setTimeout(() => this.remove(msg.id), timeoutMs);
  }

  remove(id: number) {
    this.messages = this.messages.filter(m => m.id !== id);
    this.subject.next(this.messages);
  }
}
