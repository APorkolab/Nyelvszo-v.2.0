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

		// PUT: Teljes erőforrás csere
		replace: async (id, updateData) => {
			const entity = await model.findByPk(id);
			if (!entity) {
				throw new Error('Not found');
			}

			// Az összes mező frissítése a kérésben érkező adatokkal
			Object.keys(updateData).forEach(key => {
				entity[key] = updateData[key];
			});

			await entity.save();

			return model.findByPk(id, {
				include: populateList
			});
		},

		// PATCH: Részleges frissítés
		update: async (id, updateData) => {
			const entity = await model.findByPk(id);
			if (!entity) {
				throw new Error('Not found');
			}

			// Csak a meglévő mezők frissítése
			Object.keys(updateData).forEach(key => {
				entity[key] = updateData[key];
			});

			await entity.save();

			return model.findByPk(id, {
				include: populateList
			});
		},

		create: async (body) => {
				const newEntity = await model.create(body);
				// Csak az új entitást küldjük vissza, nem az összes elemet
				return newEntity;
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
}