import Observable from '../framework/observable.js';
import { UpdateType } from '../constants.js';

export default class PointModel extends Observable {
  #eventPointsApiService = null;

  #offers = [];
  #points = [];
  #destinations = [];

  constructor({eventPointsApiService}) {
    super();
    this.#eventPointsApiService = eventPointsApiService;
  }

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
  }

  async init() {
    try {
      const points = await this.#eventPointsApiService.points;
      this.#points = points.map(this.#adaptToClient);
      this.#destinations = await this.#eventPointsApiService.destinations;
      this.#offers = await this.#eventPointsApiService.offers;

      this._notify(UpdateType.INIT);
    } catch(err) {
      this.#points = [];
      this.#destinations = [];
      this.#offers = [];
      this._notify(UpdateType.ERROR);
    }
  }

  getOffersByType(type) {
    const allOffers = this.offers;
    return allOffers.find((offer) => offer.type === type);
  }

  getOffersById(type, offersId) {
    if (!type || !offersId) {
      return [];
    } else {
      const offersType = this.getOffersByType(type);
      return offersType.offers.filter((item) => offersId.find((id) => item.id === id));
    }
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.id === id);
  }

  async updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    try {
      const response = await this.#eventPointsApiService.updatePoint(updatedPoint);
      const updated = this.#adaptToClient(response);

      this.#points = [
        ...this.#points.slice(0, index),
        updated,
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, updated.id);
    } catch(err) {
      throw new Error('Can\'t update point');
    }
  }

  async addPoint(updateType, updatedPoint) {
    try {
      const response = await this.#eventPointsApiService.addPoint(updatedPoint);
      const newPoint = this.#adaptToClient(response);
      this.#points = [
        newPoint,
        ...this.#points,
      ];
      this._notify(updateType, newPoint.id);
    } catch(err) {
      throw new Error('Can\'t add point');
    }
  }

  async deletePoint(updateType, point) {
    const index = this.#points.findIndex((item) => item.id === point.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    try {
      await this.#eventPointsApiService.deletePoint(point);
      this.#points = [
        ...this.#points.slice(0, index),
        ...this.#points.slice(index + 1),
      ];
      this._notify(updateType, point.id);
    } catch(err) {
      throw new Error('Can\'t delete point');
    }
  }

  #adaptToClient(point) {
    const adaptedPoint = {...point,
      basePrice: point['base_price'],
      dateFrom: point['date_from'] !== null ? new Date(point['date_from']) : point['date_from'],
      dateTo: point['date_to'] !== null ? new Date(point['date_to']) : point['date_to'],
      isFavorite: point['is_favorite'],
    };

    delete adaptedPoint['base_price'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['is_favorite'];

    return adaptedPoint;
  }
}
