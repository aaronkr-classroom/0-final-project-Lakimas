// models/Game.js
"use strict";

const mongoose = require("mongoose"),
  { Schema } = require("mongoose"),
  gameSchema = new Schema({
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
    },
    button: {
      type: String,
    },
    gameImg: {
      type: String,
    },
    modalText: {
      type: [String],
    },
  });

module.exports = mongoose.model("Game", gameSchema);
