const {
	Op,
	DataTypes
} = require('sequelize');

module.exports = (model, populateList = []) => {
	return {
		findAll: async (params = {}) => {
			const attributes = model.getAttributes();
			const where = {};

			for (const key in params) {
				if (Object.prototype.hasOwnProperty.call(attributes, key)) {
					const value = params[key];
					const attributeType = attributes[key].type;

					// Use LIKE for string-based types, and exact match for others.
					if (attributeType.key === 'STRING' || attributeType.key === 'TEXT') {
						where[key] = {
							[Op.like]: `%${value}%`
						};
					} else {
						where[key] = {
							[Op.eq]: value
						};
					}
				}
			}

			return model.findAll({
				where,
				include: populateList,
			});
		},
		findOne: (id) => model.findByPk(id, {
			include: populateList,
		}),

		// PUT: Teljes erőforrás csere (jelenleg PATCH-ként működik)
		replace: async (id, updateData) => {
			// A jelenlegi implementáció megegyezik a PATCH-el,
			// ahelyett, hogy a teljes erőforrást lecserélné.
			return module.exports(model, populateList).update(id, updateData);
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