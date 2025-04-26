import FilterView from '../view/filter-view.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventPointsView from '../view/no-event-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { filterEventPoints } from '../utils.js';
import { sortByDate, sortByTime, sortByPrice } from '../utils.js';
import EventPointPresenter from './event-point-presenter.js';
import { SortType } from '../constants.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const filtersContainer = tripControlsElement.querySelector('.trip-controls__filters');

export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;
  #sortComponent = null;

  #currentSortType = SortType.DAY;
  #tripInfoComponent = new TripInfoView();
  #eventListComponent = new EventListView();
  #eventPointsPresenters = new Map();
  #eventPoints = [];
  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#filterModel = filterModel;
  }

  init() {
    this.#eventPoints = [...this.#pointModel.points];
    this.#renderTripInfo();
    this.#renderFilter();
    this.#renderSort();
    this.#renderBoard();
  }

  #renderEventPoint(point) {
    const eventPointPresenter = new EventPointPresenter({
      container: this.#eventListComponent.element,
      pointModel: this.#pointModel,
      filterModel: this.#filterModel,
      onDataChange: this.#handleEventPointChange,
      onModeChange: this.#handleModeChange
    });

    eventPointPresenter.init(point);
    this.#eventPointsPresenters.set(point.id, eventPointPresenter);
  }

  #renderTripInfo() {
    render(this.#tripInfoComponent, tripMainElement, RenderPosition.AFTERBEGIN);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#currentSortType = sortType;
    this.#sortPoints(sortType);
    this.#clearEventPointsList();
    this.#renderBoard();
    this.#sortComponent.element.remove();
    this.#renderSort();
  };

  #sortPoints(sortType) {

    switch(sortType) {
      case SortType.DAY:
        this.#eventPoints.sort(sortByDate);
        break;
      case SortType.PRICE:
        this.#eventPoints.sort(sortByPrice);
        break;
      case SortType.TIME:
        this.#eventPoints.sort(sortByTime);
        break;
    }

    this.#currentSortType = sortType;
  }

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#eventPointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleEventPointChange = (updatedPoint) => {
    this.#eventPoints = this.#pointModel.updatePoint(this.#eventPoints, updatedPoint);
    this.#eventPointsPresenters.get(updatedPoint.id).init(updatedPoint);
  };

  #renderFilter() {
    const filters = filterEventPoints(this.#pointModel.points);
    render(new FilterView(filters, this.#filterModel), filtersContainer);
  }

  #renderEventsList() {
    render(this.#eventListComponent, this.#container);
  }

  #clearEventPointsList() {
    this.#eventPointsPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointsPresenters.clear();
  }

  #renderBoard() {
    if (this.#eventPoints.length === 0) {
      render(new NoEventPointsView(this.#filterModel), this.#container);
    } else {
      this.#renderEventsList();
      for (const point of this.#eventPoints) {
        this.#renderEventPoint(point);
      }
    }
  }
}
