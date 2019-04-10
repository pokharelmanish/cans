import React from 'react'
import PropTypes from 'prop-types'
import { headerRecord } from './PrintAssessmentStyle'

export const PrintSummaryRecord = ({ title, items }) => {
  return (
    <div style={headerRecord}>
      <strong id="title">{title}</strong> <br />{' '}
      {items &&
        items.map(val => (
          <div id="item" key={val}>
            {val}
          </div>
        ))}
    </div>
  )
}

PrintSummaryRecord.propTypes = {
  items: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
}

export default PrintSummaryRecord
