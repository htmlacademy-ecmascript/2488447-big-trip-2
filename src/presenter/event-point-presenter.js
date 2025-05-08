import PointView from '../view/point-view.js';
import FormEditView from '../view/form-edit-view.js';
import { remove, render, replace } from '../framework/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING'
};

export default class EventPointPresenter {
  #container = null;
  #pointModel = null;
  #eventPointComponent = null;
  #eventEditFormComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #point = null;
  #mode = Mode.DEFAULT;

  constructor({container, pointModel, onDataChange, onModeChange}) {
    this.#container = container;
    this.#pointModel = pointModel;
    this.#handleDataChange = onDataChange;
    this.#handleModeChange = onModeChange;
  }

  init(point) {
    this.#point = point;
    const prevEventPointComponent = this.#eventPointComponent;
    const prevEventEditFormComponent = this.#eventEditFormComponent;

    const escKeyDownHandler = (evt) => {
      if (evt.key === 'Escape') {
        evt.preventDefault();
        this.#eventEditFormComponent.reset(this.#point);
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    };

    this.#eventPointComponent = new PointView({
      point: point,
      offers: this.#pointModel.getOffersById(point.type, point.offers),
      destinations: this.#pointModel.getDestinationById(point.destination),
      onEditClick: () => {
        this.#replacePointToForm();
        document.addEventListener('keydown', escKeyDownHandler);
      },
      onFavoriteClick: this.#handleFavoriteClick
    });

    this.#eventEditFormComponent = new FormEditView({
      point: point,
      offers: this.#pointModel.getOffersByType(point.type),
      checkedOffers: this.#pointModel.getOffersById(point.type, point.offers),
      destination: this.#pointModel.getDestinationById(point.destination),
      destinationsAll: this.#pointModel.destinations,
      pointModel: this.#pointModel,
      onFormSubmit: (updatedPoint) => {
        this.#pointModel.updatePoint(updatedPoint);
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      },


      onEditClick: () => {
        this.#eventEditFormComponent.reset(this.#point);
        this.#replaceFormToPoint();
        document.removeEventListener('keydown', escKeyDownHandler);
      }
    });

    if (prevEventPointComponent === null || prevEventEditFormComponent === null) {
      render(this.#eventPointComponent, this.#container);
      return;
    }

    if (this.#mode === Mode.DEFAULT && prevEventPointComponent !== null && prevEventPointComponent.element) {
      replace(this.#eventPointComponent, prevEventPointComponent);
    }

    if (this.#mode === Mode.EDITING && prevEventEditFormComponent !== null && prevEventEditFormComponent.element) {
      replace(this.#eventEditFormComponent, prevEventEditFormComponent);
    }

    remove(prevEventPointComponent);
    remove(prevEventEditFormComponent);
  }

  destroy() {
    if (this.#eventEditFormComponent) {
      this.#eventEditFormComponent.reset(this.#point);
    }
    remove(this.#eventPointComponent);
    remove(this.#eventEditFormComponent);
  }


  resetView() {
    if (this.#mode !== Mode.DEFAULT) {
      this.#replaceFormToPoint();
    }
  }

  #replacePointToForm = () => {
    replace(this.#eventEditFormComponent, this.#eventPointComponent);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  };

  #replaceFormToPoint = () => {
    replace(this.#eventPointComponent, this.#eventEditFormComponent);
    this.#mode = Mode.DEFAULT;
  };

  #handleFavoriteClick = () => {
    const updatedPoint = {...this.#point, isFavorite: !this.#point.isFavorite};
    this.#handleDataChange(updatedPoint);
  };
}
