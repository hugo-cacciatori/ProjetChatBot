import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedRequestController } from './generated-request.controller';
import { GeneratedRequestService } from './generated-request.service';

describe('GeneratedRequestController', () => {
  let controller: GeneratedRequestController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GeneratedRequestController],
      providers: [GeneratedRequestService],
    }).compile();

    controller = module.get<GeneratedRequestController>(GeneratedRequestController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
