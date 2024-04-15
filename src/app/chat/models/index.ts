export interface Chat {
  messages: Message[];
}
export interface Message {
  role: string;
  content: string;
}
