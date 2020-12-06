import { MongoGridFS } from "mongo-gridfs";
import { MongoClient } from "mongodb";

export async function getMongoStorage() {
  const mongo = await MongoClient.connect(
    process.env.SERVER_MONGO_STORAGE_URL,
    { useUnifiedTopology: true }
  );
  return new MongoGridFS(mongo.db("rosetta"), "rosetta-storage");
}
