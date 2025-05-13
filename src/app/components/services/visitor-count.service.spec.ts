import { TestBed } from '@angular/core/testing';

import { VisitorCountService } from './visitor-count.service';

describe('VisitorCountService', () => {
  let service: VisitorCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VisitorCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
