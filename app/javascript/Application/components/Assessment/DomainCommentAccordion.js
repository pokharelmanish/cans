import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from '@cwds/components'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Comment from '../common/Comment'
import CommentIcon from '../common/CommentIcon'
import { expandingThenScroll } from '../../util/assessmentAutoScroll'
import BottomCollapseIcon from './BottomCollapseIcon'

const maxCommentLength = 2500

class DomainCommentAccordion extends Component {
  constructor(props) {
    super(props)
    this.state = { isExpanded: false }
  }

  switchExpandedState = event => {
    this.setState({ isExpanded: !this.state.isExpanded })
    expandingThenScroll(event, this.state.expanded, this.props.domain.items.length, this.props.disabled)
  }

  handleDomainCommentChange = comment => {
    const code = this.props.domain.code
    const caregiverIndex = this.props.domain.caregiver_index
    this.props.onDomainCommentUpdate(code, comment, caregiverIndex)
  }

  handleKeyCheck = event => {
    if (event.key !== 'Tab') {
      this.switchExpandedState()
    }
  }

  renderDomainCommentHeader = (code, isExpanded, domain, commentTitle) => {
    const ROTATION_RIGHT = 270
    return (
      <Paper>
        <Toolbar className="item-inner-toolbar">
          <Icon
            id={`${code}-comment-accordion-expand`}
            className="item-expand-icon"
            role="link"
            tabIndex={0}
            icon="chevron-down"
            rotation={isExpanded ? null : ROTATION_RIGHT}
            onClick={this.switchExpandedState}
            onKeyDown={this.handleKeyCheck}
          />
          <Typography
            variant="title"
            style={{
              fontSize: '0.8rem',
              flex: 1,
              textAlign: 'left',
              marginLeft: 10,
            }}
          >
            {commentTitle}
          </Typography>
          {domain.comment ? (
            <CommentIcon
              className={'domain-comment-accordion-comment-icon'}
              ratingType={domain.items[0].rating_type === 'BOOLEAN' ? 'bool-rating' : 'reg-rating'}
            />
          ) : null}
        </Toolbar>
      </Paper>
    )
  }

  renderDomainCommentBody = (id, comment) => {
    return (
      <Paper className={'domain-comment-accordion-paper'}>
        <Comment
          id={id}
          comment={comment}
          onChange={this.handleDomainCommentChange}
          prefix={'domain-comment'}
          maxCommentLength={maxCommentLength}
          disabled={this.props.disabled}
        />
      </Paper>
    )
  }
  render() {
    const { title, domain, id } = this.props
    const { isExpanded } = this.state
    const { code, comment } = domain
    const commentTitle = `Overall ${title} Comment`
    return (
      <div key={`${code}`}>
        <div>
          {this.renderDomainCommentHeader(code, isExpanded, domain, commentTitle)}
          {isExpanded ? this.renderDomainCommentBody(id, comment) : null}
        </div>
        <Paper className={'domain-inner-collapse-icon-container'}>
          <BottomCollapseIcon code={this.props.domain.code} onClick={this.props.domainBottomCollapseClick} />
        </Paper>
        <Divider />
      </div>
    )
  }
}

DomainCommentAccordion.propTypes = {
  disabled: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  domainBottomCollapseClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  onDomainCommentUpdate: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

DomainCommentAccordion.defaultProps = {
  disabled: false,
}

export default DomainCommentAccordion
