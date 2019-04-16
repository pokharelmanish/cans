import React from 'react'
import PropTypes from 'prop-types'
import { MenuItem, UncontrolledUserMenu } from '@cwds/components'
import { formatUserName } from '../../util/formatters'
import pageLockService from '../common/PageLockService'
import UserAccountService from '../common/UserAccountService'

const onLogout = () => {
  pageLockService.confirm(UserAccountService.logout)
}

const UserMenu = ({ user }) => {
  const name = user ? formatUserName(user) : 'Not Available'
  return (
    <UncontrolledUserMenu label={name}>
      <MenuItem tag={'span'} onClick={onLogout}>
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
