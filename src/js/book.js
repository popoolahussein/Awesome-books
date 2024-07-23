import { v4 as uuidv4 } from 'uuid';

export default class Book {
  constructor(title, author, id = uuidv4()) {
    this.title = title;
    this.author = author;
    this.id = id;
  }

  getTitle() {
    return this.title;
  }

  getAuthor() {
    return this.author;
  }
}
