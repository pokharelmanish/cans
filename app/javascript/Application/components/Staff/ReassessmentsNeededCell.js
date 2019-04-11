import React from 'react'
import PropTypes from 'prop-types'
import './style.sass'
import ReassessmentsNeededCellBadge from './ReassessmentsNeededCellBadge'
import { countWarningsAndDues } from './ReassessmentsDueCalculator'

const ReassessmentsNeededCell = ({ value: reminderDates }) => {
  const warningsAndDues = countWarningsAndDues(reminderDates)
  return (
    <div className="reassess-needed-cell">
      <ReassessmentsNeededCellBadge color="warning" number={warningsAndDues.warningsCount} />
      <ReassessmentsNeededCellBadge color="danger" number={warningsAndDues.duesCount} />
    </div>
  )
}

ReassessmentsNeededCell.propTypes = {
  value: PropTypes.array,
}

ReassessmentsNeededCell.defaultProps = {
  value: [],
}

export default ReassessmentsNeededCell
