import AbstractView from '../framework/view/abstract-view.js';

function createFilterTemplate(filter, currentFilterType) {
  const {type, count} = filter;

  return (
    ` <div class="trip-filters__filter">
      <input
        id="filter-${type}"
        class="trip-filters__filter-input  visually-hidden"
        type="radio"
        name="trip-filter"
        value="${type}"
        ${type === currentFilterType ? 'checked' : ''}
        ${count === 0 ? 'disabled' : ''}>
      <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFiltersTemplate(filters, currentFilterType) {
  const filtersTemplate = filters
    .map((filter) => createFilterTemplate(filter, currentFilterType))
    .join('');

  return(
    `<form class="trip-filters" action="#" method="get">

      ${filtersTemplate}

    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #filterModel = null;
  #currentFilterType = null;

  constructor(filters, filterModel) {
    super();
    this.#filters = filters;
    this.#filterModel = filterModel;
    this.#currentFilterType = filterModel.getCurrentFilter();
    this.#setInnerHandlers();
  }

  get template() {
    return createFiltersTemplate(this.#filters, this.#currentFilterType);
  }

  #setInnerHandlers() {
    this.element.querySelectorAll('.trip-filters__filter-input')
      .forEach((filterInput) => {
        filterInput.addEventListener('click', this.#filterClickHandler);
      });
  }

  #filterClickHandler = (evt) => {
    evt.preventDefault();
    this.#filterModel.setCurrentFilter(evt.target.value);

  };
}
