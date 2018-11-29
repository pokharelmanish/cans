import React, { Fragment } from 'react'
import { Header } from './components/Header'
import { BrowserRouter } from 'react-router-dom'
import { Routes } from './routes'
import TimeoutWarning from './components/common/TimeoutWarning'

import './style.sass'

const App = () => {
  const basePath = process.env.CANS_BASE_PATH || '/cans'
  return (
    <BrowserRouter basename={basePath}>
      <Fragment>
        <Header />
        <TimeoutWarning />
        <Routes />
      </Fragment>
    </BrowserRouter>
  )
}

export default App
