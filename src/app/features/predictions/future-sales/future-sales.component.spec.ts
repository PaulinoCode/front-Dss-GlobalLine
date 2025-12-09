import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FutureSalesComponent } from './future-sales.component';

describe('FutureSalesComponent', () => {
  let component: FutureSalesComponent;
  let fixture: ComponentFixture<FutureSalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FutureSalesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FutureSalesComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
