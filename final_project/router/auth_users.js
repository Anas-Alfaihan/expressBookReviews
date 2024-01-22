import express from "express";
import jwt from "jsonwebtoken";
import { books } from "./booksdb.js";
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  const user = users.find((user) => user.username === username);
  return !user;
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  const user = users.find(
    (user) => user.username === username && user.password === password
  );
  return !!user;
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "user name or password is missing" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username, password },
      "fingerprint_customer",
      { expiresIn: 60 * 60 }
    );
    req.session.authorization = { accessToken };
    return res.status(200).json({ message: "User logged in successfully" });
  } else {
    return res.status(401).json({ message: "Invalid credentials" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const { username } = req.user;
  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  book.reviews[username] = review;

  books[isbn] = book;

  return res.status(200).json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const { username } = req.user;
  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  delete book.reviews[username];
  books[isbn] = book;
  return res.status(200).json({ message: "Review deleted successfully" });
});

export { regd_users, isValid, authenticatedUser, users };
