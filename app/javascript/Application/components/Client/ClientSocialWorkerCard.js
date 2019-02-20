import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody, CardTitle } from '@cwds/components'
import { PAGE_SIZES, gridMinRows } from '../../util/DataGridHelper'
import SessionDataGrid from '../common/SessionDataGrid'
import { CLIENT_LIST_PAGE_SIZE_KEY } from '../../util/sessionStorageUtil'
import './style.sass'

const ClientSocialWorkerCard = props => {
  return (
    <Card className="card-cans-client-list">
      <CardHeader>
        <CardTitle>
          Client List<span className="client-list-records-amount">({props.title})</span>
        </CardTitle>
      </CardHeader>
      <CardBody>
        <SessionDataGrid
          {...props}
          sortable={true}
          className="client-grid"
          minRows={gridMinRows(props.data)}
          noDataText={'No records found'}
          pageSizeSessionKey={CLIENT_LIST_PAGE_SIZE_KEY}
          pageSizeOptions={PAGE_SIZES}
          showPaginationBottom={true}
        />
      </CardBody>
    </Card>
  )
}

ClientSocialWorkerCard.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.number.isRequired,
}

export default ClientSocialWorkerCard
