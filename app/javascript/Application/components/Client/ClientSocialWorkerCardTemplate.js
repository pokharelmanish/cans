import React from 'react'
import { formatClientName, formatClientStatus } from './Client.helper'
import { renderDate, renderReminderDate, cellTempSwitcher } from './ClientSocialWorkerCardTemplateHelper'
import DataGridHeader from '../common/DataGridHeader'
import './style.sass'

export function SocialWorkerCardTemplate(navFrom, staffId) {
  return [
    {
      id: 'fullName',
      Header: 'Client Name',
      accessor: client => {
        return formatClientName(client)
      },
      Cell: cellTempSwitcher(navFrom),
      rol: staffId,
    },
    /* rol just an attribute which used for pass the staffId
and meet the setting rules of reactTable at same time */
    {
      id: 'dob',
      Header: 'DOB',
      headerStyle: {
        textAlign: 'center',
      },
      accessor: client => renderDate(client.dob),
      className: 'client-list-table-cell-center',
      sortMethod: (a, b) => {
        const dateA = new Date(a).getTime()
        const dateB = new Date(b).getTime()
        return dateA > dateB ? 1 : -1
      },
    },
    {
      id: 'CANS Status',
      Header: 'CANS Status',
      headerStyle: {
        textAlign: 'center',
      },
      accessor: client => {
        return formatClientStatus(client.status)
      },
      className: 'client-list-table-cell-center',
      sortable: true,
    },
    {
      id: 'Reassessment Reminder Date',
      Header: (
        <DataGridHeader
          title={'Reassessment Reminder Date'}
          tooltip={
            'A CANS reassessment should be completed in conjunction with the case plan update or at a minimum of every six months'
          }
        />
      ),
      headerStyle: {
        textAlign: 'center',
      },
      accessor: client => renderReminderDate(client.reminder_date),
      className: 'client-list-table-cell-center',
      sortable: true,
    },
  ]
}
