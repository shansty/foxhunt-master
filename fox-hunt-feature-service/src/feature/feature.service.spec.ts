import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from 'src/feature/enums/Order.enum';
import { Sort } from 'src/feature/enums/Sort.enum';
import { FeatureService } from 'src/feature/feature.service';
import { FeatureRepository } from 'src/feature/repository/feature.repository';
import { SortDataDto } from './dto/sortDataDto';
import { FeatureDescriptionDto } from './dto/updateFeatureDescription.dto';
import { FeatureEntity } from './repository/feature.entity';

describe('FeatureService', () => {
  let service: FeatureService;

  const featuresMockDb: FeatureEntity[] = [
    {
      id: 1,
      name: 'FIRST_FEATURE',
      description: 'It is the first feature in the mocked feature database',
      displayName: 'First feature',
      isGlobalyEnabled: true,
    },
    {
      id: 2,
      name: 'SECOND_FEATURE',
      description: 'That is the second feature',
      displayName: 'Second feature',
      isGlobalyEnabled: true,
    },
    {
      id: 3,
      name: 'THIRD_FEATURE',
      description: 'There is also a third feature',
      displayName: 'Third feature',
      isGlobalyEnabled: false,
    },
  ];

  const mockQuestsRepository = {
    findAll: jest.fn().mockImplementation(() => {
      return featuresMockDb;
    }),
    findByLimit: jest
      .fn()
      .mockImplementation((page?: number, pageSize?: number) => {
        return featuresMockDb;
      }),
    update: jest.fn().mockImplementation((id, featureDto) => {
      const feature = featuresMockDb.find((feature) => feature.id === id);
      return {
        id: id,
        name: feature.name,
        description: featureDto.description,
        displayName: feature.displayName,
        isGlobalyEnabled: feature.isGlobalyEnabled,
      };
    }),
    findGloballyEnabled: jest.fn().mockImplementation(() => {
      return featuresMockDb.filter(
        (feature) => feature.isGlobalyEnabled === true,
      );
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FeatureService,
        {
          provide: FeatureRepository,
          useValue: mockQuestsRepository,
        },
      ],
    }).compile();
    service = module.get<FeatureService>(FeatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    const name = '';
    const sortData: SortDataDto = { sort: [Sort.ID, Order.ASC] };
    it('should list all features', async () => {
      const features = await service.getAll();
      expect(mockQuestsRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockQuestsRepository.findAll).toHaveBeenCalledWith(
        name,
        sortData.sort[0],
        sortData.sort[1],
      );
      expect(features).toEqual(featuresMockDb);
    });

    it('should list features by page and size', async () => {
      const page = 1;
      const size = 1;
      const features = await service.getAll(undefined, undefined, page, size);
      expect(mockQuestsRepository.findByLimit).toHaveBeenCalledTimes(1);
      expect(mockQuestsRepository.findByLimit).toHaveBeenCalledWith(
        page,
        size,
        name,
        sortData.sort[0],
        sortData.sort[1],
      );
      expect(features).toEqual(featuresMockDb);
    });

    it('should throw error if page is defined and size is not', async () => {
      const page = 1;
      await expect(service.getAll(sortData.sort, name, page)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('update', () => {
    it('should update a feature', async () => {
      const id = 1;
      const updateDescriptionDto: FeatureDescriptionDto = {
        description: 'Updated feature description',
        isGlobalyEnabled: undefined,
      };
      const feature = featuresMockDb.find((feature) => feature.id === id);
      feature.description = updateDescriptionDto.description;
      const updatedFeature = await service.update(id, updateDescriptionDto);
      expect(updatedFeature).toEqual(feature);
    });
  });

  describe('getGloballyEnabledFeatures', () => {
    it('should list globally enabled features', async () => {
      const features = await service.getGloballyEnabledFeatures();
      expect(features).toEqual(
        featuresMockDb
          .filter((feature) => feature.isGlobalyEnabled === true)
          .map((feature) => feature.name),
      );
    });
  });
});
