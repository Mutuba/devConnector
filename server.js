const express = require("express");
const connectDB = require("./config/db");
var bodyParser = require("body-parser");
var cors = require("cors");
var dotenv = require("dotenv")
const path = require('path');


dotenv.config()
const app = express();

// support parsing of application/json type post data
app.use(bodyParser.json());
app.use(cors());
//support parsing of application/x-www-form-urlencoded post data
app.use(bodyParser.urlencoded({ extended: true }));
//connect to DB
connectDB();
//init middleware
// app.use(express.json({ extended: false }));
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);


//api routes
// app.get("/", (req, res) => res.send("API Running"));
app.use("/api/users", require("./routes/api/users"));
app.use("/api/profile", require("./routes/api/profile"));
app.use("/api/auth", require("./routes/api/auth"));
app.use("/api/posts", require("./routes/api/posts"));


if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
  });
  
}
//app port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
