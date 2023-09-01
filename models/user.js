const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Должно быть заполнено'],
    minlength: [2, 'Минимальная длина - 2'],
    maxlength: [30, 'Максимальная длина - 30'],
  },
  about: {
    type: String,
    required: [true, 'Должно быть заполнено'],
    minlength: [2, 'Минимальная длина - 2'],
    maxlength: [30, 'Максимальная длина - 30'],
  },
  avatar: {
    type: String,
    required: [true, 'Должно быть заполнено'],
    validate: {
      validator(url) {
        return /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/.test(url);
      },
      message: 'Некорректная ссылка',
    },
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
