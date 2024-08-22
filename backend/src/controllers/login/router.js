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

	try {
		const user = await User.findOne({
			where: {
				email
			}
		});

		if (!user) {
			return res.status(404).json({
				error: 'This user does not exist'
			});
		}

		const valid = await bcrypt.compare(password, user.password); // Itt használjuk a bcrypt.compare-t
		if (!valid) {
			return res.status(401).json({
				error: 'Invalid password'
			});
		}

		const accessToken = jwt.sign({
				email: user.email,
				role: user.role
			},
			process.env.JWT_SECRET || 'SayWhatOneMoreGoddamnTime', {
				expiresIn: '1h'
			}
		);

		res.json({
			accessToken,
			user: {
				...user.toJSON(),
				password: ''
			},
		});
	} catch (err) {
		next(err);
	}
});

module.exports = router;