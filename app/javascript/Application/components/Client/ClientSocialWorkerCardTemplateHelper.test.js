import { cellTempSwitcher } from './ClientSocialWorkerCardTemplateHelper'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import CaseLoadPageTemplateNameCell from './CaseLoadPageTemplateNameCell'
import { navigation } from '../../util/constants'

describe('ClientSocialWorkerCardTemplateHelper', () => {
  it('cellTempSwitcher', () => {
    expect(cellTempSwitcher(navigation.STAFF_LIST)).toEqual(CaseLoadPageTemplateNameCell)
    expect(cellTempSwitcher(navigation.CHILD_LIST)).toEqual(ClientCardTemplateNameCell)
  })
})
