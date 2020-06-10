//Book constructor function
function Book(title, author, numpages, readStatus, cover) {
  this.title = title;
  this.author = author;
  this.numpages = numpages;
  this.readStatus = readStatus;
  this.cover = cover
}

//Array of book objects
let myLibrary = [
  {title: "The Fire Next Time",
  author: "James Baldwin",
  cover: "http://books.google.com/books/content?id=7ctWAAAAQBAJ&printsec=frontcover&img=1&zoom=5&edge=curl&source=gbs_api",
  index: 0,
  numpages: 128,
  readStatus: "Want to Read",}
];

//For each element in array this function will created
//a new row, cell, remove and toggle button
function render() {
  const bookShelf = document.getElementById('book-shelf')
  if (bookShelf !== null) {//if book-shelf exists (not null)
    bookShelf.remove();//remove table
  }

  //Update book counter in html
  const booksInLibrary = myLibrary.length;//lenght of books currently in myLibrary
  const bookCount = document.getElementById('book-count');//Get bookcount ID
  bookCount.innerText = booksInLibrary + " books";//Set inner text to current books in myLibrary

//Create a new book shelf 
  const createContainer = document.createElement('div') //Create container div book shelf
  createContainer.setAttribute('id', 'book-shelf')//Give container div ID of book shelf
  document.body.appendChild(createContainer)//Append book shelf div to body
  const container = document.getElementById('book-shelf');//Get book shelf ID

//Populate new book shelf with books in myLibrary
  myLibrary.forEach(book => {//For each book in myLibrary array
    let indexNumber = myLibrary.indexOf(book)//Index of book in current myLibrary array
    book.index = indexNumber; //Create a new key/value for book index

    const figure = document.createElement('figure')//Create a figure div
    figure.setAttribute('book-figure', book.index)//Set attribute of figure to the book array index
    const figCaption = document.createElement('figcaption')//Create a fig caption element
    const img = document.createElement('img');
    img.src = book.cover;
    figure.appendChild(img);
    for (let [key, value] of Object.entries(book)) {//For each key in the object

      if (key == "title") {//If the key is a title
        const paragraph = document.createElement('p')//Create a paragraph element
        paragraph.setAttribute('class', 'book-title')
        paragraph.innerText = value;//Insert title in paragraph
        figCaption.appendChild(paragraph)
        figure.appendChild(figCaption)
        container.appendChild(figure);
      }

      if (key == "author") {//If the key is a author
        const paragraph = document.createElement('p')//Create a paragraph element
        paragraph.setAttribute('class', 'book-author')
        paragraph.innerText = "by " + value;
        figCaption.appendChild(paragraph)
        figure.appendChild(figCaption)
        container.appendChild(figure);
      }

      if (key == "numpages") {
        const paragraph = document.createElement('p')//Create a paragraph element
        paragraph.setAttribute('class', 'book-pages')
        paragraph.innerText = "Pages: " + value;
        figCaption.appendChild(paragraph)
        figure.appendChild(figCaption)
        container.appendChild(figure);
      }
    }
    const readStatusButton = document.createElement('button');
    let status = book.readStatus;
    status = status.split(' ').join('-').toLocaleLowerCase();
    readStatusButton.classList.add(`${status}`);
    readStatusButton.setAttribute('read-status', '');
    readStatusButton.addEventListener('click', changeReadStatus);
    readStatusButton.innerText = book.readStatus ;
    figCaption.appendChild(readStatusButton)

    const removeButton = document.createElement('button')
    removeButton.setAttribute('id', 'remove')
    removeButton.addEventListener('click', removeBook)
    removeButton.innerText = 'Remove Book'
    figCaption.appendChild(removeButton)
  });
}

//Function that adds a new book object to array
function addBookToMyLibrary(object) {
  myLibrary.push(object);
  render()
}




// Search google API for ISBN or title/author
  const submitButton = document.getElementById('submit')//Get ID of submit button
  submitButton.addEventListener('click', addBook)//Add event listener to submit button
  function addBook(event) {
    event.preventDefault();//Prevent refresh when submit button is clicked

    const apiData = {//create an API data object
      titleAuthorSearch: `https://www.googleapis.com/books/v1/volumes?q=`,
      isbnSearch: `https://www.googleapis.com/books/v1/volumes?q=isbn:`,
      isbn: '',
      author: '',
      title: '',
      key: 'AIzaSyApS8eGPEmjIPxazqnpXLjWkpioa4xKpTU'
    }

    if (document.getElementById('isbn').value === '') {
      let title = document.getElementById('title').value
      title = 'intitle:' + title.split(" ").join('+')
      let author = document.getElementById('author').value
      author = '+inauthor:' + author.split(" ").join('+')

      apiData.titleAuthorSearch = apiData.titleAuthorSearch + title + author;


      fetch(apiData.titleAuthorSearch)
        .then( (data) => data.json())
        .then((book) => generateBookInfo(book.items[0]));

        const generateBookInfo = (book) => {

          const author = book.volumeInfo.authors[0];
          const title = book.volumeInfo.title;
          const pages = book.volumeInfo.pageCount;
          const readStatus = document.getElementById('read-status').value;
          const cover = book.volumeInfo.imageLinks.smallThumbnail;
        
          const newBook = new Book(title, author, pages, readStatus, cover)
          addBookToMyLibrary(newBook);
        }
        }

    const isbn = document.getElementById('isbn').value

    apiData.isbn = isbn
    
    const apiUrl = `${apiData.url}${apiData.isbn}${apiData.format}`
    fetch(apiUrl)
      .then( (data) => data.json())
      .then((book) => generateBookInfo(book));
    
    const generateBookInfo = (book) => {

      const author = book[`ISBN:${apiData.isbn}`].authors[0].name;
      const title = book[`ISBN:${apiData.isbn}`].title;
      const pages = book[`ISBN:${apiData.isbn}`].number_of_pages;
      const readStatus = document.getElementById('read-status').value;
      const cover = book[`ISBN:${apiData.isbn}`].cover.medium;
    
      const newBook = new Book(title, author, pages, readStatus, cover)
      addBookToMyLibrary(newBook);
    }
  }







// Show add book form
const addBookButton = document.getElementById('addbook');
addBookButton.addEventListener('click', function() {
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "block"
});

// Remove book function
function removeBook(e) {
  const bookIndex = Number(e.target.parentElement.parentElement.attributes[0].nodeValue);
  myLibrary.splice(bookIndex, 1);//remove book at index
  render()
}

function changeReadStatus(e) {
  const a = e.target.attributes[0].nodeValue;//class
  console.log(a)
const b = e.target.innerText;
const c = e.target;
console.log(b)
  switch(b) {
    case 'Want to Read':
      console.log('want to readdddd')
      e.target.innerText = 'Reading';
      c.classList.remove('want-to-read')
      c.classList.add("reading")
      break;
    case 'Reading':
      e.target.innerText = 'Read'
      c.classList.remove('reading')
      c.classList.add("read")
      break;
    case 'Read':
      e.target.innerText = 'Want to Read';
      c.classList.remove('read')
      c.classList.add("want-to-read")
      break;
  }
}
function clear() {
  document.getElementById('isbn').value = "";
  document.getElementById('title').value = "";
  document.getElementById('author').value = "";
}

const hideForm = document.getElementById('hide');
hideForm.addEventListener('click', function() {
  clear();
  const formContainer = document.querySelector(".form-container");
  formContainer.style.display = "none"
});
render()