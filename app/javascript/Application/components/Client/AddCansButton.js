import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Button } from '@cwds/components'

class AddCansButton extends Component {
  isDisabled = () => {
    const { disabled } = this.props
    return disabled === 'true' || disabled === true
  }

  renderButton = () => {
    const { isReassessment } = this.props
    return (
      <Button className="modal-regular-button no-uppercase" id="new-cans-button" disabled={this.isDisabled()}>
        {isReassessment ? 'Add reassessment' : 'Add CANS'}
      </Button>
    )
  }

  render() {
    const { clientIdentifier } = this.props
    return this.isDisabled() ? (
      this.renderButton()
    ) : (
      <Link to={`./${clientIdentifier}/assessments`}>{this.renderButton()}</Link>
    )
  }
}

AddCansButton.propTypes = {
  clientIdentifier: PropTypes.string.isRequired,
  disabled: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  isReassessment: PropTypes.bool,
}

AddCansButton.defaultProps = {
  disabled: false,
  isReassessment: false,
}

export default AddCansButton
