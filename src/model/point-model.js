import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { eventPoints } from '../mocks/points.js';

export default class PointModel {
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
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => offersId.find((id) => item.id === id));
  }

  getDestinationById(id) {
    const allDestinations = this.destinations;
    return allDestinations.find((destination) => destination.id === id);
  }

  updatePoint(points, update) {
    return points.map((point) => point.id === update.id ? update : point);
  }
}
