import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Message } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})

export class MessageService {
  private messages: Message[] = [];

  messageSubject = new BehaviorSubject<Message[]>([]);
  messages$ = this.messageSubject.asObservable();

  private create(type: string, icon: string, message: string)
  {
    const id = Date.now();

    this.messages.push({id, type, icon, message});

    this.messageSubject.next(this.messages);

    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number)
  {
    this.messages = this.messages.filter(message => message.id != id);
    this.messageSubject.next(this.messages);
  }

  success(message: string)
  {
    this.create("success", "bi bi-check-circle-fill", message);
    this.messageSubject.next(this.messages);
  }

  info(message: string)
  {
    this.create("info", "bi bi-info-circle-fill", message);
    this.messageSubject.next(this.messages);
  }

  warning(message: string)
  {
    this.create("warning", "bi bi-exclamation-triangle-fill", message);
    this.messageSubject.next(this.messages);
  }

  error(message: string)
  {
    this.create("error", "bi bi-exclamation-circle-fill", message);
    this.messageSubject.next(this.messages);
  }
}
