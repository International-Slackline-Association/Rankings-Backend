import * as moment from 'moment';

export function unixToDate(unix: number): moment.Moment {
  return moment.unix(unix);
}
