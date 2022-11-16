const express = require("express");
const path = require("path");
const http = require("http");
var forceSsl = require("force-ssl-heroku");

const app = express();

app.use(forceSsl);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(__dirname + "/dist/gardner-sceduling-system"));

app.get("/*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "dist/gardner-sceduling-system/index.html")
  );
});

const port = process.env.PORT || "7777";
app.set("port", port);

/**
 * Create HT TP server.
 */
const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port, () => console.log(`API running on localhost:${port}`));
