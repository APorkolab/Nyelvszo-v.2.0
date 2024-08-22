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
				next(new createError.InternalServerError(err.message));
			}
		},
		findOne: async (req, res, next) => {
			try {
				const entity = await service.findOne(req.params.id);
				if (!entity) {
					return next(new createError.NotFound("Entity not found"));
				}
				res.json(entity);
			} catch (err) {
				next(new createError.InternalServerError(err.message));
			}
		},
		update: async (req, res, next) => {
			try {
				const [, [entity]] = await service.update(req.params.id, req.body);
				if (!entity) {
					return next(new createError.NotFound("Entity not found"));
				}
				res.json(entity);
			} catch (err) {
				next(new createError.InternalServerError(err.message));
			}
		},
		create: async (req, res, next) => {
			try {
				const entity = await service.create(req.body);
				res.status(201).json(entity);
			} catch (err) {
				next(new createError.InternalServerError(err.message));
			}
		},
		delete: async (req, res, next) => {
			try {
				await service.delete(req.params.id);
				res.status(204).json({});
			} catch (err) {
				if (err.message === "Not found") {
					return next(new createError.NotFound(err.message));
				}
				next(new createError.InternalServerError(err.message));
			}
		}
	};
};