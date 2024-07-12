/**
 * ? Function to create a new book object
 */
function createBook(title, author) {
  return { title, author };
}
/**
 * ? BookCollection object to manage the collection of books
 * */
const bookCollection = {
  books: JSON.parse(localStorage.getItem('books')) || [],

  addBook(book) {
    this.books.push(book);
    this.updateLocalStorage();
  },

  removeBook(title) {
    this.books = this.books.filter((book) => book.title !== title);
    this.updateLocalStorage();
  },

  updateLocalStorage() {
    localStorage.setItem('books', JSON.stringify(this.books));
  },

  displayBooks() {
    const bookList = document.getElementById('book-list');
    bookList.innerHTML = ''; // Clear the current list
    this.books.forEach((book) => {
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
        bookCollection.removeBook(title);
        bookCollection.displayBooks();
      });
    });
  },
};

/**
 * ? Event listener for the form submission to add a book
 */

document.getElementById('book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const book = createBook(title, author);
  bookCollection.addBook(book);
  bookCollection.displayBooks();
  e.target.reset(); // Reset the form fields
});

/**
 * ? Display the books on page load
 */

document.addEventListener('DOMContentLoaded', () => {
  bookCollection.displayBooks();
});
