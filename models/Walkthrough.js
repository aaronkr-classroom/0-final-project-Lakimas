// models/Walkthrough.js
"use strict";

/**
 * Listing 17.6 (p. 249)
 * 새로운 스키마와 모델의 생성
 */
const mongoose = require("mongoose"),
  walkthroughSchema = mongoose.Schema(
    {
      title: {
        // 강좌 스키마에 속성 추가
        type: String,
        required: true,
        unique: true,
      },
      description: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

module.exports = mongoose.model("Walkthrough", walkthroughSchema);
