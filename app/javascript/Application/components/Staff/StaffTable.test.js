import React from 'react'
import { shallow } from 'enzyme'
import StaffTable from './StaffTable'
import StaffNameLink from './StaffNameLink'
import SessionDataGrid from '../common/SessionDataGrid'
import { STAFF_LIST_PAGE_SIZE_KEY } from '../../util/sessionStorageUtil'
import { onlyOneStaffCase, staff as mockStaff } from './staff.mocks.test'

describe('<StaffTable />', () => {
  const render = staff => shallow(<StaffTable staff={staff} />)

  const findColumn = headerText =>
    render([])
      .props()
      .columns.find(column => column.Header === headerText)

  it('renders a SessionDataGrid with pageSizeSessionKey', () => {
    const sessionDataGrid = render([]).find(SessionDataGrid)
    expect(sessionDataGrid.exists()).toBe(true)
    expect(sessionDataGrid.props().pageSizeSessionKey).toBe(STAFF_LIST_PAGE_SIZE_KEY)
  })

  it('staff name column accessor is working', () => {
    const testStaffName = `${mockStaff[0].staff_person.last_name}, ${mockStaff[0].staff_person.first_name}`
    const grid = render(mockStaff)
    const target = grid.props().columns[0].accessor
    const result = target(mockStaff[0])
    expect(result).toBe(testStaffName)
  })

  it('will set minRows to 1 when have only one staff', () => {
    const grid = render(onlyOneStaffCase)
    const minRows = grid.props().minRows
    expect(minRows).toBe(1)
  })

  it('will set minRows to 3 when have no staff', () => {
    const threeRows = 3
    const grid = render([])
    const minRows = grid.props().minRows
    expect(minRows).toBe(threeRows)
  })

  it('will set minRows to 1 when have more than 3 staffs', () => {
    const moreThanThreeStaffs = [...mockStaff, ...mockStaff]
    const grid = render(moreThanThreeStaffs)
    const minRows = grid.props().minRows
    expect(moreThanThreeStaffs.length).toBeGreaterThan(3)
    expect(minRows).toBe(1)
  })

  it('shows all rows with pagination', () => {
    const grid = render([]).find(SessionDataGrid)
    expect(grid.props().showPagination).toBe(true)
    expect(grid.props().pageSizeOptions).toEqual([10, 25, 50])
  })

  it('always displays enough rows for a No Records message', () => {
    const grid = render([]).find(SessionDataGrid)
    const spaceForMessage = 3
    expect(grid.props().minRows).toBe(spaceForMessage)
  })

  it('sorts by staffName by default', () => {
    const grid = render([]).find(SessionDataGrid)
    expect(grid.props().defaultSorted).toEqual([{ id: 'staffName' }])
  })

  it('uses the list of staff people as data', () => {
    const grid = render(mockStaff)
    expect(grid.props().data).toBe(mockStaff)
  })

  it('renders staff names as links', () => {
    const staffNameColumn = findColumn('Staff Name')
    expect(staffNameColumn.Cell).toBe(StaffNameLink)
  })

  describe('centered columns', () => {
    const assertColumnIsCentered = (staffTable, columnIndex) => {
      const column = staffTable.props().columns[columnIndex]
      expect(column.className).toBe('text-center')
      expect(column.headerClassName).toBe('text-center')
    }

    it('renders columns centered', () => {
      const staffTable = render(mockStaff)
      assertColumnIsCentered(staffTable, 1)
      assertColumnIsCentered(staffTable, 2)
      assertColumnIsCentered(staffTable, 3)
      assertColumnIsCentered(staffTable, 4)
      assertColumnIsCentered(staffTable, 5)
    })
  })

  describe('tooltips', () => {
    const assertTitleAndTooltip = (columnIndex, title, tooltip) => {
      const staffTable = render(mockStaff)
      const header = staffTable.props().columns[columnIndex].Header
      expect(header.props.title).toEqual(title)
      expect(header.props.tooltip).toBe(tooltip)
    }
    it('renders tooltip for respective columns', () => {
      assertTitleAndTooltip(1, 'Total Clients', "The number of clients in that staff person's caseload")
      assertTitleAndTooltip(
        2,
        'No Prior',
        'The count of clients who have never had a CANS assessment in the CARES system'
      )
      assertTitleAndTooltip(3, 'In Progress', 'The count of clients who currently have an assessment in progress')
      assertTitleAndTooltip(4, 'Completed', 'The number of clients who are in completed status')
      assertTitleAndTooltip(
        5,
        <span>
          Reassessments<br />Due
        </span>,
        'The count of clients that have a reassessment coming due in 30 days or less'
      )
      assertTitleAndTooltip(
        6,
        <span>
          Reassessments<br />Past Due
        </span>,
        'The count of clients that have a reassessment past due'
      )
    })
  })
})
