const { MongoClient } = require("mongodb");

const uri = process.env.CONNECT_DB_STR;

const client = new MongoClient(uri);
const connect = async () => {
  try {
    await client.connect();
    console.log("Mongo Database connected..!");
  } catch {
    console.log("Failed to connect Mongo Database connected..!");
  }
};
module.exports = connect;
