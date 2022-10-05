import moment from 'moment-timezone';

export const FILTER_IDS = {
  DATE: 'date',
  SORT: 'sort',
  TAG: 'tag',
};

export const buildFilterParam = (id: string, value: string) => {
  return `${id}=${value}`;
};

export const parseFilterParam = (param: string) => {
  if (!param) {
    return undefined;
  }
  const [id, value] = param.split('=');

  return { id, value };
};

export const getSortParam = (appliedFilters: string[]) =>
  appliedFilters.find((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.SORT) ||
  buildFilterParam(FILTER_IDS.SORT, 'LATEST');

export const getDateParam = (appliedFilters: string[]) =>
  appliedFilters.find((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.DATE);

export const getTagParams = (appliedFilters: string[]) =>
  appliedFilters.filter((aF: any) => parseFilterParam(aF)?.id === FILTER_IDS.TAG);

export const DATE_FILTERS: { [key: string]: any } = {
  TODAY: {
    value: buildFilterParam(FILTER_IDS.DATE, 'TODAY'),
    displayName: 'Today',
    filterFn: (tz: string) => ({
      gte: moment().startOf('day').tz(tz).toISOString(),
      lte: moment().endOf('day').tz(tz).toISOString(),
    }),
  },
  THIS_WEEK: {
    value: buildFilterParam(FILTER_IDS.DATE, 'THIS_WEEK'),
    displayName: 'This week',
    filterFn: (tz: string) => ({
      gte: moment().startOf('week').tz(tz).toISOString(),
      lte: moment().endOf('week').tz(tz).toISOString(),
    }),
  },
  THIS_MONTH: {
    value: buildFilterParam(FILTER_IDS.DATE, 'THIS_MONTH'),
    displayName: 'This month',
    filterFn: (tz: string) => ({
      gte: moment().startOf('month').tz(tz).toISOString(),
      lte: moment().endOf('month').tz(tz).toISOString(),
    }),
  },
  ALL_TIME: {
    value: buildFilterParam(FILTER_IDS.DATE, 'ALL_TIME'),
    displayName: 'All time',
    filterFn: (tz: string) => ({
      gte: moment(new Date('2022-01-01')).tz(tz).toISOString(),
      lte: moment().endOf('day').tz(tz).toISOString(),
    }),
  },
};
