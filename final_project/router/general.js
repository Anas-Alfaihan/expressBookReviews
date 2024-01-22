import express from "express";
import { books, getBooksasPromise } from "./booksdb.js";
import { isValid, users } from "./auth_users.js";

const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "user name or password is missing" });

  if (isValid(username)) {
    users.push({ username, password });
    return res.status(200).json({ message: "User created successfully" });
  } else {
    return res.status(409).json({ message: "User already exists" });
  }
});

// Get the book list available in the shop
public_users.get("/", async function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(await getBooksasPromise(), null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", async function (req, res) {
  const { isbn } = req.params;
  const books = await getBooksasPromise();
  const book = books[isbn];
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get("/author/:author", async function (req, res) {
  const { author } = req.params;
  const books = await getBooksasPromise();
  const filteredBooks = Object.values(books).filter(
    (book) => book.author === author
  );
  if (filteredBooks.length === 0) {
    return res
      .status(404)
      .json({ message: "There is no books for this author" });
  } else {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
});

// Get all books based on title
public_users.get("/title/:title", async function (req, res) {
  const { title } = req.params;
  const books = await getBooksasPromise();
  const filteredBooks = Object.values(books).filter((book) =>
    book.title.includes(title)
  );
  if (filteredBooks.length === 0) {
    return res
      .status(404)
      .json({ message: "There is no books with this title" });
  } else {
    return res.status(200).send(JSON.stringify(filteredBooks, null, 4));
  }
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const { isbn } = req.params;
  const book = books[isbn];
  if (!book) {
    res.status(404).json({ message: "Book not found" });
  }
  return res.status(200).send(JSON.stringify(book.reviews, null, 4));
});

export { public_users };
