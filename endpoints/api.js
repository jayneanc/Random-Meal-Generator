const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const app = express();

// Get types
const { meals } = require("./meals");
const { types, readFile, writeFile } = meals;
readFile();

// Adding Helmet to enhance your Rest API's security
app.use(helmet());

// Using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// Enabling CORS for all requests
app.use(cors());

// Defining an endpoint to return all types
app.get("/", (req, res) => {
  res.send({ data: types });
});

// Defining another endpoint to add food to text
app.post("/add", writeFile);

// Starting the server
app.listen(3001, () => {
  console.log("listening on port 3001");
});
