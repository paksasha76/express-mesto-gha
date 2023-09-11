const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { celebrate, Joi, errors } = require('celebrate');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const errorsHandler = require('./errors/errorsHandler');
const { URL_REGULAR_EXP } = require('./constants/constants');

const { userRouter } = require('./routes/users');
const { cardRouter } = require('./routes/cards');

const app = express();
const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(express.json());
app.use(helmet());
app.use(limiter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGULAR_EXP),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(userRouter);
app.use(cardRouter);

app.use('*', auth, (req, res, next) => {
  next(errorsHandler('WrongPathError'));
});

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'Произошла неизвестная ошибка на сервере'
        : message,
    });
});

app.listen(PORT, () => {
  console.log(`Сервер открыт на порту: ${PORT}`);
});
