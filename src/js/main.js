import Library from './library.js';

document.addEventListener('DOMContentLoaded', () => {
  Library.init();

  const books = Library.getBooksFromLocalStorage();
  const removedBooks = Library.getRemovedBooksFromLocalStorage();
  Library.displayBooks(books, removedBooks);

  const hamburgerButton = document.getElementById('bin-button');
  const mobileMenu = document.getElementById('menu');

  hamburgerButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('visible');
  });

  mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.remove('visible');
  });
});
