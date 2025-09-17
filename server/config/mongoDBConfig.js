import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb"


const connectMongo = async () => {

  const client = new MongoClient(process.env.MONGO_URI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (err) {
    console.error("Erreur connexion MongoDB:", err);
    process.exit(1);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
};
export default connectMongo;