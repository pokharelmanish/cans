import React from 'react'
import PropTypes from 'prop-types'
import { summaryInnerContainer, summaryTitle, summaryContent } from './PrintAssessmentStyle'

export const PrintSummaryRecord = ({ title, items }) => {
  return (
    <div style={summaryInnerContainer}>
      <div id="summary-header" style={summaryTitle}>
        {title}
      </div>
      <ul style={summaryContent}>
        {items &&
          items.map(val => (
            <li id="item" key={val}>
              {val}
            </li>
          ))}
      </ul>
    </div>
  )
}

PrintSummaryRecord.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default PrintSummaryRecord
