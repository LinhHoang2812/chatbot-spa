import { Component, ElementRef, ViewChild } from '@angular/core';
import { Message } from '../../models';
import { NgxSpinnerService } from 'ngx-spinner';
import { ChatService } from '../../services/chat.service';
import { MarkdownService } from 'ngx-markdown';
import { concatMap, exhaustMap, switchMap, tap } from 'rxjs';
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
  chat_history :Message[]=[]
  question: string;
  thinking: boolean = false;
  isStreaming: boolean = false
  shouldRegenerate: boolean = false
  
  reportList = ["Report A2A","Report Milano","Report Friuli Venezia Giulia","Report Bergamo","Report Brescia","Report Valtellina Valchivenna","Report Monza Brianza","Report Puglia",
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

      this.chat_history.push({
        role: 'user',
        content: this.question,
      });

      this.chatService
        .get_stream_response(this.question,this.chat_history)
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
           
            
            
            this.chatService.chat_summary(this.chat_history[this.chat_history.length-1].content,this.messages[this.messages.length-1].content).subscribe((summary:any)=>{
              this.chat_history.push({
                role: 'ai',
                content: summary,
              });
              
            })
              
            
            
            this.isStreaming = false
            this.sendButton.nativeElement.style.backgroundColor ='#d1d5db'

          }

          });

     
      
      this.question = null;
     
      this.input.nativeElement.style.height = 'auto';
    

  }
  get_stream_response(event: any){
    if (!this.isStreaming){  
      event.preventDefault();
      this.streamChat()
    } 
    
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
    this.thinking = true

    const questions = this.messages.filter(q=> q.role == "user")
    const last_question = questions[questions.length -1 ]
    
    if (this.messages[this.messages.length-1].role === 'ai'){
      this.messages.pop()
     
    }


    if (this.chat_history[this.chat_history.length-1].role === 'ai'){
       this.chat_history.pop()
    }

    this.chatService
      .get_stream_response(last_question.content,[])
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

          this.chatService.chat_summary(this.chat_history[this.chat_history.length-1].content,this.messages[this.messages.length-1].content).subscribe((summary:any)=>{
            this.chat_history.push({
              role: 'ai',
              content: summary,
            });
            
          })
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

    this.chatService.get_response(this.question).pipe(
      switchMap((res: { response: string })=>{
        this.messages.push({
              role: 'ai',
              content: this.markdownService.parse(res.response),
            });
        this.thinking = false;
            
        return this.chatService.chat_summary(this.messages[this.messages.length-2].content,this.messages[this.messages.length-1].content)
      })
    ).subscribe((
      res:string
    )=>{
      console.log(res);
      
    })
      

    
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
    this.chat_history = []
    this.thinking = false
    this.question = null
    this.chatService.stop()
    this.isStreaming = false
    this.shouldRegenerate = false
  }



  
}



