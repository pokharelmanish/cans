import React from 'react'
import PropTypes from 'prop-types'
import { Redirect } from 'react-router-dom'
import { Button } from '@cwds/components'
import pageLockService from '../common/PageLockService'

class ChangelogLink extends React.Component {
  state = {
    shouldRedirect: false,
  }

  onClick = () => {
    pageLockService.confirm(() => this.setState({ shouldRedirect: true }), {
      isDiscardDisabled: this.props.assessmentId === undefined,
    })
  }

  render() {
    const { shouldRedirect } = this.state

    if (shouldRedirect) {
      const { assessmentId, assessmentStatus } = this.props
      const pathname = `${assessmentId}/changelog/${assessmentStatus}`
      const redirectProps = { pathname }

      return <Redirect push to={redirectProps} />
    }
    return (
      <Button
        className={'view-changelog-link button-fix-secondary'}
        color="link"
        onClick={this.onClick}
        onKeyPress={this.onClick}
      >
        <strong>view change log</strong>
      </Button>
    )
  }
}

ChangelogLink.propTypes = {
  assessmentId: PropTypes.number,
  assessmentStatus: PropTypes.string,
}
ChangelogLink.defaultProps = {
  assessmentId: undefined,
  assessmentStatus: 'IN_PROGRESS',
}

export default ChangelogLink
