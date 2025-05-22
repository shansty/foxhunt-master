import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Order } from 'src/feature/enums/Order.enum';
import { Sort } from 'src/feature/enums/Sort.enum';
import { PageSizeDto } from '../common/dto/pageSize.dto';
import { SortDataDto } from './dto/sortDataDto';
import { FeatureDescriptionDto } from './dto/updateFeatureDescription.dto';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FeatureEntity } from './repository/feature.entity';

describe('FeatureController', () => {
  let controller: FeatureController;

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
      isGlobalyEnabled: true,
    },
  ];

  const mockFeatureService = {
    getAll: jest
      .fn()
      .mockImplementation(
        (page: number | undefined, size: number | undefined) => {
          return featuresMockDb;
        },
      ),
    update: jest.fn().mockImplementation((id, descriptionDto) => {
      const feature = featuresMockDb.find((feature) => feature.id === id);
      if (!feature) {
        throw new NotFoundException(`Feature with id: ${id} doesn't exist`);
      } else {
        return {
          id: id,
          name: feature.name,
          description: descriptionDto.description,
          displayName: feature.displayName,
          isGlobalyEnabled: feature.isGlobalyEnabled,
        };
      }
    }),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FeatureController],
      providers: [FeatureService],
    })
      .overrideProvider(FeatureService)
      .useValue(mockFeatureService)
      .compile();

    controller = module.get<FeatureController>(FeatureController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    const query: PageSizeDto = {
      page: 0,
      size: undefined,
    };

    const name = '';
    const sortData: SortDataDto = { sort: [Sort.ID, Order.ASC] };
    it('should list all features if page and limit are not specified', () => {
      const features = controller.getAll(query, name, sortData);
      expect(mockFeatureService.getAll).toHaveBeenCalledTimes(1);
      expect(mockFeatureService.getAll).toHaveBeenCalledWith(
        sortData.sort,
        name,
        query.page,
        query.size,
      );
      expect(features).toEqual(featuresMockDb);
    });

    it('should list features by page and limit', () => {
      const query: PageSizeDto = { page: 1, size: 1 };
      const features = controller.getAll(query, name, sortData);
      expect(mockFeatureService.getAll).toHaveBeenCalledTimes(1);
      expect(mockFeatureService.getAll).toHaveBeenCalledWith(
        sortData.sort,
        name,
        query.page,
        query.size,
      );
      expect(features).toEqual(featuresMockDb);
    });
  });

  describe('setNewDescription', () => {
    it('should update description of a features', async () => {
      const id = 1;
      const setFeatureDescriptionDto: FeatureDescriptionDto = {
        description: 'Updated feature description',
      };
      const updatedFeature = await controller.setNewDescription(
        id,
        setFeatureDescriptionDto,
      );
      const feature = featuresMockDb.find((feature) => feature.id === id);
      feature.description = setFeatureDescriptionDto.description;
      expect(updatedFeature).toEqual(feature);
    });

    it('should return error message when updating non-existing feature', async () => {
      const id = 999;
      const setFeatureDescriptionDto: FeatureDescriptionDto = {
        description: 'Updated feature description',
      };
      await expect(
        controller.setNewDescription(id, setFeatureDescriptionDto),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
