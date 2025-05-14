import PointModel from './model/point-model.js';
import FiltersModel from './model/filters-model.js';
import { AUTHORIZATION, END_POINT } from './constants.js';
import BoardPresenter from './presenter/board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import EventPointsApiService from './event-points-api-service.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripEventsElement = document.querySelector('.trip-events');
const siteHeaderTripControls = siteHeaderElement.querySelector('.trip-controls__filters');

const pointModel = new PointModel({
  eventPointsApiService: new EventPointsApiService(END_POINT, AUTHORIZATION),
});
const filterModel = new FiltersModel();

const filterPresenter = new FilterPresenter({
  filterContainer: siteHeaderTripControls, filterModel, pointModel
});

const boardPresenter = new BoardPresenter({
  container: tripEventsElement, pointModel, filterModel
});

filterPresenter.init();
boardPresenter.init();
pointModel.init();

