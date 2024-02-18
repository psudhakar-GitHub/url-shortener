// create express app listening on port 5000 with body parser middleware
var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const ShortenURL = require("./models/url");
const { nanoid } = require("nanoid");
var moment = require("moment");
const { check } = require("express-validator");
require("dotenv").config();

const mongoUser = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const PORT = process.env.PORT || 5000;

mongoose
  .connect(
    `mongodb+srv://${mongoUser}:${mongoPassword}@mflix.mivbl.mongodb.net/shorten`
  )
  .then(() => {
    console.log("Connected to MongoDB");
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.get("/", async (_req, res) => {
  // list all URLs from mongoose
  let urls = await ShortenURL.find({});
  urls = urls.map((url) => {
    return {
      url: url.url.length > 20 ? url.url.substring(0, 20) + "..." : url.url,
      short: url.short,
      clicks: url.clicks,
      createdAt: moment(url.createdAt).format("DD-MM-yyyy"),
    };
  });
  res.render("shorten", { urls });
});

app.post(
  "/shorten",
  [check("url").isLength({ min: 5 }).trim()],
  async (req, res) => {
    const fullUrl = req.body.url;
    if (!fullUrl) res.sendStatus(404);

    // use shorturl function
    const sUrl = nanoid(6);

    const newItem = {
      url: fullUrl,
      short: sUrl,
    };

    // create an object using mongoose
    const shortenURL = new ShortenURL(newItem);
    await shortenURL.save();

    res.redirect("/");
  }
);

app.get("/:short", async (req, res) => {
  // findOne
  const foundUrl = await ShortenURL.findOne({ short: req.params.short });
  if (!foundUrl) res.sendStatus(500);

  foundUrl.clicks++;
  await foundUrl.save();

  res.redirect(foundUrl.url);
});

app.listen(PORT, () => {
  console.log("App running on port " + PORT);
});
