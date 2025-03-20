import { EVENT_POINTS_COUNT } from '../constants.js';
import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { getRandomPoint } from '../mocks/points.js';

export default class PointModel {
  points = Array.from({length: EVENT_POINTS_COUNT}, getRandomPoint);
  offers = offers;
  destinations = destinations;

  getPoints() {
    return this.points;
  }

  getOffers() {
    return this.offers;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffersByType(type) {
    const allOffers = this.getOffers();
    return allOffers.find((offer) => offer.type === type); //ищет первое предложение в массиве, соответствующее нужному типу.
  }

  getOffersById(type, offersId) {
    const offersType = this.getOffersByType(type);
    return offersType.offers.filter((item) => offersId.find((id) => item.id === id)); //фильтрует предложения, оставляя только те, чьи идентификаторы совпадают с переданными
  }

  getDestinationById(id) {
    const allDestinations = this.getDestinations();
    return allDestinations.find((destination) => destination.id === id); //Принимает айди направления и ищет его в массиве направлений. Возвращает первое совпадение.
  }
}
