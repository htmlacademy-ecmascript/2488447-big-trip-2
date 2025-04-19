import PointModel from './model/point-model.js';
import FilterModel from './model/filters-model.js';
import BoardPresenter from './presenter/board-presenter.js';

const tripEventsElement = document.querySelector('.trip-events');
const pointModel = new PointModel();
const filterModel = new FilterModel();
const boardPresenter = new BoardPresenter({
  container: tripEventsElement, pointModel, filterModel
});

boardPresenter.init();

