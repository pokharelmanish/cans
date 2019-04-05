import React from 'react'
import PropTypes from 'prop-types'
import StaffNameLink from './StaffNameLink'
import { staffPropType } from './StaffHelper'
import { PAGE_SIZES, gridMinRows } from '../../util/DataGridHelper'
import DataGridHeader from '../common/DataGridHeader'
import SessionDataGrid from '../common/SessionDataGrid'
import { STAFF_LIST_PAGE_SIZE_KEY } from '../../util/sessionStorageUtil'

const columns = [
  {
    Header: 'Staff Name',
    id: 'staffName',
    accessor: staff => `${staff.staff_person.last_name}, ${staff.staff_person.first_name}`,
    Cell: StaffNameLink,
  },
  {
    Header: (
      <DataGridHeader
        title={'Total Clients'}
        index={'client-index'}
        tooltip={"The number of clients in that staff person's caseload"}
      />
    ),
    accessor: 'clients_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: (
      <DataGridHeader
        title={'No Prior'}
        index={'no-prior'}
        tooltip={'The count of clients who have never had a CANS assessment in the CARES system'}
      />
    ),
    accessor: 'no_prior_cans_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: (
      <DataGridHeader
        title={'In Progress'}
        index={'in-progress'}
        tooltip={'The count of clients who currently have an assessment in progress'}
      />
    ),
    accessor: 'in_progress_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
  {
    Header: (
      <DataGridHeader
        title={'Completed'}
        tooltip={'The number of clients who are in completed status'}
        index={'completed'}
      />
    ),
    accessor: 'completed_count',
    className: 'text-center',
    headerClassName: 'text-center',
  },
]

const StaffTable = ({ staff }) => (
  <SessionDataGrid
    data={staff}
    columns={columns}
    pageSizeSessionKey={STAFF_LIST_PAGE_SIZE_KEY}
    pageSizeOptions={PAGE_SIZES}
    showPagination={true}
    minRows={gridMinRows(staff)}
    defaultSorted={[{ id: 'staffName' }]}
  />
)

StaffTable.propTypes = {
  staff: PropTypes.arrayOf(staffPropType).isRequired,
}

export default StaffTable
