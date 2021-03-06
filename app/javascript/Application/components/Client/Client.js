import React, { Component, Fragment } from 'react'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card/Card'
import CardHeader from '@material-ui/core/CardHeader'
import CardContent from '@material-ui/core/CardContent'
import PropTypes from 'prop-types'
import { isoToLocalDate } from '../../util/dateHelper'
import NavFromProducer from '../../util/NavFromProducer'
import { urlTrimmer } from '../../util/urlTrimmer'
import ClientAssessmentStatistics from './ClientAssessmentStatistics'
import ClientAssessmentHistoryLoadingBoundary from './AssessmentHistory/ClientAssessmentHistoryLoadingBoundary'

const SINGLE_WIDTH = 3
const DOUBLE_WIDTH = 6

class Client extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loadingBoundaryKey: Math.random(),
      isComparisonShown: false,
    }
  }

  recordsModeSwitch = () => {
    this.setState({ isComparisonShown: !this.state.isComparisonShown })
  }

  renderClientData(data, label, gridSize = SINGLE_WIDTH, itemId = label) {
    return (
      <Grid item xs={gridSize} id={`client-data-${itemId.replace(/ /g, '_')}`}>
        <div className={'label-text'}>{label}</div>
        {data}
      </Grid>
    )
  }

  updateClientAssessmentHistory = () => {
    this.setState({ loadingBoundaryKey: Math.random() })
  }

  sensitivityTypeLabel(type) {
    if (!type) {
      return 'Unrestricted'
    }
    switch (type) {
      case 'SEALED':
        return 'Sealed'
      case 'SENSITIVE':
        return 'Sensitive'
      default:
        return type
    }
  }

  formatCounty = county => {
    if (county) {
      return county.name
    } else {
      return ''
    }
  }

  ClientAssessmentHistoryUrlTrimmer = url => {
    const urlArray = url.split('/')
    const targetIndex = urlArray.indexOf('clients')
    const linkUrl = urlTrimmer(url, targetIndex, 2)
    return linkUrl
  }

  render() {
    const { client } = this.props
    const clientIdentifier = client.identifier ? client.identifier : ''
    const assessmentStatisticsProps = {
      clientIdentifier,
      loadingBoundaryKey: this.state.loadingBoundaryKey,
      isComparisonShown: this.state.isComparisonShown,
      client,
      navFrom: NavFromProducer(this.props.navigateTo),
      inheritUrl: this.ClientAssessmentHistoryUrlTrimmer(this.props.match.url),
      userId: this.props.match.params.staffId,
      updateAssessmentHistoryCallback: this.updateClientAssessmentHistory,
      recordsModeSwitch: this.recordsModeSwitch,
    }

    return (
      <Fragment>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <Card className={'card'}>
              <CardHeader className={'card-header-cans'} title="Client Information" />
              <div className={'content'}>
                <CardContent>
                  {client && client.identifier ? (
                    <Grid container spacing={24} id={'client-info-content'}>
                      {this.renderClientData(<b>{client.first_name}</b>, 'First Name')}
                      {this.renderClientData(<b>{client.middle_name}</b>, 'Middle Name')}
                      {this.renderClientData(<b>{client.last_name}</b>, 'Last Name')}
                      {this.renderClientData(<b>{client.suffix}</b>, 'Suffix')}
                      {this.renderClientData(isoToLocalDate(client.dob), 'Date of Birth')}
                      {this.renderClientData(this.formatCounty(client.county), 'County', SINGLE_WIDTH, 'county')}
                      {this.renderClientData(client.external_id, 'Client Id', DOUBLE_WIDTH)}
                    </Grid>
                  ) : (
                    <span id={'no-data'}>No Child Data Found</span>
                  )}
                </CardContent>
              </div>
            </Card>
          </Grid>
          <ClientAssessmentHistoryLoadingBoundary
            clientIdentifier={clientIdentifier}
            key={this.state.loadingBoundaryKey}
          >
            <ClientAssessmentStatistics {...assessmentStatisticsProps} />
          </ClientAssessmentHistoryLoadingBoundary>
        </Grid>
      </Fragment>
    )
  }
}

Client.propTypes = {
  client: PropTypes.object,
  match: PropTypes.shape({
    params: PropTypes.shape({ staffId: PropTypes.string }),
    url: PropTypes.string.isRequired,
  }).isRequired,
  navigateTo: PropTypes.string.isRequired,
}

Client.defaultProps = {
  client: {},
}

export default Client
