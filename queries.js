import mysql from "mysql";
import bcrypt from "bcrypt";

export const newUser = async ({ name, username, email, password }) => {
  const hashPassword = await bcrypt.hash(password, 10);
  const sql =
    "INSERT INTO users(name,username,email,password) VALUES (?,?,?,?)";
  const inserts = [name, username, email, hashPassword];
  const queryString = mysql.format(sql, inserts);
  return queryString;
};

export const getUser = ({ user }) => {
  const sql = "SELECT * FROM users WHERE email=? OR username=?";
  const inserts = [user, user];
  const queryString = mysql.format(sql, inserts);
  return queryString;
};
