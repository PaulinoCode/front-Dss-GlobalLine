import { TestBed } from '@angular/core/testing';

import { FutureSalesService } from './future-sales.service';

describe('FutureSalesService', () => {
  let service: FutureSalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FutureSalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
