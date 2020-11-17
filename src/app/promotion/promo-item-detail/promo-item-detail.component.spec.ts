import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoItemDetailComponent } from './promo-item-detail.component';

describe('PromoItemDetailComponent', () => {
  let component: PromoItemDetailComponent;
  let fixture: ComponentFixture<PromoItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
