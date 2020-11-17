import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoMainComponent } from './promo-main.component';

describe('PromoMainComponent', () => {
  let component: PromoMainComponent;
  let fixture: ComponentFixture<PromoMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
