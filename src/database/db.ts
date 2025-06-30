import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
import { Vehicle } from "@/vechicle/entity/vehicle";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "password",
    database: process.env.DB_NAME || "database",
    synchronize: true,
    logging: true,
    entities: [
        Vehicle
    ],
    subscribers: [],
    migrations: [],
})