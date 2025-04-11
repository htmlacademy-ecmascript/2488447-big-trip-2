export default class FilterModel {
  #currentFilter = 'EVERYTHING';

  getCurrentFilter() {
    return this.#currentFilter;
  }

  setCurrentFilter(filter) {
    this.#currentFilter = filter;
  }
}
