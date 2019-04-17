import { isFirefox, isIE } from '../../../util/common'
import React from 'react'
import { renderToString } from 'react-dom/server'
import HeaderSvgBg from './HeaderSvgBg'

const firefoxPrint = (frame, contentString) => {
  const oldTitle = document.title
  document.title = '\u200E'
  const curURL = window.location.href
  history.replaceState(history.state, '', '/')
  frame.focus()
  frame.contentDocument.body.innerHTML = ''
  frame.contentDocument.write('<!DOCTYPE html>')
  frame.contentDocument.write(contentString)
  frame.contentWindow.print()
  history.replaceState(history.state, '', curURL)
  document.title = oldTitle
}

const nonFirefoxPrint = (frame, contentString) => {
  const frameContentWindow = frame.contentWindow
  const oldTitle = document.title
  document.title = '\u200E'
  const curURL = window.location.href
  history.replaceState(history.state, '', '/')
  frameContentWindow.focus()
  frameContentWindow.document.open()
  frameContentWindow.document.write('<!DOCTYPE html>')
  frameContentWindow.document.write(contentString)
  frameContentWindow.document.close()
  if (isIE) {
    frameContentWindow.document.execCommand('print', false, null)
  } else {
    frameContentWindow.print()
  }
  history.replaceState(history.state, '', curURL)
  document.title = oldTitle
}

export const print = (printFrameId, contentString) => {
  const frame = document.getElementById(printFrameId)
  if (isFirefox) {
    return firefoxPrint(frame, contentString)
  }
  return nonFirefoxPrint(frame, contentString)
}

export const printContainerPreCss =
  '@page {size: letter; margin:32px; padding:0; font-size:16px; }\n' +
  'html {margin:0; background-color: #FFFFFF; font-size:16px}\n' +
  'body {margin:0; font-family:sans-serif, Arial; color-adjust: exact; -webkit-print-color-adjust: exact; text-transform:none;}\n'

// css setting for reuseable components
export const printLayoutCss =
  'div.content {text-align: left;}\n' +
  'table.print-container {width:100%; }\n' +
  'tfoot.print-footer {test-align:left; margin: 0; padding: 0; color: #999999 !important; height:15mm; }\n' +
  'thead.print-header {test-align:left; margin-bottom: 1.18; padding: 0; color: #999999 !important; background-color:white; height:3.54; }\n' +
  'th.header-content {text-align: left; height:7rem; }\n' +
  '.header-with-svg-bg{  position: absolute;top: 0.625rem; display:flex; }\n' +
  'div.cat-header {text-align: left;font-size:1.7rem; background-color:#e8e8e8 !important; padding:0.5rem; }\n' +
  'div.cat-header-container {border-bottom: thin solid black; page-break-inside: avoid; page-break-after: avoid; page-break-before: avoid;}\n' +
  'div.bottom-cover {-webkit-print-color-adjust: exact; background-color:white; height:1.88rem; width:28.3rem; }\n' +
  '.stripe-header-with-svg-bg{  position: absolute;top: 0rem; display:flex; }\n' +
  'div.stripe-gray {position: relative; display:flex; width:100%; }\n' +
  'div.top-cover {background-color:white; height:1.41rem; width:80%; margin-bottom:0.187rem; }\n' +
  'hr {width:100%;}\n'

export const printViewPreparation = node => {
  const cssCode = printContainerPreCss + printLayoutCss
  const printView = (
    <html lang="en">
      <head>
        <style type="text/css">{cssCode}</style>
      </head>
      {node}
    </html>
  )
  return renderToString(printView)
}

export const stripeGenerator = (index, height) => {
  height = height || '40px'
  const result = { containerStyle: '', headerBg: null, contentStyle: '' }
  if (index & 1) {
    result.containerStyle = 'stripe-gray'
    result.headerBg = (
      <div>
        <HeaderSvgBg height={height} />
      </div>
    )
    result.contentStyle = 'stripe-header-with-svg-bg'
  }
  return result
}
