import SortView from '../view/sort-view.js';
import EventListView from '../view/event-list-view.js';
import FormEditView from '../view/form-edit-view.js';
import PointView from '../view/point-view.js';
import FormCreationView from '../view/form-creation-view.js';
import NewEventButtonView from '../view/new-event-button-view.js';
import {render, replace, RenderPosition} from '../framework/render.js';


export default class BoardPresenter {
  #container = null;
  #pointModel = null;
  #tripMainElement = null;

  #sortComponent = new SortView();
  #eventListComponent = new EventListView();
  #eventCreateComponent = new FormCreationView();

  #eventPoints = [];
  constructor({container, pointModel, tripMainElement}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#tripMainElement = tripMainElement;

  }

  init() {
    this.#eventPoints = [...this.#pointModel.points];
    render(this.#sortComponent, this.#container);
    render(this.#eventListComponent, this.#container);
    this.#renderNewEventButton();

    for (let i = 1; i < this.#eventPoints.length; i++) {
      this.#renderEventPoint(
        this.#eventPoints[i],
        this.#pointModel.getOffersByType(this.#eventPoints[i].type),
        this.#pointModel.getOffersById(this.#eventPoints[i].type, this.#eventPoints[i].offers),
        this.#pointModel.getDestinationById(this.#eventPoints[i].destination)
      );
    }
  }

  // Метод для рендеринга кнопки New Event
  #renderNewEventButton() {
    const newEventButtonComponent = new NewEventButtonView({
      onClick: () => {
        this.createNewEvent();
      }
    });
    render(newEventButtonComponent, this.#tripMainElement, RenderPosition.BEFOREEND);
  }

  #renderEventPoint(point) {
    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };
    const eventPointComponent = new PointView({
      point: point,
      offers: this.#pointModel.getOffersById(point.type, point.offers),
      destinations: this.#pointModel.getDestinationById(point.destination),
      onEditClick: () => {
        replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      }
    });
    const eventEditFormComponent = new FormEditView({
      point: point,
      offers: this.#pointModel.getOffersByType(point.type),
      checkedOffers: this.#pointModel.getOffersById(point.type, point.offers),
      destinations: this.#pointModel.getDestinationById(point.destination),
      onFormSubmit: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },
      onEditClick: () => {
        replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    function replacePointToForm() {
      replace(eventEditFormComponent, eventPointComponent);
    }

    function replaceFormToPoint() {
      replace(eventPointComponent, eventEditFormComponent);
    }

    render(eventPointComponent, this.#eventListComponent.element);
  }

  createNewEvent() {
    render(this.#eventCreateComponent, this.#eventListComponent.element, RenderPosition.AFTERBEGIN);
  }
}
