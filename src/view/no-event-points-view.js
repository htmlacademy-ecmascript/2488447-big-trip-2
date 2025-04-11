import AbstractView from '../framework/view/abstract-view.js';
import { NoEventsMessage } from '../constants.js';
import { FilterType } from '../constants.js';

function createNoEventPointsTemplate(currentFilter) {
  const filterKey = FilterType[currentFilter];
  const noEventsTextValue = NoEventsMessage[filterKey];
  return (
    `<p class="trip-events__msg">${noEventsTextValue}</p>`
  );
}

export default class NoEventPointsView extends AbstractView {
  #filter = null;

  constructor(filterModel) {
    super();
    this.#filter = filterModel.getCurrentFilter();
  }

  get template() {
    return createNoEventPointsTemplate(this.#filter);
  }
}
