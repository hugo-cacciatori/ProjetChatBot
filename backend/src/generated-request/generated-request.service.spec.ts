import { Test, TestingModule } from '@nestjs/testing';
import { GeneratedRequestService } from './generated-request.service';

describe('GeneratedRequestService', () => {
  let service: GeneratedRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeneratedRequestService],
    }).compile();

    service = module.get<GeneratedRequestService>(GeneratedRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
