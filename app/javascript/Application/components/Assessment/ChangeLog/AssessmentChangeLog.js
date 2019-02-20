import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardHeader, CardTitle } from '@cwds/components'
import ChangeLogDate from './ChangeLogDate'
import ChangeLogStatus from './ChangeLogStatus'
import ChangeLogName from './ChangeLogName'
import ChangeLogComment from './ChangeLogComment'
import PrintChangeLog from './PrintChangeLog'
import { formatClientName } from '../../Client'
import { assessmentHistoryPropTypes, clientPropTypes } from './ChangeLogHelper'
import { trimSafely } from '../../../util/formatters'
import { isoToLocalDate } from '../../../util/dateHelper'
import { buildSearchClientsButton } from '../../Header/PageHeaderButtonsBuilder'
import PrintButton from '../../Header/PageHeaderButtons/PrintButton'
import { ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY } from '../../../util/sessionStorageUtil'
import { PAGE_SIZES } from '../../../util/DataGridHelper'
import SessionDataGrid from '../../common/SessionDataGrid'
import './style.sass'

const columnConfig = [
  {
    Header: 'Date / Time Updated',
    accessor: 'changed_at',
    Cell: ChangeLogDate,
  },
  {
    Header: 'Updated By',
    accessor: 'user_id',
    Cell: ChangeLogName,
  },
  {
    Header: 'Change',
    accessor: 'assessment_change_type',
    Cell: ChangeLogStatus,
  },
  {
    Header: 'Comment',
    accessor: 'deletion_reason',
    Cell: ChangeLogComment,
    width: 480,
  },
]

class AssessmentChangeLog extends Component {
  componentDidMount() {
    const enablePrintButton = this.shouldPrintButtonBeEnabled()
    this.initHeaderButtons(enablePrintButton)
  }

  componentDidUpdate(prevProps) {
    this.updatePrintButtonIfNeeded(prevProps.assessmentHistory)
  }

  componentWillUnmount() {
    this.props.pageHeaderButtonsController.updateHeaderButtonsToDefault()
  }

  initHeaderButtons(enablePrintButton) {
    const { assessmentHistory, client, pageHeaderButtonsController } = this.props
    const assessmentId = assessmentHistory.length > 0 ? assessmentHistory[0].entity_id : 0
    const node = <PrintChangeLog history={assessmentHistory} client={client} assessmentId={assessmentId} />
    const leftButton = buildSearchClientsButton()
    const rightButton = <PrintButton node={node} isEnabled={enablePrintButton} />

    pageHeaderButtonsController.updateHeaderButtons(leftButton, rightButton)
  }

  updatePrintButtonIfNeeded(prevAssessmentHistory) {
    const { assessmentHistory } = this.props

    if (prevAssessmentHistory !== assessmentHistory) {
      const enablePrintButton = this.shouldPrintButtonBeEnabled()
      this.initHeaderButtons(enablePrintButton)
    }
  }

  shouldPrintButtonBeEnabled() {
    const { assessmentHistory } = this.props
    const assessmentHistoryLength = assessmentHistory.length

    return assessmentHistoryLength > 0
  }

  buildChangeLogTitle(client, assessmentHistory) {
    const clientName = formatClientName(client)
    const titleClientName = trimSafely(`CANS Change Log: ${clientName}`)
    const assessmentDate = assessmentHistory.length > 0 ? assessmentHistory[0].event_date : ''
    const formattedDate = assessmentDate ? isoToLocalDate(assessmentDate) : ''
    const titleAssessmentDate = trimSafely(`Assessment Date: ${formattedDate}`)
    return (
      <div className="change-log-title">
        <span>{titleClientName}</span>
        <span>{titleAssessmentDate}</span>
      </div>
    )
  }

  render() {
    const { client, assessmentHistory } = this.props
    const showPagination = assessmentHistory.length > PAGE_SIZES[0]
    return assessmentHistory.length > 0 ? (
      <Card>
        <CardHeader>
          <CardTitle>{this.buildChangeLogTitle(client, assessmentHistory)}</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          <SessionDataGrid
            data={assessmentHistory}
            showPagination={showPagination}
            minRows={0}
            pageSizeSessionKey={ASSESSMENT_CHANGELOG_PAGE_SIZE_KEY}
            pageSizeOptions={PAGE_SIZES}
            columns={columnConfig}
          />
        </CardBody>
      </Card>
    ) : null
  }
}

AssessmentChangeLog.propTypes = {
  assessmentHistory: PropTypes.arrayOf(assessmentHistoryPropTypes),
  client: clientPropTypes.isRequired,
  pageHeaderButtonsController: PropTypes.shape({
    updateHeaderButtons: PropTypes.func.isRequired,
    updateHeaderButtonsToDefault: PropTypes.func.isRequired,
  }).isRequired,
}

AssessmentChangeLog.defaultProps = {
  assessmentHistory: [],
}

export default AssessmentChangeLog
