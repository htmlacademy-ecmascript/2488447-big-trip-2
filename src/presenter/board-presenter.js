import EventListView from '../view/event-list-view.js';
import SortView from '../view/sort-view.js';
import LoadingView from '../view/loading-view.js';
import NoEventPointsView from '../view/no-event-points-view.js';
import ErrorLoadView from '../view/error-load-view.js';
import TripInfoPresenter from '../presenter/trip-info-presenter.js';
import EventPointPresenter from './event-point-presenter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import { filterEventPoints, sortByDate, sortByTime, sortByPrice } from '../utils.js';
import { SortType, UpdateType, UserAction, FilterType, TimeLimit } from '../constants.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #filterModel = null;
  #sortComponent = null;
  #errorComponent = null;
  #tripInfoPresenter = null;
  #noEventPointsComponent = null;
  #newEventButtonComponent = null;

  #loadingComponent = new LoadingView();
  #eventListComponent = new EventListView();

  #isLoading = true;
  #isCreatingNewPoint = false;
  #currentSortType = SortType.DAY;
  #eventPointsPresenters = new Map();
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, pointModel, filterModel}) {
    this.#container = container;
    this.#filterModel = filterModel;
    this.#pointModel = pointModel;

    this.#tripInfoPresenter = new TripInfoPresenter({
      container: document.querySelector('.trip-main'),
      pointModel: this.#pointModel
    });

    this.#pointModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    const currentFilter = this.#filterModel.filter;
    const filteredFilters = filterEventPoints(this.#pointModel.points);
    const currentFilterPoints = filteredFilters.find((filter) => filter.type === currentFilter);
    const filteredPoints = currentFilterPoints ? currentFilterPoints.points : [];

    switch(this.#currentSortType) {
      case SortType.DAY:
        return [...filteredPoints].sort(sortByDate);
      case SortType.PRICE:
        return [...filteredPoints].sort(sortByPrice);
      case SortType.TIME:
        return [...filteredPoints].sort(sortByTime);
    }
    return filteredPoints;
  }

  init() {
    this.#renderBoard();
    this.#attachNewEventButton();
  }

  #renderEventPoint(point) {
    const eventPointPresenter = new EventPointPresenter({
      container: this.#eventListComponent.element,
      pointModel: this.#pointModel,
      filterModel: this.#filterModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
    });

    eventPointPresenter.init(point);
    this.#eventPointsPresenters.set(point.id, eventPointPresenter);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#eventPointsPresenters.forEach((presenter) => presenter.resetView());

    this.#currentSortType = sortType;
    this.#clearEventPointsList();
    this.#sortComponent.element.remove();
    this.#renderSort();
    this.#renderBoard();
  };

  #renderSort() {
    this.#sortComponent = new SortView({
      currentSortType: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });

    render(this.#sortComponent, this.#container, RenderPosition.AFTERBEGIN);
  }

  #clearBoard({resetSortType = false} = {}) {
    this.#eventPointsPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointsPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#noEventPointsComponent);
    remove(this.#eventListComponent);
    remove(this.#loadingComponent);

    if (resetSortType) {
      this.#currentSortType = SortType.DAY;
    }
  }

  #handleModeChange = () => {
    this.#eventPointsPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, updatedPoint) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#eventPointsPresenters.get(updatedPoint.id).setSaving();
        this.#toggleNewEventButton(false);
        try {
          await this.#pointModel.updatePoint(updateType, updatedPoint);
        } catch (err) {
          this.#eventPointsPresenters.get(updatedPoint.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#eventPointsPresenters.forEach((presenter) => presenter.setSaving());
        try {
          await this.#pointModel.addPoint(updateType, updatedPoint);
          this.#toggleNewEventButton(false);
        } catch (err) {
          this.#eventPointsPresenters.forEach((presenter) => presenter.setAborting());
        } finally {
          this.#isCreatingNewPoint = false;
        }
        break;
      case UserAction.DELETE_POINT:
        this.#eventPointsPresenters.get(updatedPoint.id).setDeleting();
        try {
          await this.#pointModel.deletePoint(updateType, updatedPoint);
        } catch (err) {
          this.#eventPointsPresenters.get(updatedPoint.id).setAborting();
        }
        this.#isCreatingNewPoint = false;
        break;
    }
    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
    switch (updateType) {
      case UpdateType.ERROR:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#errorComponent = new ErrorLoadView();
        render(this.#errorComponent, this.#container);
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#tripInfoPresenter.init(this.#pointModel.points);
        this.#renderSort();
        this.#renderBoard();
        this.#toggleNewEventButton(false);
        break;
      case UpdateType.PATCH:
        if (this.#eventPointsPresenters.has(data.id)) {
          this.#eventPointsPresenters.get(data.id).init(data);
        } else {
          this.#clearEventPointsList();
          this.#renderBoard();
        }
        break;
      case UpdateType.MINOR:
        this.#clearEventPointsList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        if (this.#isCreatingNewPoint) {
          this.#handleModeChange();
        }

        this.#clearBoard({resetSortType: true});
        this.#renderSort();
        this.#renderBoard();
        break;
    }
  };

  #clearEventPointsList() {
    this.#eventPointsPresenters.forEach((presenter) => presenter.destroy());
    this.#eventPointsPresenters.clear();
  }

  #renderNoEvents() {
    this.#noEventPointsComponent = new NoEventPointsView(this.#filterModel);
    render(this.#noEventPointsComponent, this.#container);
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#container);
  }

  #renderBoard() {
    if (this.#isLoading) {
      this.#renderLoading();
      return;
    }

    if (this.#noEventPointsComponent) {
      remove(this.#noEventPointsComponent);
      this.#noEventPointsComponent = null;
    }

    if (this.points.length === 0 && !this.#isCreatingNewPoint) {
      this.#renderNoEvents();
      return;
    }

    render(this.#eventListComponent, this.#container);

    for (let i = 0; i < this.points.length; i++) {
      this.#renderEventPoint(this.points[i]);
    }
  }

  #attachNewEventButton() {
    this.#newEventButtonComponent = document.querySelector('.trip-main__event-add-btn');
    this.#toggleNewEventButton(true);
    this.#newEventButtonComponent.addEventListener('click', this.#handleNewEventButtonClick);
  }

  #handleNewEventButtonClick = () => {
    this.#toggleNewEventButton(true);
    this.#isCreatingNewPoint = true;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#handleModeChange();
    this.#currentSortType = SortType.DAY;
    this.#clearBoard({resetSortType: true});
    this.#renderSort();
    render(this.#eventListComponent, this.#container);
    this.#renderBoard();

    const eventPointPresenter = new EventPointPresenter({
      container: this.#eventListComponent.element,
      pointModel: this.#pointModel,
      filterModel: this.#filterModel,
      onDataChange: this.#handleViewAction,
      onModeChange: this.#handleModeChange,
      onToggleButton: () => {
        this.#isCreatingNewPoint = false;
        this.#toggleNewEventButton(false);
        this.#clearEventPointsList();
        this.#renderBoard();
      }
    });

    const newPoint = eventPointPresenter.createPoint();
    this.#eventPointsPresenters.set(newPoint, eventPointPresenter);
  };

  #toggleNewEventButton(isDisabled) {
    if (this.#newEventButtonComponent) {
      this.#newEventButtonComponent.disabled = isDisabled;
    }
  }
}
