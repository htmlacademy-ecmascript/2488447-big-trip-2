import TripInfoView from '../view/trip-info-view.js';
import FilterView from '../view/filter-view.js';
import { render, RenderPosition } from '../framework/render.js';

export default class HeaderPresenter {
  #tripMainElement = null;
  #filtersElement = null;

  constructor({ tripMainElement, filtersElement }) {
    this.#tripMainElement = tripMainElement;
    this.#filtersElement = filtersElement;
  }

  init() {
    render(new TripInfoView(), this.#tripMainElement, RenderPosition.AFTERBEGIN);
    render(new FilterView(), this.#filtersElement);
  }
}
