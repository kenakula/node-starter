const HOURS_IN_DAY = 24;
const MINUTES_IN_DAY = 60;
const SECONDS_IN_DAY = 60;
const MS_IN_SECOND = 1000;

export class DateUtils {
  public static daysToMs(days: number): number {
    return days * HOURS_IN_DAY * MINUTES_IN_DAY * SECONDS_IN_DAY * MS_IN_SECOND;
  }
}
