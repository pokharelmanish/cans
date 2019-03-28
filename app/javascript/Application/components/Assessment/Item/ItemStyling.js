export const ieFixedStyle = {
  radio: {
    paddingLeft: '0.125rem',
    paddingRight: '0',
    '&$checked': {
      color: '#09798E',
    },
    '&$disabled': {
      color: '#000000',
      opacity: 0.26,
    },
  },
  label: {
    marginTop: '0.5rem',
  },
}

export const noneIeFixedStyle = {
  radio: {
    width: '0.4375rem',
    '&$checked': {
      disabled: { color: '000000' },
      color: '#09798E',
    },
    '&$disabled': {
      color: '#000000',
      opacity: 0.26,
    },
  },
  label: {
    margin: 0,
    paddingLeft: '0.2rem',
    paddingRight: '0.1rem',
  },
}

export function ieStyleFixer(isIE) {
  const isIeChecker = navigator.userAgent.indexOf('MSIE') !== -1 || Boolean(document.documentMode) === true
  let styleSetting
  isIE = isIE || isIeChecker
  if (isIE) {
    styleSetting = ieFixedStyle
  } else {
    styleSetting = noneIeFixedStyle
  }
  return styleSetting
}
