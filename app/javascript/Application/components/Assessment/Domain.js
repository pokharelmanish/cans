import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Input } from 'reactstrap'
import { DomainProgressBar, DomainScore, DomainItemList, DomainCaregiverControls } from './'
import DomainCommentAccordion from './DomainCommentAccordion'
import DomainCommentIcon from './DomainCommentIcon'
import { shouldDomainBeRendered } from './AssessmentHelper'
import { isA11yAllowedInput } from '../../util/events'
import Grid from '@material-ui/core/Grid'
import { totalScoreCalculation, itemFilter } from './DomainScoreHelper.js'
import { isEmpty } from '../../util/common'
import { expandingThenScroll } from '../../util/assessmentAutoScroll'
import { Button, Icon, UncontrolledTooltip } from '@cwds/components'
import './style.sass'

const mapI18nToState = props => ({
  title: props.i18n._title_ || '',
  description: props.i18n._description_ || 'No Description',
  caregiverName: props.domain.caregiver_name || '',
})

class Domain extends Component {
  constructor(props) {
    super(props)
    this.state = {
      expanded: props.isDefaultExpanded,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!isEmpty(nextProps.i18n) && !prevState.description) {
      return mapI18nToState(nextProps)
    }
    return null
  }

  handleOpenToReview = event => {
    const code = this.props.domain.code
    const caregiverIndex = this.props.domain.caregiver_index
    this.props.onDomainReviewed(code, caregiverIndex)
  }

  handleExpandedChange = event => {
    this.handleOpenToReview(event)
    this.setState({
      expanded: !this.state.expanded,
    })
    expandingThenScroll(event, this.state.expanded, this.props.domain.items.length, this.props.disabled)
  }

  handleAddCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.onAddCaregiverDomain(this.props.domain.caregiver_index)
    }
  }

  handleRemoveCaregiverDomain = event => {
    if (isA11yAllowedInput(event)) {
      this.props.handleWarningShow(true, this.props.domain.caregiver_index)
    }
  }

  handleInternalCaregiverNameUpdate = event => {
    this.setState({ caregiverName: event.target.value })
  }

  handleCaregiverNameUpdate = () => {
    this.props.onCaregiverNameUpdate(this.props.domain.caregiver_index, this.state.caregiverName)
  }

  renderCaregiverName = () => {
    return (
      <div className={'caregiver-name-wrapper'}>
        <Input
          bsSize="sm"
          placeholder="ex. Last Name, First Name/Relationship to child or youth"
          className={'caregiver-name'}
          value={this.state.caregiverName}
          maxLength={50}
          onChange={this.handleInternalCaregiverNameUpdate}
          onBlur={this.handleCaregiverNameUpdate}
          disabled={this.props.disabled}
        />
      </div>
    )
  }

  render = () => {
    const i18nAll = this.props.i18nAll || {}
    const {
      isAssessmentUnderSix,
      domain,
      onRatingUpdate,
      onItemCommentUpdate,
      onConfidentialityUpdate,
      canReleaseConfidentialInfo,
      index,
      disabled,
      isUsingPriorRatings,
    } = this.props
    const isReviewed = isUsingPriorRatings ? domain.is_reviewed : true
    const { items, is_caregiver_domain: isCaregiverDomain } = domain
    const { title, description, caregiverName, expanded } = this.state
    const itemListProps = {
      items,
      caregiverIndex: domain.caregiver_index,
      i18nAll,
      onRatingUpdate,
      onItemCommentUpdate,
      onConfidentialityUpdate,
      isAssessmentUnderSix,
      canReleaseConfidentialInfo,
      disabled,
    }
    const validItems = itemFilter(items, isAssessmentUnderSix)
    const totalScore = totalScoreCalculation(validItems)
    const warningText = <span className={'caregiver-warning-text'}> Caregiver Name is required</span>

    return shouldDomainBeRendered(isAssessmentUnderSix, domain) ? (
      <Fragment>
        <ExpansionPanel expanded={expanded} onChange={this.handleExpandedChange} elevation={0}>
          <ExpansionPanelSummary
            expandIcon={
              isReviewed || expanded ? (
                <ExpandMoreIcon id={`domain${index}-expand`} className={'expand-more-icon'} />
              ) : (
                <Button
                  id={`domain${index}-review`}
                  color="primary"
                  className={'review-regular-button no-uppercase'}
                  onClick={this.handleOpenToReview}
                >
                  Open to review
                </Button>
              )
            }
          >
            <Grid
              container
              direction="row"
              justify="flex-end"
              alignItems="flex-end"
              spacing={0}
              style={{ padding: 0, flexWrap: 'nowrap', flexDirection: 'row' }}
            >
              <Grid item xs={8}>
                <Typography variant="title" style={{ color: '#0e6f89', fontSize: 16 }}>
                  {title}
                  <Icon className="domain-help-icon" icon="info-circle" id={`domain-${index}`} />
                  {description ? (
                    <UncontrolledTooltip style={{ minWidth: '20rem' }} target={`domain-${index}`} placement="top">
                      {description}
                    </UncontrolledTooltip>
                  ) : null}{' '}
                  {(isCaregiverDomain && caregiverName === '') ||
                  (isCaregiverDomain && caregiverName && caregiverName.trim() === '')
                    ? warningText
                    : caregiverName && `- ${caregiverName}`}
                </Typography>
              </Grid>
              <Grid item xs={4} className={isReviewed ? 'domain-metric' : 'domain-metric-with-review'}>
                <div className="domain-toolbar-comment-icon-block">
                  <DomainCommentIcon domain={domain} />
                </div>
                <DomainProgressBar isAssessmentUnderSix={isAssessmentUnderSix} domain={domain} />
                <DomainScore totalScore={totalScore} key={index} />
              </Grid>
            </Grid>
          </ExpansionPanelSummary>
          {expanded && (
            <div>
              <ExpansionPanelDetails
                style={{
                  display: 'block',
                  padding: '0',
                  backgroundColor: 'white',
                }}
              >
                {isCaregiverDomain && this.renderCaregiverName()}
                <DomainItemList {...itemListProps} />
                <DomainCommentAccordion
                  id={`${domain.code}-${domain.caregiver_index}`}
                  title={title}
                  domain={domain}
                  onDomainCommentUpdate={this.props.onDomainCommentUpdate}
                  disabled={this.props.disabled}
                  domainBottomCollapseClick={this.handleExpandedChange}
                />
                {isCaregiverDomain &&
                  !this.props.disabled && (
                    <DomainCaregiverControls
                      onRemoveCaregiverDomain={this.handleRemoveCaregiverDomain}
                      onAddCaregiverDomain={this.handleAddCaregiverDomain}
                    />
                  )}
              </ExpansionPanelDetails>
            </div>
          )}
        </ExpansionPanel>
      </Fragment>
    ) : null
  }
}

Domain.propTypes = {
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  disabled: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  handleWarningShow: PropTypes.func,
  i18n: PropTypes.object.isRequired,
  i18nAll: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  isAssessmentUnderSix: PropTypes.bool,
  isDefaultExpanded: PropTypes.bool,
  isUsingPriorRatings: PropTypes.bool,
  onAddCaregiverDomain: PropTypes.func.isRequired,
  onCaregiverNameUpdate: PropTypes.func.isRequired,
  onConfidentialityUpdate: PropTypes.func.isRequired,
  onDomainCommentUpdate: PropTypes.func.isRequired,
  onDomainReviewed: PropTypes.func,
  onItemCommentUpdate: PropTypes.func.isRequired,
  onRatingUpdate: PropTypes.func.isRequired,
}

Domain.defaultProps = {
  disabled: false,
  handleWarningShow: () => {},
  isAssessmentUnderSix: null,
  isDefaultExpanded: false,
  isUsingPriorRatings: false,
  onDomainReviewed: () => {},
}

export default Domain
