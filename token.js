import jwt from "jsonwebtoken";
import { config } from "dotenv";
config();

const { TOKEN_SECRET: secretKey } = process.env;

//generate token
export const generateToken = (payload) => {
  const { username, email, name = "" } = payload;

  const token = jwt.sign({ username, email, name }, secretKey, {
    expiresIn: "24h",
  });
  return token;
};

//verify token
export const verifyJwtToken = (req, res) => {
  let jwtToken;
  const authHeader = req.headers["authorization"];

  if (authHeader !== undefined) {
    jwtToken = authHeader.split(" ")[1];
  }
  if (jwtToken === undefined) {
    res.status(400).json({ msg: "Unauthorized user!" });
  } else {
    jwt.verify(jwtToken, secretKey, (error, user) => {
      if (error) {
        res.status(401).json({ msg: "Invalid access token" });
      } else {
        return res.json(user);
      }
    });
  }
};
