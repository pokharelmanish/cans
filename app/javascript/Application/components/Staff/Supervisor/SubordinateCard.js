import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardBody, CardTitle } from '@cwds/components'
import StaffTable from '../StaffTable'
import { LoadingState } from '../../../util/loadingHelper'
import { staffPropType } from '../StaffHelper'

const SubordinateCard = ({ loadingState, staff }) => {
  const loadingProp = loadingState === LoadingState.updating ? 'true' : undefined
  return (
    <div className={'card-fix'}>
      <Card loading={loadingProp} className={'card'}>
        <CardHeader>
          <CardTitle>Assigned Staff</CardTitle>
        </CardHeader>
        <CardBody>
          <StaffTable staff={staff} />
        </CardBody>
      </Card>
    </div>
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
