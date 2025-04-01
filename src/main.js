import FilterView from './view/filter-view.js';
import TripInfoView from './view/trip-info-view.js';
import PointModel from './model/point-model.js';
import { render, RenderPosition } from './framework/render.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.trip-events');

// Отрисовка информации о поездке
render(new TripInfoView(), tripMainElement, RenderPosition.AFTERBEGIN);

render(new FilterView(), filtersElement);

const pointModel = new PointModel();
const boardPresenter = new BoardPresenter({
  container: siteMainElement, pointModel, tripMainElement
});

boardPresenter.init();

