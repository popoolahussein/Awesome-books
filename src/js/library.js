import Book from './book.js';

const showModal = (modalId, message) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  const modalText = document.getElementById(`${modalId}-text`);
  if (modalText) modalText.textContent = message;
  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');

  const closeButton = modal.querySelector('.close');
  if (closeButton) {
    closeButton.onclick = () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    };
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  };
};

const showEditModal = (book, onSave) => {
  const modal = document.getElementById('edit-modal');
  if (!modal) return;
  const titleInput = document.getElementById('edit-title');
  const authorInput = document.getElementById('edit-author');
  if (titleInput && authorInput) {
    titleInput.value = book.getTitle();
    authorInput.value = book.getAuthor();
  }

  modal.style.display = 'block';
  modal.setAttribute('aria-hidden', 'false');

  const closeButton = modal.querySelector('.close');
  if (closeButton) {
    closeButton.onclick = () => {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    };
  }

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    }
  };

  const form = document.getElementById('edit-form');
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      const newTitle = titleInput.value;
      const newAuthor = authorInput.value;
      onSave(newTitle, newAuthor);
      modal.style.display = 'none';
      modal.setAttribute('aria-hidden', 'true');
    };
  }
};

export default class Library {
  // Retrieve books from local storage
  static getBooksFromLocalStorage() {
    const booksData = JSON.parse(localStorage.getItem('books')) || [];
    return booksData.map((book) => new Book(book.title, book.author, book.id));
  }

  static getRemovedBooksFromLocalStorage() {
    const removedBooksData = JSON.parse(localStorage.getItem('removedBooks')) || [];
    return removedBooksData.map((book) => new Book(book.title, book.author, book.id));
  }

  static updateLocalStorage(books, removedBooks = null) {
    const booksData = books.map((book) => ({
      title: book.getTitle(),
      author: book.getAuthor(),
      id: book.id,
    }));
    localStorage.setItem('books', JSON.stringify(booksData));
    if (removedBooks !== null) {
      const removedBooksData = removedBooks.map((book) => ({
        title: book.getTitle(),
        author: book.getAuthor(),
        id: book.id,
      }));
      localStorage.setItem('removedBooks', JSON.stringify(removedBooksData));
    }
  }

  static addBook(books, removedBooks, book) {
    const duplicateInActive = books.some((b) => b.title.toLowerCase() === book.title.toLowerCase());

    if (duplicateInActive) {
      showModal('message-modal', 'A book with this title already exists.');
      return books;
    }

    const updatedBooks = [...books, book];
    Library.updateLocalStorage(updatedBooks, removedBooks);
    return updatedBooks;
  }

  static removeBook(books, removedBooks, id) {
    const bookToRemove = books.find((book) => book.id === id);
    if (!bookToRemove) return { updatedBooks: books, updatedRemovedBooks: removedBooks };

    const updatedBooks = books.filter((book) => book.id !== id);
    const updatedRemovedBooks = [...removedBooks, bookToRemove];
    Library.updateLocalStorage(updatedBooks, updatedRemovedBooks);
    return { updatedBooks, updatedRemovedBooks };
  }

  static permanentlyDeleteBook(removedBooks, id) {
    const updatedRemovedBooks = removedBooks.filter((book) => book.id !== id);
    localStorage.setItem('removedBooks', JSON.stringify(updatedRemovedBooks));
    return updatedRemovedBooks;
  }

  static restoreBook(removedBooks, books, id) {
    const bookToRestore = removedBooks.find((book) => book.id === id);
    if (!bookToRestore) return { updatedBooks: books, updatedRemovedBooks: removedBooks };

    const duplicateInActive = books.some(
      (b) => b.title.toLowerCase() === bookToRestore.title.toLowerCase(),
    );

    if (duplicateInActive) {
      showModal('message-modal', 'A book with this title already exists in the active list.');
      return { updatedBooks: books, updatedRemovedBooks: removedBooks };
    }

    const updatedRemovedBooks = removedBooks.filter((book) => book.id !== id);
    const updatedBooks = [...books, bookToRestore];
    Library.updateLocalStorage(updatedBooks, updatedRemovedBooks);
    return { updatedBooks, updatedRemovedBooks };
  }

  static updateBook(books, id, newTitle, newAuthor) {
    const updatedBooks = books.map((book) => {
      if (book.id === id) {
        return new Book(newTitle, newAuthor, id);
      }
      return book;
    });
    Library.updateLocalStorage(updatedBooks);
    return updatedBooks;
  }

  static createBookElement(book, books, removedBooks, displayBooks) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = `
      <p class="book-p">"${book.getTitle()}" by ${book.getAuthor()}</p>
      <div class="manage-btn">
        <button class="remove-btn" data-id="${book.id}">Remove</button>
        <button class="edit-btn" data-id="${book.id}">Edit</button>
      </div>
    `;

    bookElement.querySelector('.remove-btn').addEventListener('click', () => {
      const { updatedBooks, updatedRemovedBooks } = Library.removeBook(
        books,
        removedBooks,
        book.id,
      );
      displayBooks(updatedBooks, updatedRemovedBooks);
    });

    bookElement.querySelector('.edit-btn').addEventListener('click', () => {
      showEditModal(book, (newTitle, newAuthor) => {
        const updatedBooks = Library.updateBook(books, book.id, newTitle, newAuthor);
        displayBooks(updatedBooks, removedBooks);
      });
    });

    return bookElement;
  }

  static createRemovedBookElement(book, books, removedBooks, displayBooks) {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = `
      <p class="book-p">"${book.getTitle()}" by ${book.getAuthor()}</p>
      <div class="manage-btn">
        <button class="restore-btn" data-id="${book.id}">Restore</button>
        <button class="delete-btn" data-id="${book.id}">
          <span class="material-symbols-outlined">delete_forever</span>
        </button>
      </div>
    `;

    bookElement.querySelector('.restore-btn').addEventListener('click', () => {
      const { updatedBooks, updatedRemovedBooks } = Library.restoreBook(
        removedBooks,
        books,
        book.id,
      );
      displayBooks(updatedBooks, updatedRemovedBooks);
    });

    bookElement.querySelector('.delete-btn').addEventListener('click', () => {
      const updatedRemovedBooks = Library.permanentlyDeleteBook(removedBooks, book.id);
      displayBooks(books, updatedRemovedBooks);
    });

    return bookElement;
  }

  static displayBooks(books, removedBooks) {
    const bookList = document.getElementById('book-list');
    if (bookList) {
      bookList.innerHTML = '';
      books.forEach((book) => {
        const bookElement = Library.createBookElement(
          book,
          books,
          removedBooks,
          Library.displayBooks,
        );
        bookList.appendChild(bookElement);
      });
    }

    const removedBookList = document.getElementById('removed-book-list');
    if (removedBookList) {
      removedBookList.innerHTML = '';
      removedBooks.forEach((book) => {
        const bookElement = Library.createRemovedBookElement(
          book,
          books,
          removedBooks,
          Library.displayBooks,
        );
        removedBookList.appendChild(bookElement);
      });
    }
  }

  static handleFormSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const book = new Book(title, author);
    const books = Library.getBooksFromLocalStorage();
    const removedBooks = Library.getRemovedBooksFromLocalStorage();
    const updatedBooks = Library.addBook(books, removedBooks, book);
    Library.displayBooks(updatedBooks, removedBooks);
    e.target.reset();
  }

  static init() {
    const books = Library.getBooksFromLocalStorage();
    const removedBooks = Library.getRemovedBooksFromLocalStorage();
    Library.displayBooks(books, removedBooks);

    const bookForm = document.getElementById('book-form');
    if (bookForm) {
      bookForm.addEventListener('submit', Library.handleFormSubmit);
    }
  }
}
