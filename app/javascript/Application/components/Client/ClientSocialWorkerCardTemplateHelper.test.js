import { cellTempSwitcher, sortDOB } from './ClientSocialWorkerCardTemplateHelper'
import ClientCardTemplateNameCell from './ClientCardTemplateNameCell'
import CaseLoadPageTemplateNameCell from './CaseLoadPageTemplateNameCell'
import { navigation } from '../../util/constants'

describe('ClientSocialWorkerCardTemplateHelper', () => {
  it('cellTempSwitcher', () => {
    expect(cellTempSwitcher(navigation.STAFF_LIST)).toEqual(CaseLoadPageTemplateNameCell)
    expect(cellTempSwitcher(navigation.CHILD_LIST)).toEqual(ClientCardTemplateNameCell)
  })

  describe('sortDOB', () => {
    describe('sorts in accending order', () => {
      it('sorts by day', () => {
        const dobA = '01/02/2018'
        const dobB = '01/01/2018'
        expect(sortDOB(dobA, dobB)).toBe(1)
      })

      it('sorts by year', () => {
        const dobA = '01/01/2018'
        const dobB = '12/12/2017'

        expect(sortDOB(dobA, dobB)).toBe(1)
      })

      it('sorts by month', () => {
        const dobA = '03/05/2018'
        const dobB = '02/05/2018'

        expect(sortDOB(dobA, dobB)).toBe(1)
      })
    })

    describe('sorts in descending order', () => {
      it('sorts by day', () => {
        const dobA = '01/01/2018'
        const dobB = '01/02/2018'

        expect(sortDOB(dobA, dobB)).toBe(-1)
      })

      it('sorts by year', () => {
        const dobA = '12/12/2017'
        const dobB = '01/01/2018'

        expect(sortDOB(dobA, dobB)).toBe(-1)
      })

      it('sorts by month', () => {
        const dobA = '02/05/2018'
        const dobB = '03/05/2018'

        expect(sortDOB(dobA, dobB)).toBe(-1)
      })

      it('sorts with empty value', () => {
        const dobA = ''
        const dobB = '03/05/2018'

        expect(sortDOB(dobA, dobB)).toBe(-1)
      })
    })
  })
})
