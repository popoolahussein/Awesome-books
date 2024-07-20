import Book from './book.js';

export default class Library {
  static getBooksFromLocalStorage() {
    const booksData = JSON.parse(localStorage.getItem('books')) || [];
    return booksData.map((book) => new Book(book.title, book.author));
  }

  static updateLocalStorage(books) {
    const booksData = books.map((book) => ({ title: book.getTitle(), author: book.getAuthor() }));
    localStorage.setItem('books', JSON.stringify(booksData));
  }

  static addBook(books, book) {
    const updatedBooks = [...books, book];
    Library.updateLocalStorage(updatedBooks);
    return updatedBooks;
  }

  static removeBook(books, title) {
    const updatedBooks = books.filter((book) => book.getTitle() !== title);
    Library.updateLocalStorage(updatedBooks);
    return updatedBooks;
  }

  static createBookElement(book, books, displayBooks) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = `
      <p class="book-p">"${book.getTitle()}" by ${book.getAuthor()}</p>
      <button class="remove-btn" data-title="${book.getTitle()}">Remove</button>
    `;

    bookElement.querySelector('.remove-btn').addEventListener('click', () => {
      const updatedBooks = Library.removeBook(books, book.getTitle());
      displayBooks(updatedBooks);
    });

    return bookElement;
  }

  static displayBooks(books) {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = '';
    books.forEach((book) => {
      const bookElement = Library.createBookElement(book, books, Library.displayBooks);
      bookList.appendChild(bookElement);
    });
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const book = new Book(title, author);
    const books = Library.getBooksFromLocalStorage();
    const updatedBooks = Library.addBook(books, book);
    Library.displayBooks(updatedBooks);
    e.target.reset();
  }

  static init() {
    const books = Library.getBooksFromLocalStorage();
    Library.displayBooks(books);

    document.getElementById('book-form').addEventListener('submit', Library.handleFormSubmit);
  }
}
