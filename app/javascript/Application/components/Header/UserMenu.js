import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, UncontrolledUserMenu } from '@cwds/components'
import { formatUserName } from '../../util/formatters'
import { logoutUrl } from '../../util/navigationUtil'

const logoutPath = logoutUrl()

const UserMenu = ({ user }) => {
  const name = user ? formatUserName(user) : 'Not Available'
  return (
    <UncontrolledUserMenu label={name}>
      <MenuItem tag={'a'} href={logoutPath}>
        Logout
      </MenuItem>
    </UncontrolledUserMenu>
  )
}

UserMenu.propTypes = {
  user: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
  }),
}

UserMenu.defaultProps = {
  user: null,
}

export default UserMenu
