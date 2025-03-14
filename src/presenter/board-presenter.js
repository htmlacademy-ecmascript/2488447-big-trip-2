import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import FormCreationView from '../view/form-creation-view.js';
import { render } from '../render.js';

export default class BoardPresenter {
  sortComponent = new SortView();
  eventListComponent = new EventListView();

  constructor ({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);
    render(new FormEditView(), this.eventListComponent.getElement());
    render(new FormCreationView(), this.eventListComponent.getElement());

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }
}
