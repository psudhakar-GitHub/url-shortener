// create a mongoose model called 'ShortenURL'

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ShortenURLSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },
    short: {
      type: String,
      required: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

var ShortenURL = mongoose.model("ShortenURL", ShortenURLSchema);

module.exports = ShortenURL;
