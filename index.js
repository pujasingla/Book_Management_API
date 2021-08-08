const express = require("express");
var bodyParser = require("body-parser");//read the body and convert into json

//Database
const database = require("./database");

//Initialize express
const booky = express();

booky.use(bodyParser.urlencoded({extended: true}));//request can have data in any format
booky.use(bodyParser.json());
/*
Route           /
Description     Get all the books
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/",(req,res) => {
  return res.json({books: database.books});
});

/*
Route           /is
Description     Get specific book on ISBN
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/is/:isbn",(req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.ISBN === req.params.isbn
  );
  if(getSpecificBook.length === 0) {
    return res.json({error:`No book found for the ISBN of ${req.params.isbn}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route           /c
Description     Get list of books based on category
Access          PUBLIC
Parameter       category
Methods         GET
*/

booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.category.includes(req.params.category)
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the category of ${req.params.category}`});
  }

  return res.json({book: getSpecificBook});
});


/*
Route           /lang
Description     Get list of books based on language
Access          PUBLIC
Parameter       language
Methods         GET
*/
booky.get("/lang/:language", (req,res) => {
  const getSpecificBook = database.books.filter(
    (book) => book.language === req.params.language
  );

  if(getSpecificBook.length === 0) {
    return res.json({error: `No book found for the language of ${req.params.language}`});
  }

  return res.json({book: getSpecificBook});
});

/*
Route           /author
Description     Get all authors
Access          PUBLIC
Parameter       NONE
Methods         GET
*/
booky.get("/author", (req,res) => {
  return res.json({authors: database.author});
});


/*
Route           /author
Description     Get specific author based on id
Access          PUBLIC
Parameter       id
Methods         GET
*/
///////
booky.get("/author/:id",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.id == req.params.id
  );
  if(getSpecificAuthor.length === 0) {
    return res.json({error:`No publication is found for the id of ${req.params.id}`});
  }

  return res.json({author: getSpecificAuthor});
});
//////

/*
Route           /author/book
Description     Get all authors based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/author/book/:isbn",(req,res) => {
  const getSpecificAuthor = database.author.filter(
    (author) => author.books.includes(req.params.isbn)
  );

  if(getSpecificAuthor.length === 0)
  {
    return res.json({
      error: `No author found for the book of ${req.params.isbn}`
    });
  }
  return res.json({authors: getSpecificAuthor});
});

/*
Route           /publications
Description     Get all publications
Access          PUBLIC
Parameter       NONE
Methods         GET
*/

booky.get("/publications",(req,res) => {
  return res.json({publications: database.publication});
})

/*
Route           /publications
Description     Get specific publication based on id
Access          PUBLIC
Parameter       id
Methods         GET
*/
///////
booky.get("/publications/:id",(req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.id == req.params.id
  );
  if(getSpecificPublication.length === 0) {
    return res.json({error:`No publication is found for the id of ${req.params.id}`});
  }

  return res.json({publication: getSpecificPublication});
});
//////


/*
Route           /publications/book
Description     Get list of publications based on books
Access          PUBLIC
Parameter       isbn
Methods         GET
*/
booky.get("/publications/book/:isbn",(req,res) => {
  const getSpecificPublication = database.publication.filter(
    (publication) => publication.books.includes(req.params.isbn)
  );

  if(getSpecificPublication.length === 0)
  {
    return res.json({
      error: `No publication found for the book of ${req.params.isbn}`
    });
  }
  return res.json({publication: getSpecificPublication});
});


//POST

/*
Route           /book/new
Description     Add new books
Access          PUBLIC
Parameter       NONE
Methods         POST
*/

booky.post("/book/new",(req,res) => {
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks: database.books});
});

/*
Route           /author/new
Description     Add new authors
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/author/new", (req,res) => {
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json(database.author);
});


/*
Route           /publication/new
Description     Add new publications
Access          PUBLIC
Parameter       NONE
Methods         POST
*/
booky.post("/publication/new", (req,res) => {
  const newPublication = req.body;
  database.publication.push(newPublication);
  return res.json(database.publication);
});

/*
Route           /publication/update/book
Description     Update or Add new publication
Access          PUBLIC
Parameter       isbn
Methods         PUT
*/
booky.put("/publication/update/book/:isbn", (req,res) => {
  //Update the publication Database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId) {
      return pub.books.push(req.params.isbn);
    }
  });

  //Update the book Database
  database.books.forEach((book) => {
    if(book.ISBN ===req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
  });

  return res.json(
    {
      books: database.books,
      publications: database.publication,
      message: "Successfully updated publications"
    }
  );

});



//DELETE

/*
Route           /book/delete
Description     Delete a book
Access          PUBLIC
Parameter       isbn
Methods         DELETE
*/

booky.delete("/book/delete/:isbn", (req,res) => {
  //book that doesnot match with isbn , send it to updated database array
  //rest will be filtered Route

  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !==req.params.isbn
  )
  database.books = updatedBookDatabase;

  return res.json({books: database.books});
});


/*
Route           /book/delete/author
Description     Delete an author from book and vice versa
Access          PUBLIC
Parameter       isbn,authorId
Methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId", (req,res) => {
  //Update the book database
  database.books.forEach((book) => {
    if(book.ISBN ===req.params.isbn) {
      const newAuthorList = book.author.filter(
        (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
      );
      book.author = newAuthorList;
      return;
    }
  });

  //Update the author Database
  database.author.forEach((eachAuthor) => {
    if(eachAuthor.id === parseInt(req.params.authorId)) {
      const newBookList = eachAuthor.books.filter(
        (book) =>book !== req.params.isbn
      );
      eachAuthor.books = newBookList;
      return;
    }
  });
return res.json ({
  book: database.books,
  author: database.author,
  message: "Author was deleted"
});
});


booky.listen(3000,() => {
  console.log("Server is up and running");
});
