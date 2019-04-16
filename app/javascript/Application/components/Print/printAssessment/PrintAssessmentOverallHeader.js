import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { formatClientName } from '../../Client/Client.helper'

class PrintAssessmentOverallHeader extends PureComponent {
  renderFirstLeft = () => {
    return (
      <text
        id="first-line-left"
        fontSize="16"
        fill="#000000"
        x="1%"
        y="15%"
        dominantBaseline="middle"
        textAnchor="start"
      >
        CARES-CANS {this.props.reassessmentInfo} | {this.props.eventDate}
      </text>
    )
  }

  renderFirstRight = () => {
    return (
      <text
        id="first-line-right"
        fontSize="16"
        fill="#000000"
        x="99%"
        y="15%"
        dominantBaseline="middle"
        textAnchor="end"
      >
        {this.props.caseReferralNumberTitle}: {this.props.caseReferralNumber}
      </text>
    )
  }

  renderSecondLeft = () => {
    return (
      <text
        id="sec-line-left"
        fontSize="16"
        fontWeight="900"
        fill="#000000"
        x="1%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="start"
      >
        {formatClientName(this.props.client)}
      </text>
    )
  }

  renderSecondRight = () => {
    return (
      <text
        id="sec-line-right"
        fontSize="16"
        fontWeight="400"
        fill="#000000"
        x="99%"
        y="40%"
        dominantBaseline="middle"
        textAnchor="end"
      >
        DOB: {this.props.clientDob}
      </text>
    )
  }

  renderThirdLeft = () => {
    return (
      <text
        id="third-line-left"
        fontSize="16"
        fontWeight="400"
        fill="#000000"
        x="1%"
        y="65%"
        dominantBaseline="middle"
        textAnchor="start"
      >
        {this.props.countyName} County | Age {this.props.ageRange} Template
      </text>
    )
  }

  renderThirdMiddle = () => {
    return (
      <text
        id="third-line-middle"
        fontSize="18"
        fontWeight="900"
        textDecoration="underline"
        fill="#000000"
        x="70%"
        y="65%"
        dominantBaseline="middle"
        textAnchor="start"
      >
        {this.props.printStatus}
      </text>
    )
  }

  renderThirdRight = () => {
    return (
      <text
        id="third-line-right"
        fontSize="16"
        fontWeight="400"
        fill="#000000"
        x="99%"
        y="65%"
        dominantBaseline="middle"
        textAnchor="end"
      >
        Age: {this.props.clientAge} years
      </text>
    )
  }

  render() {
    return (
      <svg height="80px" width="100%">
        {this.renderFirstLeft()}
        {this.renderFirstRight()}
        {this.renderSecondLeft()}
        {this.renderSecondRight()}
        {this.renderThirdLeft()}
        {this.renderThirdMiddle()}
        {this.renderThirdRight()}
      </svg>
    )
  }
}

PrintAssessmentOverallHeader.propTypes = {
  ageRange: PropTypes.string.isRequired,
  caseReferralNumber: PropTypes.string,
  caseReferralNumberTitle: PropTypes.string,
  client: PropTypes.object.isRequired,
  clientAge: PropTypes.string,
  clientDob: PropTypes.string,
  countyName: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  printStatus: PropTypes.string.isRequired,
  reassessmentInfo: PropTypes.string.isRequired,
}

PrintAssessmentOverallHeader.defaultProps = {
  clientDob: '',
  clientAge: '',
  caseReferralNumber: '',
  caseReferralNumberTitle: '',
}

export default PrintAssessmentOverallHeader
