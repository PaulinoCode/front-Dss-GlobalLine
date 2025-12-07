import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricFormComponent } from './metric-form.component';

describe('MetricFormComponent', () => {
  let component: MetricFormComponent;
  let fixture: ComponentFixture<MetricFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
