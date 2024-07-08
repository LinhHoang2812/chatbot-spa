import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Message } from '../models';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private stop$ = new Subject<void>();
  constructor(private http: HttpClient) {}

  get_response(
    question: string,
    chat_history: Message[],
    topic:string
  ): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(env.apiBase + 'response', {
      question,
      topics:[topic],
      chat_history,

    });
  }

  get_stream_response( question: string,
    chat_history: Message[],
    topic:string){
      return new Observable(observer => {
        fetch(env.apiBase + 'response', {
              method: 'POST',
              body: JSON.stringify({
                question,
                topics:[topic],
                chat_history,
          
              }),
              headers: {
                'Content-Type': 'application/json',
              }
            })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.body?.getReader();
          })
          .then(reader => {
            if (!reader) {
              throw new Error('ReadableStream reader not available');
            }
  
            const decoder = new TextDecoder();
  
            const readStream = () => {
              reader.read().then(({ done, value }) => {
                if (done) {
                  
                  
                  observer.complete();
                  return;
                }
                const chunk = decoder.decode(value, { stream: true });
                observer.next(chunk);
                readStream();
              }).catch(error => {
                observer.error(error);
              });
            };
  
            readStream();
          })
          .catch(error => {
            observer.error(error);
          });
  
        // return () => {
        //   if (reader) {
        //     reader.cancel();
        //   }
        // };
      });
    }

    // return new Observable<string>(observer => {
    //   fetch(env.apiBase + 'response', {
    //     method: 'POST',
    //     body: JSON.stringify({
    //       question,
    //       topics:[topic],
    //       chat_history,
    
    //     }),
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //     //signal: this.controller.signal
    //   }).then(response=>{
    //     response.json()
    //   }).then((data:any)=>{
    //     observer.next(data);
        
    //   })
    // })

        // function push() {
        //   return reader?.read().then(({ done, value }) => {
        //     if (done) {
        //       observer.complete();
        //       return;
        //     }
        //     const string = decoder.decode(value);
        //     const eventStr = string.split('\n\n');
        //     let content = '';
        //     for (let i = 0; i < eventStr.length; i++) {
        //       const str = eventStr[i];
        //       if (str === 'data: [DONE]') break;
        //       if (str && str.slice(0, 6) === 'data: ') {
        //         const jsonStr = str.slice(6);
        //         const data: ChatStreamData = JSON.parse(jsonStr);
        //         const thisContent = data.choices[0].delta?.content || '';
        //         content += thisContent;
        //       }
        //     }
        //     observer.next(content);
        //     push();
        //   });
        // }
       // push();
  //     }).catch((err: Error) => {
  //       observer.error(err?.message ?? 'there is an error');
  //     });
  //   }).pipe(takeUntil(this.stop$));
  // }
}
