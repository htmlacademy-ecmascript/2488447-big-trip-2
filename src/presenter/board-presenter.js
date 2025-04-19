import FilterView from '../view/filter-view.js';
import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import TripInfoView from '../view/trip-info-view.js';
import NoEventPointsView from '../view/no-event-points-view.js';
import { render, RenderPosition } from '../framework/render.js';
import { filterEventPoints } from '../utils.js';
import EventPointPresenter from './event-point-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const tripControlsElement = tripMainElement.querySelector('.trip-controls');
const filtersContainer = tripControlsElement.querySelector('.trip-controls__filters');

export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;

  #sortComponent = new SortView();
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
    this.#renderSort();
    this.#renderFilter();
    this.#renderEventsList();
    this.#renderBoard();
    this.#renderNoEvents();
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

  #renderSort() {
    render(this.#sortComponent, this.#container);
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

  #renderNoEvents() {
    if(this.#eventPoints.length === 0) {
      render(new NoEventPointsView(this.#filterModel), this.#container);
    }
  }

  #renderBoard() {
    for (let i = 0; i < this.#eventPoints.length; i++) {
      this.#renderEventPoint(this.#eventPoints[i]);
    }
  }
}
