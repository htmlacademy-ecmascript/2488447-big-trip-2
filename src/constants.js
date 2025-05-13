import { nanoid } from 'nanoid';

export const EVENT_POINTS_COUNT = 10;

export const DATE_FORMAT = {
  monthDay: 'MMM D',
  fullDate: 'DD/MM/YY HH:mm',
  hours: 'hh:mm'
};

export const EVENT_POINTS_TYPE = [
  'taxi',
  'bus',
  'train',
  'ship',
  'drive',
  'flight',
  'check-in',
  'sightseeing',
  'restaurant'
];

export const FilterType = {
  EVERYTHING: 'everything',
  PAST: 'past',
  PRESENT: 'present',
  FUTURE: 'future'
};

export const SortType = {
  DAY: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const NoEventsMessage = {
  [FilterType.EVERYTHING]: 'Click New Event to create your first point',
  [FilterType.PAST]: 'There are no past events now',
  [FilterType.PRESENT]: 'There are no present events now',
  [FilterType.FUTURE]: 'There are no future events now'
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  NEW: 'NEW',
};

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: new Date(),
  destination: '1',
  isFavorite: false,
  offers: [],
  type: 'taxi',
  id: nanoid(),
};
