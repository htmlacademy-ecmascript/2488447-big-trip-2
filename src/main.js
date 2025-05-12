import PointModel from './model/point-model.js';
import FilterModel from './model/filters-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const siteHeaderTripControls = siteHeaderElement.querySelector('.trip-controls__filters');
const tripEventsElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderTripControls, filterModel, pointModel
});

const boardPresenter = new BoardPresenter({
  container: tripEventsElement, pointModel, filterModel
});

filterPresenter.init();
boardPresenter.init();

