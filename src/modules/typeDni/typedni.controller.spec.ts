import { Test, TestingModule } from '@nestjs/testing';
import { TypedniController } from './typedni.controller';

describe('TypedniController', () => {
  let controller: TypedniController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypedniController],
    }).compile();

    controller = module.get<TypedniController>(TypedniController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
