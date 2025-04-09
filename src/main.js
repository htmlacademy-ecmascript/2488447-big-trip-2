import PointModel from './model/point-model.js';
import BoardPresenter from './presenter/board-presenter.js';
import HeaderPresenter from './presenter/header-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const filtersElement = document.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.trip-events');

const pointModel = new PointModel();

const headerPresenter = new HeaderPresenter({
  tripMainElement,
  filtersElement
});
headerPresenter.init();

const boardPresenter = new BoardPresenter({
  container: siteMainElement, pointModel, tripMainElement
});

boardPresenter.init();

