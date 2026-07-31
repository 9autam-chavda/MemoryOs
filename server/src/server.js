require("dotenv").config();

const dns = require("dns");

if (process.env.NODE_ENV !== "production") {
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
}

const app = require("./app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 MemoryOS Backend running on port ${PORT}`);
});