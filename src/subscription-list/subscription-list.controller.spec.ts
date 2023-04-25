import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionListController } from './subscription-list.controller';

describe('SubscriptionListController', () => {
  let controller: SubscriptionListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubscriptionListController],
    }).compile();

    controller = module.get<SubscriptionListController>(
      SubscriptionListController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
