const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const jwt = require('jsonwebtoken');

// Post
router.post('/', async (req, res, next) => {
	const {
		email,
		password
	} = req.body;

	const fMember = await User.findOne({
		where: {
			email
		}
	});

	if (!fMember) {
		res.sendStatus(404);
		return res.json({
			error: 'This user does not exist'
		});
	}

	const valid = await fMember.verifyPassword(password);
	if (valid) {
		const accessToken = jwt.sign({
				email: fMember.email,
				role: fMember.role
			},
			'SayWhatOneMoreGoddamnTime', {
				expiresIn: '1h',
			}
		);

		res.json({
			accessToken,
			user: {
				...fMember.toJSON(),
				password: ''
			},
		});
	} else {
		return res.sendStatus(401);
	}
});

module.exports = router;