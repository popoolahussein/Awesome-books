import Library from './library.js';

document.addEventListener('DOMContentLoaded', () => {
  const books = Library.getBooksFromLocalStorage();
  const removedBooks = Library.getRemovedBooksFromLocalStorage();
  Library.displayBooks(books, removedBooks);
});
