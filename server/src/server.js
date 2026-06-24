require("dotenv").config();

const app = require("./app");
const connectDB = require("./config/db");

const dns = require('dns');
dns.setServers(['1.1.1.1', '8.8.8.8']);

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});