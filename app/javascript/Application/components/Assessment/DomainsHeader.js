import React from 'react'
import PropTypes from 'prop-types'
import { Button, CardHeader, CardTitle } from '@cwds/components'
import './style.sass'

const DomainsHeader = props => {
  const { isUnderSix, isUnifiedExpansion, expandCollapse, isDomainsReviewed } = props
  return (
    <CardHeader className="domains-expand-collapse-header">
      <CardTitle className="assessment-card-title">
        <span className={'domains-expand-collapse-age-range'}>{isUnderSix ? 'Age Range 0-5' : 'Age Range 6-21'}</span>
        {isDomainsReviewed ? (
          <Button onClick={expandCollapse}>{isUnifiedExpansion ? 'Collapse All' : 'Expand All'}</Button>
        ) : null}
      </CardTitle>
    </CardHeader>
  )
}
DomainsHeader.propTypes = {
  expandCollapse: PropTypes.func,
  isDomainsReviewed: PropTypes.bool.isRequired,
  isUnderSix: PropTypes.bool.isRequired,
  isUnifiedExpansion: PropTypes.bool,
}
DomainsHeader.defaultProps = {
  expandCollapse: () => {},
  isUnifiedExpansion: false,
}

export default DomainsHeader
