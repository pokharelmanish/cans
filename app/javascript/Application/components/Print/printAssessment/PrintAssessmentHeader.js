import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import {
  headerContainer,
  headerFourColsRow,
  headerThreeColsRow,
  headerFourColsBox,
  headerThreeColsBox,
  headerDescriptionBox,
  headerContentBox,
  headerConductedByBox,
  headerTitleRow,
  headerSubDescriptionBox,
  headerReleaseInfoBox,
} from './PrintAssessmentStyle'
import PrintAssessmentHeaderOptions from './PrintAssessmentHeaderOptions'

class PrintAssessmentHeader extends PureComponent {
  renderFirstRow = () => {
    return (
      <div id="first-row" style={headerFourColsRow}>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.eventDate}</div>
          <div style={headerDescriptionBox}>Date of Assessment</div>
          <div style={headerSubDescriptionBox}>(mm/dd/yy)</div>
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.caseReferralNumber}</div>
          <div style={headerDescriptionBox}>{this.props.caseReferralNumberTitle}</div>
          <div />
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.assessmentType}</div>
          <div style={headerDescriptionBox}>Assessment type</div>
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.countyName}</div>
          <div style={headerDescriptionBox}>County</div>
          <div />
        </div>
      </div>
    )
  }

  renderSecondRow = () => {
    return (
      <div id="second-row" style={headerFourColsRow}>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.client.first_name}</div>
          <div style={headerDescriptionBox}>First name</div>
          <div />
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.client.middle_name}</div>
          <div style={headerDescriptionBox}>Middle name</div>
          <div />
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.client.last_name}</div>
          <div style={headerDescriptionBox}>Last name</div>
        </div>
        <div style={headerFourColsBox}>
          <div style={headerContentBox}>{this.props.clientDob}</div>
          <div style={headerDescriptionBox}>Date of Birth</div>
          <div style={headerSubDescriptionBox}>(mm/dd/yy)</div>
        </div>
      </div>
    )
  }

  renderThirdRow = () => {
    return (
      <div id="third-row" style={headerThreeColsRow}>
        <div style={headerThreeColsBox}>
          <div style={headerContentBox}>{this.props.clientAge}</div>
          <div style={headerDescriptionBox}>Age</div>
          <div style={headerSubDescriptionBox} />
        </div>
        <div style={headerThreeColsBox}>
          <div style={headerContentBox}>
            <PrintAssessmentHeaderOptions isChecked={this.props.hasCaregiver} />
          </div>
          <div style={headerDescriptionBox}>Child/youth has caregiver?</div>
          <div style={headerSubDescriptionBox} />
        </div>
        <div style={headerReleaseInfoBox}>
          <div style={headerContentBox}>
            <PrintAssessmentHeaderOptions isChecked={Boolean(this.props.canReleaseInfo)} />
          </div>
          <div style={headerDescriptionBox}>Authorization for release of information on file?</div>
          <div style={headerSubDescriptionBox}>{this.props.canReleaseInfo || this.props.confidentialWarningAlert}</div>
        </div>
      </div>
    )
  }

  renderFourthRow = () => {
    return (
      <div id="fourth-row" style={headerThreeColsRow}>
        <div style={headerConductedByBox}>
          <div style={headerContentBox}>{this.props.conductedBy}</div>
          <div style={headerDescriptionBox}>First name</div>
        </div>
        <div style={headerConductedByBox}>
          <div style={headerContentBox} />
          <div style={headerDescriptionBox}>Last name</div>
        </div>
        <div style={headerConductedByBox}>
          <div style={headerContentBox} />
          <div style={headerDescriptionBox}>Role</div>
        </div>
      </div>
    )
  }
  render() {
    return (
      <div id="headerContainer" style={headerContainer}>
        {this.renderFirstRow()}
        {this.renderSecondRow()}
        {this.renderThirdRow()}
        <div style={headerTitleRow}>Assessment Conducted by:</div>
        {this.renderFourthRow()}
      </div>
    )
  }
}

PrintAssessmentHeader.propTypes = {
  assessmentType: PropTypes.string.isRequired,
  canReleaseInfo: PropTypes.bool.isRequired,
  caseReferralNumber: PropTypes.string,
  caseReferralNumberTitle: PropTypes.string,
  client: PropTypes.object.isRequired,
  clientAge: PropTypes.string,
  clientDob: PropTypes.string,
  conductedBy: PropTypes.string,
  confidentialWarningAlert: PropTypes.string.isRequired,
  countyName: PropTypes.string.isRequired,
  eventDate: PropTypes.string.isRequired,
  hasCaregiver: PropTypes.bool.isRequired,
}

PrintAssessmentHeader.defaultProps = {
  clientDob: '',
  clientAge: '',
  conductedBy: '',
  caseReferralNumber: '',
  caseReferralNumberTitle: '',
}

export default PrintAssessmentHeader
