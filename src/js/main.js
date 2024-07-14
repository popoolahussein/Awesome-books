/**
 * ? Function to create a new book object
 */
const createBook = (title, author) => ({ title, author });

/**
 * ? Function to update localStorage with the current books
 */
const updateLocalStorage = (books) => {
  localStorage.setItem('books', JSON.stringify(books));
};

/**
 * ? Function to add a new book to the collection
 */
const addBook = (books, book) => {
  const updatedBooks = [...books, book];
  updateLocalStorage(updatedBooks);
  return updatedBooks;
};

/**
 * ? Function to remove a book from the collection
 */
const removeBook = (books, title) => {
  const updatedBooks = books.filter((book) => book.title !== title);
  updateLocalStorage(updatedBooks);
  return updatedBooks;
};

/**
 * ? Function to display books
 */
const displayBooks = (books) => {
  const bookList = document.getElementById('book-list');
  bookList.innerHTML = '';
  books.forEach((book) => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = `
      <p>${book.title}</p>
      <p>${book.author}</p>
      <button class="remove-btn" data-title="${book.title}">Remove</button>
      <hr class="line">
    `;
    bookList.appendChild(bookElement);
  });

  /**
   * ? Add event listeners to all remove buttons
   */
  document.querySelectorAll('.remove-btn').forEach((button) => {
    button.addEventListener('click', (e) => {
      const title = e.target.getAttribute('data-title');
      const updatedBooks = removeBook(books, title);
      displayBooks(updatedBooks);
    });
  });
};

/**
 * ? Event listener for the form submission to add a book
 */
document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const book = createBook(title, author);
  const books = JSON.parse(localStorage.getItem('books')) || [];
  const updatedBooks = addBook(books, book);
  displayBooks(updatedBooks);
  e.target.reset();
});

/**
 * ? Display the books on page load
 */
document.addEventListener('DOMContentLoaded', () => {
  const books = JSON.parse(localStorage.getItem('books')) || [];
  displayBooks(books);
});
