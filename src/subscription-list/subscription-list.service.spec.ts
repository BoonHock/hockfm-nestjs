import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionListService } from './subscription-list.service';

describe('SubscriptionListService', () => {
  let service: SubscriptionListService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubscriptionListService],
    }).compile();

    service = module.get<SubscriptionListService>(SubscriptionListService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
