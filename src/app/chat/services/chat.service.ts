import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as env } from 'src/environments/environment';
import { Message } from '../models';
@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  get_response(
    question: string,
    chat_history: Message[]
  ): Observable<{ response: string }> {
    return this.http.post<{ response: string }>(env.apiBase + 'response', {
      question,
      chat_history,
    });
  }
}
