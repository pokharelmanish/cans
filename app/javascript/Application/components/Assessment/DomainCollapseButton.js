import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@cwds/components'
import { isA11yAllowedInput } from '../../util/events'

class BottomCollapseIcon extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  handleKeyPress = event => {
    if (isA11yAllowedInput(event)) {
      this.props.onClick()
    }
  }

  render() {
    return (
      <Button
        key={`${this.props.code}-inner-collapse-icon`}
        id={`${this.props.code}-inner-collapse-icon`}
        aria-label="domain collapse button"
        tabIndex={0}
        onClick={this.props.onClick}
        onKeyPress={this.handleKeyPress}
      >
        {'Collapse '}
        {this.props.title}
      </Button>
    )
  }
}

BottomCollapseIcon.propTypes = {
  code: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

export default BottomCollapseIcon
