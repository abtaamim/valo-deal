//import mongoose from "mongoose";
const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: 'user',
    },
    cartItems: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        itemType: {
          type: String,
          // enum: ['mobile', 'computer', 'electronic', 'vehicle'], // Enum values for item types
          required: true
        },
        addedTime: { type: Date, default: Date.now() },
      }
    ],
    recentlyViewedItems: [
      {
        itemId: { type: Schema.Types.ObjectId, required: true },
        itemType: {
          type: String,
          //enum: ['mobiles', 'computers', 'electronics', 'vehicles'], // Enum values for item types
          required: true
        },
        viewedAt: { type: Date, default: Date.now }
      }
    ],
    searchedItems: [
      {
        searchTerm: { type: String, required: true },
        searchedAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("users", userSchema);