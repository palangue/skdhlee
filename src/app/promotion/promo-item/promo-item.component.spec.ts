import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoItemComponent } from './promo-item.component';

describe('PromoItemComponent', () => {
  let component: PromoItemComponent;
  let fixture: ComponentFixture<PromoItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
