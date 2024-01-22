import express from "express";
import jwt from "jsonwebtoken";
import session from "express-session";
import { regd_users as customer_routes } from "./router/auth_users.js";
import { public_users as genl_routes } from "./router/general.js";

const app = express();

app.use(express.json());

app.use(
  "/customer",
  session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true,
  })
);

app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    const token = req.session.authorization["accessToken"];
    jwt.verify(token, "fingerprint_customer", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({ message: "User not authenticated" });
      }
    });
  } else {
    return res.status(403).json({ message: "User not Logged in" });
  }
});

const PORT = 3001;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log("Server is running"));
