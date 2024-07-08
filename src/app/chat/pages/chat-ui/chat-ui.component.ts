import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatService } from '../../services/chat.service';
import { MarkdownService } from 'ngx-markdown';
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
  reportList = ["Report A2A","Report Milano","Report Friuli Venenzia Giulia","Report Bergamo","Report Brescia","Report Valtellina Valchivenna","Report Monza Brianza","Report Puglia",
  "Report Sicilia","Report Piemonte","Report Calabria"]
  chosenTopic:string = "Report A2A"

  private lastMessagesLength = 0;
  constructor(
    private spinner: NgxSpinnerService,
    private chatService: ChatService,
    public markdownService: MarkdownService
  ) {}
  ngOnInit( ) {}

  ngAfterViewChecked() {
    if (this.messages.length !== this.lastMessagesLength) {
      this.chatUI.nativeElement.scrollTop =
        this.chatUI.nativeElement.scrollHeight;
      this.lastMessagesLength = this.messages.length;
    }
    // this.chatUI.nativeElement.scrollTop =
    //   this.chatUI.nativeElement.scrollHeight;
  }
  streamChat(){
    this.thinking = true;
    this.messages.push({
      role: 'user',
      content: this.question,
    });
    this.chatService
      .get_stream_response(this.question, this.messages, this.chosenTopic)
      .subscribe((res:any) => {
        this.thinking = false;
        if (this.messages[this.messages.length-1].role !== 'ai'){
          this.messages.push({
            role: 'ai',
            content: res,
          });
        }
        else{
          
          this.messages[this.messages.length-1].content +=   res
          // console.log(res);
          
          console.log(this.markdownService.parse(this.messages[this.messages.length-1].content))
          
          
          
        }
       
        
       
        
        
        
      });

    this.question = null;
    this.input.nativeElement.style.height = 'auto';
  
  }

  sendChat() {
    this.thinking = true;

    this.messages.push({
      role: 'user',
      content: this.question,
    });

    this.chatService
      .get_response(this.question, this.messages, this.chosenTopic)
      .subscribe((res: { response: string }) => {
        this.messages.push({
          role: 'ai',
          content: this.markdownService.parse(res.response),
        });
        this.thinking = false;
        
        
      });

    
    this.question = null;
    this.input.nativeElement.style.height = 'auto';
  }

  onChange() {
    this.input.nativeElement.style.height = 'auto';
    this.input.nativeElement.style.height =
      this.input.nativeElement.scrollHeight + 'px';
  }
  startNewChat(){
    this.messages = []
    this.thinking = false
    this.question =null
  }

  handleStreamChunk(chunk: string) {
    // Process the streamed chunk
    console.log(chunk);
   
  }
}
