import dayjs from 'dayjs';
import { NoEventsMessage } from './constants.js';
import { FilterType } from './constants.js';

export function getEventDuration(event) {
  return dayjs(event.dateTo).diff(dayjs(event.dateFrom));
}

export function humanizeEventDate(date, format) {
  return (date) ? dayjs(date).format(format) : '';
}

export function getTimeGap(dateFrom, dateTo) {
  const durationInMinutes = dayjs(dateTo).diff(dateFrom, 'minute');

  if (durationInMinutes < 60) {
    return `${durationInMinutes}M`;
  }

  const durationInHours = dayjs(dateTo).diff(dateFrom, 'hour');

  if (durationInHours < 24) {
    const durationMinutes = durationInMinutes % 60;
    return `${durationInHours}H ${durationMinutes}M`;
  }

  const durationInDays = dayjs(dateTo).diff(dateFrom, 'day');
  const hours = durationInHours % 24;
  const minutes = durationInMinutes % 60;

  return `${durationInDays}D ${hours}H ${minutes}M`;
}

export function createUpperCase(word) {
  return (`${word[0].toUpperCase()}${word.slice(1)}`);
}

export function filterEventPoints (points) {
  const now = dayjs();
  const filteredPoints = {
    EVERYTHING: points,
    FUTURE: points.filter((point) => dayjs(point.dateFrom).isAfter(now)),
    PRESENT: points.filter((point) => dayjs(point.dateFrom).isBefore(now) && dayjs(point.dateTo).isAfter(now)),
    PAST: points.filter((point) => dayjs(point.dateTo).isBefore(now))
  };

  const result = Object.entries(filteredPoints).map(
    ([type]) => {
      const count = filteredPoints[type].length;
      return {
        type: FilterType[type],
        count: count,
        placeholder: count === 0 ? NoEventsMessage[FilterType[type]] : null,
        points: filteredPoints[type],
      };
    });
  return result;
}

export function sortByDate(eventA, eventB) {
  return dayjs(eventA.dateFrom).diff(dayjs(eventB.dateFrom));
}

export function sortByTime(eventA, eventB) {
  const eventADuration = getEventDuration(eventA);
  const eventBDuration = getEventDuration(eventB);

  return eventBDuration - eventADuration;
}

export function sortByPrice(eventB, eventA) {
  return eventA.basePrice - eventB.basePrice;
}

export function isDateEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}
