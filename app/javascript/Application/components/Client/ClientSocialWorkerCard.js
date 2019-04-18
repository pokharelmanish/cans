import React from 'react'
import PropTypes from 'prop-types'
import { CardHeader, CardBody, CardTitle } from '@cwds/components'
import Card from '@material-ui/core/Card/Card'
import { PAGE_SIZES, gridMinRows } from '../../util/DataGridHelper'
import SessionDataGrid from '../common/SessionDataGrid'
import { CLIENT_LIST_PAGE_SIZE_KEY } from '../../util/sessionStorageUtil'
import './style.sass'

const ClientSocialWorkerCard = props => {
  return (
    <div className={'card-fix'}>
      <Card className={'card'}>
        <CardHeader>
          <CardTitle>
            Client List <span>({props.title})</span>
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
    </div>
  )
}

ClientSocialWorkerCard.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,
  title: PropTypes.number.isRequired,
}

export default ClientSocialWorkerCard
