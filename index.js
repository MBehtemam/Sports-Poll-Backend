require("dotenv").config({ path: "variables.env" });
const createServer = require("./src/createServer");
const db = require("./src/db");

const server = createServer();

//Todo user express midlewear to cookie
//todo populate

server.start(
  {
    cors: {
      credentials: true,
      origin: process.env.FRONTEND_URL
    }
  },
  deets => {
    console.log(`Server is running on http:localhost:/${deets.port}`);
  }
);
