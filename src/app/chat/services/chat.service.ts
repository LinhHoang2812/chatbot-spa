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
  private controller: AbortController;
  constructor(private http: HttpClient) {}

  get_response(
    question: string,
  ): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(env.apiBase + 'response_non_stream', {
      question,
    });
  }

  stop() {
    if (this.controller) this.controller.abort();
    this.stop$.next();
  }

  chat_summary(question:string,response:string){
      return this.http.post<string>(env.apiBase + 'chat_summary',{question,response})
    }

  get_stream_response( question: string,chats:Message[]){
      this.controller = new AbortController();
      return new Observable(observer => {
        fetch(env.apiBase + 'response', {
              method: 'POST',
              body: JSON.stringify({
                question,chats}),
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
      }).pipe(takeUntil(this.stop$));
    }

}
