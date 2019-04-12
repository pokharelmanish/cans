import moment from 'moment'

export const WARNING_PERIOD = 30

export const today = () => moment({ hours: 0 })

export const countWarningsAndDues = reminderDates => {
  const todaysDate = today()
  const warningsCount = reminderDates.filter(reminderDate => isWarningDate(reminderDate, todaysDate)).length
  const duesCount = reminderDates.filter(reminderDate => isPastDueDate(reminderDate, todaysDate)).length
  return { warningsCount, duesCount }
}

export const isWarningDate = (isoReminderDate, todaysDate) => {
  const daysDiff = diffInDays(isoReminderDate, todaysDate)
  return daysDiff >= 0 && daysDiff <= WARNING_PERIOD
}

export const isPastDueDate = (isoReminderDate, todaysDate) => {
  const daysDiff = diffInDays(isoReminderDate, todaysDate)
  return daysDiff < 0
}

export const diffInDays = (isoReminderDate, todaysDate) => moment(isoReminderDate).diff(todaysDate, 'days')
