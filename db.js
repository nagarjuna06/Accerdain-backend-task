import mysql from "mysql";
import { config } from "dotenv";

config();

const { USER: user, PASSWORD: password } = process.env;

const connection = mysql.createPool({
  host: "localhost",
  user,
  password,
  database: "accredain",
  connectionLimit: 10,
});

export default connection;
