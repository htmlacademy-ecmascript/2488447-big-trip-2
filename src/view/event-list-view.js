import { createElement } from '../render.js';

function createEventListTemplate () {
  return `
  <ul class="trip-events__list"></ul>
  `;
}

export default class EventListView {
  getTemlate() {
    return createEventListTemplate();
  }

  getElement() {
    if (!this.element) {
      this.element = createElement(this.getTemlate());
    }
    return this.element;
  }

  removeElement() {
    this.element = null;
  }
}
