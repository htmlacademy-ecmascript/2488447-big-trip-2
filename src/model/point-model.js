import { EVENT_POINTS_COUNT } from '../constants.js';
import { destinations } from '../mocks/destinations.js';
import { offers } from '../mocks/offers.js';
import { getRandomPoint } from '../mocks/points.js';

export default class PointModel {
  #points = Array.from({length: EVENT_POINTS_COUNT}, getRandomPoint);
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
    return this.#offers.find((offer) => offer.type === type) || { type, offers: [] }; //ищет первое предложение в массиве, соответствующее нужному типу.
  }

  getOffersById(type, offersId = []) {
    const offersType = this.getOffersByType(type);
    if (!offersType || !offersType.offers || offersId.length === 0) {
      return [];
    }
    return offersType.offers.filter((item) => offersId.includes(item.id)); //фильтрует предложения, оставляя только те, чьи идентификаторы совпадают с переданными
  }

  getDestinationById(id) {
    return this.#destinations.find((destination) => destination.id === id) || null; //Принимает айди направления и ищет его в массиве направлений. Возвращает первое совпадение.
  }
}
