import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { Message } from '../../interfaces/interfaces';

@Component({
  selector: 'app-message',
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})

export class MessageComponent implements OnInit, OnDestroy{
  constructor(private message: MessageService){}

  messages: Message[] = [];
  
  ngOnInit()
  {
    this.message.messages$.subscribe(msgs => {
      this.messages = msgs;
    })
  }

  ngOnDestroy()
  {
    this.message.messageSubject.unsubscribe();
  }

  closeMessage(id: number)
  {
    this.message.remove(id);
  }
}
