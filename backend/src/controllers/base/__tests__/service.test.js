const { Op, DataTypes } = require('sequelize');
const baseService = require('../service');

describe('baseService', () => {
  let mockModel;
  let service;

  beforeEach(() => {
    // Create a mock Sequelize model before each test
    mockModel = {
      getAttributes: jest.fn().mockReturnValue({
        id: { type: DataTypes.INTEGER },
        name: { type: DataTypes.STRING },
        description: { type: DataTypes.TEXT },
        is_active: { type: DataTypes.BOOLEAN },
      }),
      findAll: jest.fn().mockResolvedValue([]),
    };
    service = baseService(mockModel);
  });

  describe('findAll', () => {
    it('should use LIKE for string and text fields', async () => {
      await service.findAll({ name: 'test', description: 'desc' });

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: {
          name: { [Op.like]: '%test%' },
          description: { [Op.like]: '%desc%' },
        },
        include: [],
      });
    });

    it('should use eq for non-string fields', async () => {
      await service.findAll({ id: 1, is_active: true });

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: {
          id: { [Op.eq]: 1 },
          is_active: { [Op.eq]: true },
        },
        include: [],
      });
    });

    it('should ignore query parameters that are not model attributes', async () => {
      await service.findAll({ name: 'test', non_existent_field: 'ignore' });

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: {
          name: { [Op.like]: '%test%' },
        },
        include: [],
      });
    });

    it('should handle a mix of valid and invalid parameters', async () => {
      await service.findAll({ id: 5, non_existent_field: 'ignore', name: 'mixed' });

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: {
          id: { [Op.eq]: 5 },
          name: { [Op.like]: '%mixed%' },
        },
        include: [],
      });
    });

    it('should return an empty where clause if no valid params are provided', async () => {
      await service.findAll({ non_existent_field: 'ignore' });

      expect(mockModel.findAll).toHaveBeenCalledWith({
        where: {},
        include: [],
      });
    });
  });
});
