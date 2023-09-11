const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { auth } = require('../middlewares/auth');
const { URL_REGULAR_EXP } = require('../constants/constants');
const {
  getUsers,
  getUser,
  getUserId,
  updateDescription,
  updateAvatar,
} = require('../controllers/users');

const userRouter = express.Router();

userRouter.get('/users', auth, getUsers);

userRouter.get('/users/me', auth, getUserId);

userRouter.get('/users/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

userRouter.patch('/users/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }),
}), updateDescription);

userRouter.patch('/users/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().regex(URL_REGULAR_EXP),
  }),
}), updateAvatar);

module.exports = { userRouter };
