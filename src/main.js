import FilterView from './view/filter-view.js';
import PointModel from './model/point-model.js';
import { render } from './render.js';
import BoardPresenter from './presenter/board-presenter.js';


const filtersElement = document.querySelector('.trip-main__trip-controls');
const siteMainElement = document.querySelector('.trip-events');

render(new FilterView(), filtersElement);

const pointModel = new PointModel();
const boardPresenter = new BoardPresenter({
  container: siteMainElement, pointModel
});

boardPresenter.init();

