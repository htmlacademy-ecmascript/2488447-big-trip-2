import PointModel from './model/point-model.js';
import FilterModel from './model/filters-model.js';
import BoardPresenter from './presenter/board-presenter.js';

const siteHeaderElement = document.querySelector('.page-header');
const tripMainElement = siteHeaderElement.querySelector('.trip-main');
const siteMainElement = document.querySelector('.trip-events');

const pointModel = new PointModel();
const filterModel = new FilterModel();


const boardPresenter = new BoardPresenter({
  container: siteMainElement, pointModel, filterModel, tripMainElement
});

boardPresenter.init();

