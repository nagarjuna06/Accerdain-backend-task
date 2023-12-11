import express from "express";
import connection from "./db.js";
import { getUser, newUser } from "./queries.js";
import bcrypt from "bcrypt";
import { generateToken, verifyJwtToken } from "./token.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.post("/signup", async (req, res) => {
  const query = await newUser(req.body);
  connection.query(query, (err, result) => {
    if (err) {
      if (err.sqlMessage.includes("users.email"))
        return res.status(400).json({
          email: "This Email has already exists!",
        });
      else if (err.sqlMessage.includes("users.username"))
        return res.status(400).json({
          username: "This Username is already taken",
        });
      else return res.status(500).json({ msg: err.sqlMessage });
    }
    return res.json({ msg: `Sign Up Successful !` });
  });
});

app.post("/signin", async (req, res) => {
  const { user, password = "" } = req.body;
  const query = getUser({ user });
  connection.query(query, async (err, result) => {
    if (err) return res.json({ msg: err.sqlMessage });
    if (!result.length) {
      return res.status(400).json({
        user: "Sorry, we don't recognize that Email.You can create new Account",
      });
    }
    const isCorrectPassword = await bcrypt.compare(
      password,
      result[0].password
    );
    if (!isCorrectPassword) {
      return res.status(400).json({
        password: "Sorry, we don't recognize that Password. You can try again",
      });
    }
    const token = generateToken(result[0]);
    return res.json({ token });
  });
});

app.get("/", verifyJwtToken);

app.listen(5000, () => console.log("server started at 5000"));
