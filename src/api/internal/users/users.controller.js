/* eslint-disable func-names */
import express from 'express';
import {
	createSuccessResponse,
	createErrorResponse,
} from '../../../utils/response-utils';
import validate from 'express-validation';
import { User } from '../../../db/sequelize';

import { createUserValidator } from './users.validator';



const signale = require('signale');

signale.config({
	displayFilename: true,
	displayTimestamp: true,
	displayDate: false,
});

const router = express.Router({ mergeParams: true });

/**
 * To address amendment
 * @param {Object} req
 * @param {Object} res
 * @returns {undefined}
 */
export const createUser = async (req, res) => {
	const payload = req.body;
	createUserValidator(payload, req, res);

	let userResponse = await User.create({
		firstName: 111,
		lastName: "lastName"
	});
	res.json(userResponse);
};

export const getAllUsers = async (req, res) => {
	res.json({ user: "get all" });
};

export const getOneUser = async (req, res) => {
	res.json({ user: "getOne" });
};

export const editUser = async (req, res) => {
	res.json({ user: "edit" });
};

export const deleteUser = async (req, res) => {
	res.json({ user: "delete" });
};

router.post('/', createUser);
router.get('/', /*validate(getUsers),*/ getAllUsers);
router.get('/:id', /*validate(getOneUser),*/ getOneUser);
router.put('/:id', /*validate(editUser),*/ editUser);
router.delete('/:id', /* validate(deleteUser)*/ deleteUser);


export default router;


