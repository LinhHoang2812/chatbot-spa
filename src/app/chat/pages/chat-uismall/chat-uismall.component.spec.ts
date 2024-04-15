import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUISmallComponent } from './chat-uismall.component';

describe('ChatUISmallComponent', () => {
  let component: ChatUISmallComponent;
  let fixture: ComponentFixture<ChatUISmallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatUISmallComponent]
    });
    fixture = TestBed.createComponent(ChatUISmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
