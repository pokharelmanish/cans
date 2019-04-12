import React from 'react'
import PropTypes from 'prop-types'
import { Badge } from '@cwds/components'
import { isoToLocalDate } from '../../util/dateHelper'
import { today, isWarningDate, diffInDays, WARNING_PERIOD } from '../Staff/ReassessmentsDueCalculator'

const dueText = days => {
  let dueText = ''
  if (days === 0) dueText = 'Due Today'
  else if (days === 1) dueText = 'Due in 1 day'
  else if (days < 0) dueText = 'Past Due'
  else dueText = `Due in ${days} days`
  return dueText
}

const badgeColor = reminderDate => {
  const todaysDate = today()
  if (isWarningDate(reminderDate, todaysDate)) return 'warning'
  return 'danger'
}

export const ReminderDateCell = ({ original: { reminder_date: reminderDate } }) => {
  if (!reminderDate) return null
  const todaysDate = today()
  const date = isoToLocalDate(reminderDate)
  const days = diffInDays(reminderDate, todaysDate)
  return (
    <div>
      <span>{date}&nbsp;</span>
      {days <= WARNING_PERIOD && (
        <Badge color={badgeColor(reminderDate)} pill>
          {dueText(days)}
        </Badge>
      )}
    </div>
  )
}

ReminderDateCell.propTypes = {
  original: PropTypes.shape({
    reminder_date: PropTypes.string,
  }),
}

ReminderDateCell.defaultProps = {
  original: {
    reminder_date: null,
  },
}
