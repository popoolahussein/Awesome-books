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

  const sections = {
    'nav-books': 'books-list',
    'nav-add': 'add-book',
    'nav-contact': 'contact',
  };

  document.querySelector('nav').addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      e.preventDefault();
      const sectionId = sections[e.target.id];
      Object.values(sections).forEach((id) => {
        document.getElementById(id).style.display = 'none';
      });
      document.getElementById(sectionId).style.display = 'grid';
    }
  });
});

const isGregLeapYear = (year) => (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
// eslint-disable-next-line no-unused-vars
const gregToFixed = (year, month, day) => {
  const a = Math.floor((year - 1) / 4);
  const b = Math.floor((year - 1) / 100);
  const c = Math.floor((year - 1) / 400);
  const d = Math.floor((368 * month - 362) / 12);
  let e;
  if (month <= 2) {
    e = 0;
  } else if (month > 2 && isGregLeapYear(year)) {
    e = -1;
  } else {
    e = -2;
  }
  return 1 + 365 * (year - 1) + a - b + c + d + e + day;
};

window.onload = () => {
  const tod = new Date();
  const weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthname = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const y = tod.getFullYear();
  const m = tod.getMonth();
  const d = tod.getDate();
  const dow = tod.getDay();

  const options = {
    timeZone: 'Africa/Lagos',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  };
  const wcaTime = new Intl.DateTimeFormat('en-US', options).format(tod);

  document.querySelector('.date-display').innerHTML =
    `${weekday[dow]} ${d} ${monthname[m]} ${y},&nbsp;${wcaTime}`;
};
