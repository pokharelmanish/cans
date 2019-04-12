import { isoToLocalDate } from '../../util/dateHelper'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import CaseLoadPageTemplateNameCell from './CaseLoadPageTemplateNameCell'
import { navigation } from '../../util/constants'

export function renderDate(datetime) {
  return !datetime || datetime === null ? null : isoToLocalDate(datetime)
}

export function sortDOB(a, b) {
  const dobA = new Date(a).getTime()
  const dobB = new Date(b).getTime()
  return dobA > dobB ? 1 : -1
}

export function cellTempSwitcher(navFrom) {
  switch (navFrom) {
    case navigation.STAFF_LIST:
      return CaseLoadPageTemplateNameCell

    default:
      return ClientCardTemplateNameCell
  }
}
