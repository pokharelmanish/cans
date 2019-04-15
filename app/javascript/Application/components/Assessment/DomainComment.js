import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Comment from '../common/Comment'
import DomainCollapseButton from './DomainCollapseButton'

const maxCommentLength = 2500

class DomainComment extends React.PureComponent {
  handleDomainCommentChange = comment => {
    const code = this.props.domain.code
    const caregiverIndex = this.props.domain.caregiver_index
    this.props.onDomainCommentUpdate(code, comment, caregiverIndex)
  }

  renderDomainCommentBody = (id, comment, commentTitle) => {
    return (
      <Paper className={'domain-comment-paper'}>
        <Typography variant="title" className={'domain-comment-title'}>
          {commentTitle}
        </Typography>
        <Comment
          id={id}
          comment={comment}
          title={'Leave a Comment'}
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
    const { code, comment } = domain
    const commentTitle = `Overall ${title} Comment`
    return (
      <div key={`${code}`}>
        <div>{this.renderDomainCommentBody(id, comment, commentTitle)}</div>
        <Paper className={'domain-inner-collapse-button-container'}>
          <DomainCollapseButton
            code={this.props.domain.code}
            title={title}
            onClick={this.props.domainBottomCollapseClick}
          />
        </Paper>
        <Divider />
      </div>
    )
  }
}

DomainComment.propTypes = {
  disabled: PropTypes.bool,
  domain: PropTypes.object.isRequired,
  domainBottomCollapseClick: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  onDomainCommentUpdate: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

DomainComment.defaultProps = {
  disabled: false,
}

export default DomainComment
