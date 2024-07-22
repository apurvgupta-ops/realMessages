import mongoose from "mongoose";

type connectionObj = {
  isConnected?: number;
};

const connection: connectionObj = {};

async function dbConnect(): Promise<void> {
  try {
    const db = await mongoose.connect(process.env.MONGO_URI || "", {});

    connection.isConnected = db.connections[0].readyState;

    console.log("db data", db);

    console.log("Db is connected");
  } catch (error) {
    console.log("Db connection Failed", error);

    process.exit(1);
  }
}

export default dbConnect;
