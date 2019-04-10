import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatClientName } from '../../Client'
import PrintChangeLogTable from './PrintChangeLogTable'
import { clientPropTypes } from './ChangeLogHelper'
import { trimSafely } from '../../../util/formatters'
import { isoToLocalDate } from '../../../util/dateHelper'

class PrintChangeLog extends Component {
  renderHeader(client, assessmentId, history) {
    const formattedClientName = `Client: ${formatClientName(client)}`
    const assessmentDate = this.props.history[0].event_date
    const formattedDate = assessmentDate ? isoToLocalDate(assessmentDate) : ''
    const titleAssessmentDate = trimSafely(`Assessment Date: ${formattedDate}`)
    return (
      <div className="print-header">
        <h2 className="print-title">{'CANS Assessment Change Log'}</h2>
        <h3 className="print-client-name">{formattedClientName}</h3>
        <table>
          <tr>
            <th
              className="print-assessment-id"
              style={{ width: '25rem', textAlign: 'left', fontSize: '1.2rem' }}
            >{`Assessment ID: ${assessmentId}`}</th>
            <th className="print-assessment-date" style={{ width: '25rem', textAlign: 'right', fontSize: '1.2rem' }}>
              {titleAssessmentDate}
            </th>
          </tr>
        </table>
        <br />
      </div>
    )
  }

  render() {
    const { history, client, assessmentId } = this.props

    return history && history.length > 0 ? (
      <div className="print-change-log-table-wrapper">
        {this.renderHeader(client, assessmentId)}
        {<PrintChangeLogTable history={history} />}
      </div>
    ) : null
  }
}

PrintChangeLog.propTypes = {
  assessmentId: PropTypes.number,
  client: clientPropTypes.isRequired,
  history: PropTypes.array,
}

PrintChangeLog.defaultProps = {
  assessmentId: 0,
  history: [],
}

export default PrintChangeLog
