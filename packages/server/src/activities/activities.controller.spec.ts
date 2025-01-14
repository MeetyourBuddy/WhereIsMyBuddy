import { Test, TestingModule } from '@nestjs/testing';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { getModelToken } from '@nestjs/mongoose';
import { Activity } from './schemas/activity.schema';
import { CheckIn } from './schemas/checkin.schema';

describe('ActivitiesController', () => {
  let controller: ActivitiesController;

  const mockActivitiesService = {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivitiesController],
      providers: [
        {
          provide: ActivitiesService,
          useValue: mockActivitiesService,
        },
        {
          provide: getModelToken(Activity.name),
          useValue: {},
        },
        {
          provide: getModelToken(CheckIn.name),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ActivitiesController>(ActivitiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // Add more test cases here
});
