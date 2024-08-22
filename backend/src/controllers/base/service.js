const {
	Op
} = require('sequelize');

module.exports = (model, populateList = []) => {
	return {
		findAll: async (params = {}) => {
			const searchParams = {
				...params
			};
			if (Object.keys(searchParams).length) {
				Object.keys(searchParams).forEach(key => {
					searchParams[key] = {
						[Op.like]: `%${searchParams[key]}%`
					};
				});
			}
			return model.findAll({
				where: searchParams,
				include: populateList,
			});
		},
		findOne: (id) => model.findByPk(id, {
			include: populateList,
		}),
		update: async (id, updateData) => {
			const entity = await model.findByPk(id);
			if (!entity) {
				throw new Error('Not found');
			}
			await model.update(updateData, {
				where: {
					id
				},
			});
			return model.findByPk(id, {
				include: populateList,
			});
		},
		create: async (body) => {
			const newEntity = await model.create(body);
			return model.findByPk(newEntity.id, {
				include: populateList,
			});
		},
		delete: async (id) => {
			const result = await model.destroy({
				where: {
					id
				},
			});
			if (!result) {
				throw new Error('Not found');
			}
			return result;
		},
	};
};