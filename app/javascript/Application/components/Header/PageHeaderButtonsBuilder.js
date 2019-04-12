import React from 'react'
import { Button, Icon } from '@cwds/components'
import { Link } from 'react-router-dom'

import './style.sass'

export const buildButton = (caption, icon, callback, isEnabled = true) => (
  <Button primary className={'header-button'} onClick={callback} disabled={!isEnabled}>
    {icon && <Icon className="header-button-icon" icon={icon} color="inherit" />}
    <span className={`header-button-caption ${icon ? 'header-button-icon-caption' : ''}`}>{caption}</span>
  </Button>
)

const searchClientsButton = (
  <Link to={'/search'} id={'search-link'}>
    {buildButton('Client Search', 'search')}
  </Link>
)

export const buildSaveAssessmentButton = (onButtonClick, isEnabled) =>
  buildButton('Save', null, onButtonClick, isEnabled)

export const buildSearchClientsButton = () => searchClientsButton
