import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@cwds/components'

const ShowMoreResultsButton = ({ isHighlighted, onClick, ...itemProps }) => (
  <div className="search-list-box">
    <div className="half-pad-top half-pad-bottom half-pad-right half-pad-left">
      <Button
        {...itemProps}
        onClick={onClick}
        className="show-more-results-button"
        primary
        block={true}
        active={isHighlighted}
      >
        Show More Results
      </Button>
    </div>
  </div>
)

ShowMoreResultsButton.propTypes = {
  isHighlighted: PropTypes.bool,
  onClick: PropTypes.func,
}

ShowMoreResultsButton.defaultProps = {
  isHighlighted: false,
  onClick: () => {},
}
export default ShowMoreResultsButton
