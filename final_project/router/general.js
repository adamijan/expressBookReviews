const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;
  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!isValid(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  res.send(JSON.stringify({books}, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const isbn = req.params.isbn
  res.send(books[isbn]);
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const searchAuthor = req.params.author;
  const filteredBook = Object.values(books).filter(book => book.author === searchAuthor);
  if(filteredBook.length > 0){
      res.send(filteredBook);
  }else{
      res.send("No books found by this author");
  }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const title = req.params.title.toLowerCase();
  const filteredBook = []; 

  for (let isbn in books) {
      if (books[isbn].title.toLowerCase() === title) { 
        filteredBook.push({ isbn: isbn, ...books[isbn] }); 
      }
  }

  if (filteredBook.length > 0) {
      res.status(200).send(JSON.stringify(filteredBook, null, 4));
  } else {
      res.status(404).json({ message: "No books found by this title" });
  }
});

// Task 10: 
public_users.get('/books', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/'); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching booklist' });
    }
});

// Task 11: Get Book Details Based on ISBN
public_users.get('/books/:isbn', async (req, res) => {
    const { isbn } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/isbn/${isbn}`); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching book details' });
    }
});

// Task 12: 
public_users.get('/books/author/:author', async (req, res) => {
    const { author } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by author' });
    }
});

// Task 13: 
public_users.get('/books/title/:title', async (req, res) => {
    const { title } = req.params;
    try {
        const response = await axios.get(`http://localhost:5000/title/${title}`); 
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching books by title' });
    }
});

module.exports.general = public_users;
