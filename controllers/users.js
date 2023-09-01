const User = require('../models/user');
const { BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE } = require('../utils');

module.exports.createUser = async (req, res) => {
  const { name, about, avatar } = req.body;
  try {
    const user = await User.create({ name, about, avatar });
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при создании пользователя: ${err}` });
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при получении списка пользователей: ${err}` });
  }
};

module.exports.getUserId = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при получении пользователя: ${err}` });
  }
};

module.exports.updateUserProfile = async (req, res) => {
  const { name, about } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { name, about },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при обновлении данных пользователя: ${err}` });
  }
};

module.exports.updateUserAvatar = async (req, res) => {
  const { avatar } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      req.user,
      { avatar },
      { new: true, runValidators: true },
    );
    if (!user) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемый пользователь не найден' });
    }
    return res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при обновлении данных пользователя: ${err}` });
  }
};
