/* contents of the code(search it)
1. good practice
*/
require('dotenv').config()
console.log(process.env)
const express = require('express')
const logger = require('./logger')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(logger);


app.listen(process.env.port || 3000, () =>{
    logger.info(`server is running on ${process.env.port}, app is running on ${process.env.NODE_ENV}`)
})
logger.error('error')
logger.warn('warn')
logger.info('info')
logger.verbose('verbose')
logger.debug('debug')
logger.silly('silly')
// api struture for book management system
// Get all the books
//API endpoint: /api/books, Method: GET, Request body: Empty,Response: [{book 1 details},{book 2 details},{book 3 details} ......]

//Get a single book
//API endpoint: /api/books/bookid,  Method: GET, Request body: Empty, Response: [{book 1 details}

//create a book
//API endpoint: /api/books,  Method: POST, Request body: {book 1 details}, Response: [{success: true}/{book details}]

//update a book
//API endpoint: /api/books/bookid,  Method: PUT, Request body: {book 1 details}, Response: [{success: true}/{book details}]

//delete a book
//API endpoint: /api/books/bookid,  Method: DELETE, Request body: {}, Response: [{success: true}/{book details}]



const books = [   //this here works as a database, while if you add another id to it it will be in RAM so would vanish when the server restarts
    { id: 1,
      title: "Harry Potter and the Chamber of Secrets",
      author: "J.K. Rowling",
      year: 1998,
      pages: 251,
      publisher: "Bloomsbury",
      language: "English",
    },
    { id:2,
      title: "Clean Code",
      author: "Some other author",
      year: 1999,
      pages: 317,
      publisher: "Bloomsbury",
      language: "English",
    },
  ];
  

app.get('/', (req, res) => {
    res.send('hello world')
    console.log({
        url: req.url,
        method: req.method,
        headers: req.headers,
        body: req.body,
    })
})

app.get('/api/books', (req, res) => {
    logger.info('Info message');
    logger.error('Error message');
    logger.warn('Warning message');
    res.send(books)
})

app.get('/api/books/:id', (req,res) => {
    const id = req.params.id; // to define the query parameter refrenced in url as :id
    res.send(books[id-1]);
    //{ const book = books.find(b => b.id === parseInt(req.params.id)) if (!book) return res.status(404).send('The book with the given ID was not found.') res.send(book) })
})

// Create a new book
app.post('/api/books', (req, res) => {
    const { title, author, year, pages, publisher, language } = req.body; //its always good to define globally into the function like this rathe than defined below commented out

    if (!title || !author || !year || !pages || !publisher || !language) { // good practice, will throw "error": "All fields are required" otherwise would accept without a field, that would be missing when you get it. 
        return res.status(400).json({ error: 'All fields are required' });
    }

    const book = {
        id: books.length + 1,
        title,
        author,
        year,
        pages,
        publisher,
        language,
    };

    // books.push(newBook);
    // res.status(201).json(newBook); // 201 Created status and return the newly created book
    //     const book = {
    //     id:req.body.id,
    //     title: req.body.title,
    //     author: req.body.author,
    //     year: req.body.year,
    //     pages: req.body.pages,
    //     publisher: req.body.publisher,
    //     language: req.body.language
    // }
    books.push(book)
    res.send(book)
    // res.status(201).json(book);
});

app.put('/api/books/:id', (req, res)=>{
    
    const book = books.find(b => b.id === parseInt(req.params.id)) // here it is finding the book id to which changes are to be made, here say req book id is 5 and there is no data so it will give 404
     if (!book) 
        return res.status(404).send('The book with the given ID was not found.')
    book.title = req.body.title,
    book.author = req.body.author,
    book.year = req.body.year,
    book.pages = req.body.pages,
    book.publisher = req.body.publisher,
    book.language = req.body.language
    res.send(book)
})

app.delete('/api/books/:id', (req, res)=>{
    const id = req.params.id
    const book = books.find(b => b.id === parseInt(req.params.id))
        if (!book) 
            return res.status(404).send('The book with the given ID was not found.')
    const index = books.indexOf(book) 
    books.splice(index,1)
    console.log(`The book: ${id} has successfully deleted`)
    res.send(book)
})