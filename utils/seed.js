const connection = require("../config/connection");
const { User, Thought } = require("../models");
const { userData, thoughtsData } = require("./data");

connection.on("error", (err) => err);

connection.once("open", async () => {
  console.log("connected");

  const users = userData;
  const thoughts = thoughtsData;

  await User.collection.insertMany(users);

  await Thought.collection.insertMany(thoughts);

  console.log("\n 🌱 Seeding complete! 🌱 \n");
  process.exit(0);
});
