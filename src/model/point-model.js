import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { eventPoints } from '../mocks/points.js';
import Observable from '../framework/observable.js';

export default class PointModel extends Observable {
  #points = eventPoints;
  #offers = offers;
  #destinations = destinations;

  get points() {
    return this.#points;
  }

  get offers() {
    return this.#offers;
  }

  get destinations() {
    return this.#destinations;
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

  updatePoint(updateType, updatedPoint) {
    const index = this.#points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this.#points = [
      ...this.#points.slice(0, index),
      updatedPoint,
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, updatedPoint.id);
  }

  addPoint(updateType, newPoint) {
    this.#points = [
      newPoint,
      ...this.#points,
    ];
    this._notify(updateType, newPoint.id);
  }

  deletePoint(updateType, point) {
    const index = this.#points.findIndex((item) => item.id === point.id);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }
    this.#points = [
      ...this.#points.slice(0, index),
      ...this.#points.slice(index + 1),
    ];
    this._notify(updateType, point.id);
  }
}
