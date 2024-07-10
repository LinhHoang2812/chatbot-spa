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
  @ViewChild('sendButton') sendButton: ElementRef
  messages: Message[] = [];
  question: string;
  thinking: boolean = false;
  isStreaming: boolean = false
  shouldRegenerate: boolean = false
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
   
    if (this.isStreaming){
      this.chatUI.nativeElement.scrollTop = this.chatUI.nativeElement.scrollHeight;
    
    }
    
    
  }
  streamChat(){
      this.thinking = true;
      this.shouldRegenerate = false
      this.isStreaming = true
      this.messages.push({
        role: 'user',
        content: this.question,
      });

      this.chatService
        .get_stream_response(this.question, this.messages, this.chosenTopic)
        .subscribe( {
          next: (res:any)=>{
          this.thinking = false;
          
          
          if (this.messages[this.messages.length-1].role !== 'ai'){
            this.messages.push({
              role: 'ai',
              content: res,
            });
          }
          else{
            
            this.messages[this.messages.length-1].content +=   res
          
          }
          },
          complete: () => {
            //if abort is triggered it arrives here 
            
            this.isStreaming = false
            this.sendButton.nativeElement.style.backgroundColor ='#d1d5db'

          }

          });

      this.question = null;
      this.input.nativeElement.style.height = 'auto';
    

  }
  stopChat(){
    this.chatService.stop()
    this.sendButton.nativeElement.style.backgroundColor ='#d1d5db'
    this.thinking = false;
    this.shouldRegenerate = true

    
  }
  regenerateChat(){
    this.sendButton.nativeElement.style.backgroundColor ='black'
    this.isStreaming = true
    this.shouldRegenerate = false
    const questions = this.messages.filter(q=> q.role == "user")
    const last_question = questions[questions.length -1 ]
    this.thinking = true
    if (this.messages[this.messages.length-1].role === 'ai'){
      this.messages.pop()
    }
    this.chatService
      .get_stream_response(last_question.content, this.messages, this.chosenTopic)
      .subscribe( {
        next: (res:any)=>{
        this.thinking = false;
        
        if (this.messages[this.messages.length-1].role !== 'ai'){
          this.messages.push({
            role: 'ai',
            content: res,
          });
        }
        else{
          
          this.messages[this.messages.length-1].content +=   res
        
        }
        },
        complete: () => {
          this.isStreaming = false
          this.sendButton.nativeElement.style.backgroundColor ='#d1d5db'

        }

         });

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
    if (this.question !== ''){
      this.sendButton.nativeElement.style.backgroundColor ='black'
    }else{
      this.sendButton.nativeElement.style.backgroundColor ='#d1d5db'
    }
   
     
    
  }
  
  startNewChat(){
  
    
    this.messages = []
    this.thinking = false
    this.question = null
    this.chatService.stop()
    this.isStreaming = false
    this.shouldRegenerate = false
  }



  
}

