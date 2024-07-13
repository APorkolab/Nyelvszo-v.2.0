const express = require('express');
const createError = require('http-errors');
const baseService = require('../base/service');

module.exports = (model, populateList = []) => {
	const service = baseService(model, populateList);
	return {
		findAll: async (req, res, next) => {
			try {
				const list = await service.findAll(req.query);
				res.json(list);
			} catch (err) {
				next(err);
			}
		},
		findOne: async (req, res, next) => {
			try {
				const entity = await service.findOne(req.params.id);
				if (!entity) {
					return next(new createError.NotFound("Entity has not found"));
				}
				res.json(entity);
			} catch (err) {
				next(err);
			}
		},
		update: async (req, res, next) => {
			try {
				const [_, [entity]] = await service.update(req.params.id, req.body);
				res.json(entity);
			} catch (err) {
				res.status(501).json(err);
			}
		},
		create: async (req, res, next) => {
			try {
				const entity = await service.create(req.body);
				res.json(entity);
			} catch (err) {
				res.status(501).json(err);
			}
		},
		delete: async (req, res, next) => {
			try {
				await service.delete(req.params.id);
				res.json({});
			} catch (err) {
				if (err.message === "Not found") {
					return next(new createError.NotFound(err.message));
				}
				next(new createError.InternalServerError(err.message));
			}
		}
	};
}