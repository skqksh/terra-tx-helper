import moment, { Moment } from 'moment'

const Mimute = 60
const Hour = Mimute * 60
const Day = Hour * 24
const Week = Day * 7

const REFERENCE = moment()
const TODAY = REFERENCE.clone().startOf('day')
const YESTERDAY = REFERENCE.clone().subtract(1, 'days').startOf('day')
const A_WEEK_OLD = REFERENCE.clone().subtract(7, 'days').startOf('day')
const THIS_YEAR = REFERENCE.clone().startOf('year')

const isToday = (momentDate: Moment): boolean => {
  return momentDate.isSame(TODAY, 'd')
}
const isYesterday = (momentDate: Moment): boolean => {
  return momentDate.isSame(YESTERDAY, 'd')
}
const isWithinAWeek = (momentDate: Moment): boolean => {
  return momentDate.isAfter(A_WEEK_OLD)
}
const isTwoWeeksOrMore = (momentDate: Moment): boolean => {
  return !isWithinAWeek(momentDate)
}
const isThisYear = (momentDate: Moment): boolean => {
  return momentDate.isAfter(THIS_YEAR)
}
const isLastYearOrMore = (momentDate: Moment): boolean => {
  return !isThisYear(momentDate)
}

const displayTimeFormat = (momentDate: Moment): string => {
  if (isToday(momentDate)) {
    return momentDate.format('HH:mm')
  } else if (isThisYear(momentDate)) {
    return momentDate.format('MM.DD')
  }
  return momentDate.format('YYYY-MM-DD')
}

export default {
  Mimute,
  Hour,
  Day,
  Week,
  REFERENCE,
  TODAY,
  YESTERDAY,
  A_WEEK_OLD,
  THIS_YEAR,
  isToday,
  isYesterday,
  isWithinAWeek,
  isTwoWeeksOrMore,
  isThisYear,
  isLastYearOrMore,
  displayTimeFormat,
}
