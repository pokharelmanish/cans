import moment from 'moment'

export const WARNING_PERIOD = 30

export const countDueDates = (reminderDates, today) =>
  reminderDates.filter(reminderDate => isWarningDate(reminderDate, today)).length

export const countPastDueDates = (reminderDates, today) =>
  reminderDates.filter(reminderDate => isPastDueDate(reminderDate, today)).length

export const isWarningDate = (isoReminderDate, todaysDate) => {
  const daysDiff = diffInDays(isoReminderDate, todaysDate)
  return daysDiff >= 0 && daysDiff <= WARNING_PERIOD
}

export const isPastDueDate = (isoReminderDate, todaysDate) => {
  const daysDiff = diffInDays(isoReminderDate, todaysDate)
  return daysDiff < 0
}

export const diffInDays = (isoReminderDate, todaysDate) => moment(isoReminderDate).diff(todaysDate, 'days')
