import moment from 'moment'

const WARNING_PERIOD = 30

export const countWarningsAndDues = reminderDates => {
  const today = moment({ hours: 0 })
  const warningsCount = reminderDates.filter(reminderDate => isWarningDate(reminderDate, today)).length
  const duesCount = reminderDates.filter(reminderDate => isPastDueDate(reminderDate, today)).length
  return { warningsCount, duesCount }
}

const isWarningDate = (isoReminderDate, today) => {
  const daysDiff = diffInDays(isoReminderDate, today)
  return daysDiff >= 0 && daysDiff <= WARNING_PERIOD
}

const isPastDueDate = (isoReminderDate, today) => {
  const daysDiff = diffInDays(isoReminderDate, today)
  return daysDiff < 0
}

const diffInDays = (isoReminderDate, today) => moment(isoReminderDate).diff(today, 'days')
