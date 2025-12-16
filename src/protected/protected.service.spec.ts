import { Test, TestingModule } from '@nestjs/testing';
import { ProtectedService } from './protected.service';

describe('ProtectedService', () => {
  let service: ProtectedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProtectedService],
    }).compile();

    service = module.get<ProtectedService>(ProtectedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
