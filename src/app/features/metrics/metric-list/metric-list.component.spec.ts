import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MetricListComponent } from './metric-list.component';

describe('MetricListComponent', () => {
  let component: MetricListComponent;
  let fixture: ComponentFixture<MetricListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetricListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MetricListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
