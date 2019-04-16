import React from 'react'
import PropTypes from 'prop-types'
import { CardHeader, CardBody, CardTitle } from '@cwds/components'
import Card from '@material-ui/core/Card/Card'
import StaffTable from '../StaffTable'
import { LoadingState } from '../../../util/loadingHelper'
import { staffPropType } from '../StaffHelper'

const SubordinateCard = ({ loadingState, staff }) => {
  const loadingProp = loadingState === LoadingState.updating ? 'true' : undefined
  return (
    <Card loading={loadingProp}>
      <CardHeader>
        <CardTitle>Assigned Staff</CardTitle>
      </CardHeader>
      <CardBody>
        <StaffTable staff={staff} />
      </CardBody>
    </Card>
  )
}

SubordinateCard.propTypes = {
  loadingState: PropTypes.oneOf(Object.values(LoadingState)),
  staff: PropTypes.arrayOf(staffPropType),
}

SubordinateCard.defaultProps = {
  loadingState: LoadingState.updating,
  staff: [],
}

export default SubordinateCard
