const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')
require('dotenv').config();

const app = express();
const port = 5000;
app.use(cors());
app.use(express.json());

const uri = "mongodb://localhost:27017/BookList";
console.log(uri)
mongoose.connect(uri)
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

const BookListSchema = new mongoose.Schema({
  title : { type: String, required: true },
  author : { type: String, required: true },
  description : {type: String}
})

const BookListModel = mongoose.model('300345000-Minh', BookListSchema)

app.get('/', (req, res) => {
  BookListModel.find()
    .then((b) => res.json(b))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.get('/:id', (req, res) => {
  BookListModel.findById(req.params.id)
    .then((b) => res.json(b))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/', async (req, res) => {
  const title = req.body.title;
  const author = req.body.author;
  const description = req.body.description;
  // create a new Book object
  const newBook = await new BookListModel({
    title: title,
    author : author,
    description : description
  });
  console.log(newBook);
  newBook
    .save()
    .then(() => res.json('Book added!'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.post('/:id', async (req, res) => {
  console.log(req.params.id);
await  BookListModel.findById(req.params.id)
    .then((b) => {
      b.BookListModel = req.body.BookListModel;

      b
        .save()
        .then(() => res.json('Book updated!'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.delete('/:id', async (req, res) => {
  console.log('delete logged');
await BookListModel.findByIdAndDelete(req.params.id)
    .then(() => res.json('Book deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
