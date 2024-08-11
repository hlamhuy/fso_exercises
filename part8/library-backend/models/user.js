const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3,
  },
  favoriteGenre: String,
});

schema.plugin(uniqueValidator);

const User = mongoose.model("User", schema);

module.exports = User;
