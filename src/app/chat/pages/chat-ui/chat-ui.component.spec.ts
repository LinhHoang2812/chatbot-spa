import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUIComponent } from './chat-ui.component';

describe('ChatUIComponent', () => {
  let component: ChatUIComponent;
  let fixture: ComponentFixture<ChatUIComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatUIComponent]
    });
    fixture = TestBed.createComponent(ChatUIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
