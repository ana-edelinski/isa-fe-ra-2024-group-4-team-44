import { TestBed } from '@angular/core/testing';

import { LocationMessageService } from './location-message-service.service';

describe('LocationMessageServiceService', () => {
  let service: LocationMessageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocationMessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
