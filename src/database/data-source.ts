import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USERNAME || "postgres",
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME || "travel_umroh",
  synchronize: false,
  logging: process.env.NODE_ENV === "development",
  entities: ["src/**/*.entity{.ts,.js}"],
  migrations: ["src/database/migrations/*{.ts,.js}"],
  subscribers: [],
});
