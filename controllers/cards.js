const Card = require('../models/card');
const { BAD_REQUEST_CODE, NOT_FOUND_CODE, SERVER_ERROR_CODE } = require('../utils');

module.exports.createCard = async (req, res) => {
  const { name, link } = req.body;
  try {
    const card = await Card.create({ name, link, owner: req.user });
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при создании карточки: ${err}` });
  }
};

module.exports.getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при получении списка карточек: ${err}` });
  }
};

module.exports.delCardId = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndRemove(cardId);
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при удалении карточки: ${err}` });
  }
};

module.exports.likeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при лайке карточки: ${err}` });
  }
};

module.exports.dislikeCard = async (req, res) => {
  const { cardId } = req.params;
  try {
    const card = await Card.findByIdAndUpdate(
      cardId,
      { $pull: { likes: req.user._id } }, // добавить _id в массив, если его там нет
      { new: true },
    );
    if (!card) {
      return res.status(NOT_FOUND_CODE).send({ message: 'Запрашиваемая карточка не найдена' });
    }
    return res.send(card);
  } catch (err) {
    if (err.name === 'ValidationError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    if (err.name === 'CastError') return res.status(BAD_REQUEST_CODE).send({ message: 'Данные переданы не корректно' });
    return res.status(SERVER_ERROR_CODE).send({ message: `Ошибка при дизлайке карточки: ${err}` });
  }
};
