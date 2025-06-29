import "reflect-metadata";
import * as dotenv from "dotenv";
import app from "./app";
import { AppDataSource } from "./database/db";

dotenv.config();

async function main() {
  try {
    await AppDataSource.initialize();
    console.log("✅ Database connected successfully");
    app.listen(process.env.API_PORT, () => {
      console.log(`🚀 Server is running on http://${process.env.API_HOST}:${process.env.API_PORT}`);
    });
  } catch (error){
    console.error("❌ Error connecting to the database:", error);
  }
}

main();