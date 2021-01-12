const path = require("path");

const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// const bodyParser = require("body-parser");
// app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbservice");

const rootDir = require("./helpers/path");

const routes = require("./routes/elections");

//serve files statically(public css, js img etc)
app.use(express.static(path.join(rootDir, "public")));

app.use(routes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(rootDir, "views", "errors", "404.html"));
});

app.listen(process.env.PORT, () => console.log("app is running"));
