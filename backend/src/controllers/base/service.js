const {
	Op
} = require('sequelize');

module.exports = (model, populateList = []) => {
	return {
		findAll: async (params = {}) => {
			if (Object.keys(params).length) {
				Object.keys(params).forEach(key => {
					params[key] = {
						[Op.like]: `%${params[key]}%`
					};
				});
			}
			return model.findAll({
				where: params,
				include: populateList
			});
		},
		findOne: (id) => model.findByPk(id, {
			include: populateList
		}),
		update: (id, updateData) => model.update(updateData, {
			where: {
				id
			},
			returning: true
		}),
		create: async (body) => {
			const newEntity = await model.create(body);
			return model.findByPk(newEntity.id, {
				include: populateList
			});
		},
		delete: async (id) => {
			const result = await model.destroy({
				where: {
					id
				}
			});
			if (!result) {
				throw new Error('Not found');
			}
			return result;
		}
	};
}