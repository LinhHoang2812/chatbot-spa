import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatService } from '../../services/chat.service';
@Component({
  selector: 'app-chat-ui',
  templateUrl: './chat-ui.component.html',
  styleUrls: ['./chat-ui.component.scss'],
})
export class ChatUIComponent {
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
  ngOnInit() {}

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

    this.messages.push({
      role: 'user',
      content: this.question,
    });

    this.chatService
      .get_response(this.question, this.messages)
      .subscribe((res: { response: string }) => {
        this.messages.push({
          role: 'ai',
          content: res.response,
        });
        this.thinking = false;
      });

    // this.chatService.setTimeout(() => {
    //   this.messages.push({
    //     role: 'ai',
    //     content:
    //       'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed orci dui, faucibus non blandit ut, congue sollicitudin mauris. Suspendisse in cursus sapien. In dignissim turpis tincidunt maximus sollicitudin. In dolor diam, posuere at sem eget, bibendum blandit sem. Nulla felis nisi, dapibus eu magna consequat, pretium accumsan nulla. ',
    //   });
    //   this.thinking = false;
    //   // this.spinner.hide();
    // }, 5000);

    this.question = null;
    this.input.nativeElement.style.height = 'auto';
  }

  onChange() {
    this.input.nativeElement.style.height = 'auto';
    this.input.nativeElement.style.height =
      this.input.nativeElement.scrollHeight + 'px';
  }
}
