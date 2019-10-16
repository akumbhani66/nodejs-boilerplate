/* eslint-disable func-names */
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import {
	createSuccessResponse,
	createErrorResponse,
} from '../../../utils/response-utils';
import validate from 'express-validation';
import { User } from '../../../db/sequelize';
import { verifyToken } from '../../../middlewares';

import { createUserValidator } from './users.validator';
import { mailTo } from '../../../helpers.js';

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

	const {
		name,
		email,
		password
	} = req.body;

	const hashedPassword = bcrypt.hashSync(password, 8);

	let userResponse = await User.create({
		name,
		email,
		password: hashedPassword
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

export const login = async (req, res) => {
	const {
		email,
		password,
	} = req.body;

	let userInfo;
	try {
		userInfo = await User.findOne({
			where: {
				email,
			}
		});
	} catch (err) {
		console.log(`Error on fetch userinfo: ${err}`);
	}

	if (userInfo === null) {
		return createErrorResponse(req, res, 'unauthorized');
	}

	let passwordAuth;
	try {
		passwordAuth = await bcrypt.compare(password, userInfo.password);
	} catch (err) {
		console.log(`Password compare error:${err}`);
	}

	if (passwordAuth) {
		let token = jwt.sign({ email },
			process.env.secret,
			{
				expiresIn: '24h' // expires in 24 hours
			}
		);
		return createSuccessResponse(res, "Login success.", { token })
	} else {
		return createErrorResponse(req, res, 'unauthorized');
	}
};

export const forgotPassword = (async (req, res) => {
	const { email } = req.body;
	let userInfo;
	try {
		userInfo = await User.findOne({
			where: {
				email,
			}
		});
	} catch (err) {
		console.log(`Error on fetch userinfo: ${err}`);
	}

	if (userInfo === null) {
		return createErrorResponse(req, res, `Email couldn't found`);
	}

	const token = jwt.sign({ email }, process.env.secret, { expiresIn: '24h' });
	const emailTo = userInfo.email;
	const subject = `Password reset`;
	const resetUrl = `http://${process.env.APP_HOST}:${process.env.APP_PORT}/api/users/${token}/reset-password`
	const html = '<a href=' + '"' + resetUrl + '"' + '> Click here </a> to reset password. Link is valid for 24 hours only'
	const mailResponse = await mailTo(emailTo, subject, html);

	return createSuccessResponse(res, "mail sent", mailResponse);
});

export const resetPassword = (async (req, res) => {
	const { token } = req.params;
	const { password, confirmPassword } = req.body;

	if (password !== confirmPassword) {
		return createErrorResponse(req, res, `Passwor missmatch`);
	}

	let decoded;
	try {
		decoded = await jwt.verify(token, process.env.secret);
	} catch (err) {
		return createErrorResponse(req, res, err);
	}

	// update password token verification success.
	const { email } = decoded;
	const hashedPassword = bcrypt.hashSync(password, 8);
	let userInfo;
	try {
		userInfo = await User.update(
			{
				password: hashedPassword
			},
			{
				where: {
					email,
				}
			}
		);
	} catch (err) {
		console.log(`Error on fetch userinfo: ${err}`);
	}

	if (userInfo === null) {
		return createErrorResponse(req, res, `Email couldn't found`);
	}

	return createSuccessResponse(res, "Password reset success", {});
});

router.post('/login', login);
router.post('/register', createUser);
router.post('/forgot-password', forgotPassword);
router.post('/:token/reset-password', resetPassword);

router.get('/', verifyToken, getAllUsers);
router.get('/:id', verifyToken, getOneUser);
router.put('/:id', verifyToken, editUser);
router.delete('/:id', verifyToken, deleteUser);

export default router;


