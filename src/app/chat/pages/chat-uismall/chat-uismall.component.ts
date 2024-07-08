import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../models';
import { ChatService } from '../../services/chat.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-chat-uismall',
  templateUrl: './chat-uismall.component.html',
  styleUrls: ['./chat-uismall.component.scss'],
})
export class ChatUISmallComponent {
  openChat: boolean = false;
  bigChat: boolean = false;

  @ViewChild('input') input: ElementRef;
  @ViewChild('chatUI') chatUI: ElementRef;
  messages: Message[] = [];
  question: string;
  thinking: boolean = false;
  private lastMessagesLength = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private chatService: ChatService
  ) {}
  ngOnInit() {
    console.log('hello,hi'.split(','));
  }

  ngAfterViewChecked() {
    if (this.messages.length !== this.lastMessagesLength) {
      this.chatUI.nativeElement.scrollTop =
        this.chatUI.nativeElement.scrollHeight;
      this.lastMessagesLength = this.messages.length;
    }
    // this.chatUI.nativeElement.scrollTop =
    //   this.chatUI.nativeElement.scrollHeight;
  }

  sendChat() {
    this.thinking = true;

    // setTimeout(() => {
    //   this.messages.push({
    //     role: 'ai',
    //     content: 'hello',
    //   });
    //   this.thinking = false;
    // }, 5000);
    this.messages.push({
      role: 'user',
      content: this.question,
    });

    // this.chatService
    //   .get_response(this.question, this.messages)
    //   .subscribe((res: { response: string }) => {
    //     this.messages.push({
    //       role: 'ai',
    //       content: res.response,
    //     });
    //     this.thinking = false;
    //   });
    this.question = null;
    this.input.nativeElement.style.height = 'auto';
  }

  onChange() {
    this.input.nativeElement.style.height = 'auto';
    this.input.nativeElement.style.height =
      this.input.nativeElement.scrollHeight + 'px';
  }
}
