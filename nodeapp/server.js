const express = require("express");
const path = require('path');
const mongoose = require("mongoose");
const Book = require("./models/bookModel");
const bookRoutes = require("./routers/bookRouter");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static assets from the "views" directory
app.use(express.static('views'));

app.get('/add-book', (req, res) => {
  res.render('addBook');
});

app.get('/get-book', async (req, res) => {
  try {
    const books = await Book.find({});
    res.render('getBook', { books: books });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from the database");
  }
});

app.get('/updateBook', async (req, res) => {
  try {
    const bookId = req.query.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    res.render('updateBook', { book });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching data from the database");
  }
});

app.get('/deleteBook', async (req, res) => {
  try {
    const bookId = req.query.bookId;
    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).send("Book not found");
    }

    // Delete the product from the database
    await Book.findByIdAndRemove(bookId);

    res.redirect('/get-book');
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting the book");
  }
});

mongoose
  .connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => {
    console.log("Database connected");
    app.listen(8080, () => {
      console.log("API is running in PORT:8080");
    });
  })
  .catch((error) => {
    console.log(error);
  });




app.use("/book", bookRoutes);

module.exports = app;