import dayjs from 'dayjs';

export const AUTHORIZATION = 'Basic ghtr2u650yt623j455sfr';
export const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

export const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export const DATE_FORMAT = {
  dayMonth: 'DD MMM',
  monthDay: 'MMM D',
  fullDate: 'DD/MM/YY HH:mm',
  hours: 'HH:mm'
};

export const EVENT_POINTS_TYPE = [
  'taxi',
  'bus',
  'ship',
  'train',
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
  INIT: 'INIT',
  ERROR: 'ERROR'
};

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
  NEW: 'NEW',
};

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: new Date(),
  dateTo: dayjs(new Date()).add(1, 'hour').toDate(),
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

export const EndPoint = {
  POINTS: 'points',
  OFFERS: 'offers',
  DESTINATIONS: 'destinations',
};

export const RenderPosition = {
  BEFOREBEGIN: 'beforebegin',
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
  AFTEREND: 'afterend',
};
