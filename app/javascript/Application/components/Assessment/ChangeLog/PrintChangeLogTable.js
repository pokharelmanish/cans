import React from 'react'
import PropTypes from 'prop-types'
import ChangeLogDate from './ChangeLogDate'
import ChangeLogComment from './ChangeLogComment'
import ChangeLogStatus from './ChangeLogStatus'
import ChangeLogName from './ChangeLogName'

const PrintChangeLogTable = ({ history }) => {
  const fontSize = '1.2rem'
  const textAlign = 'left'
  const normal = 'normal'
  const columnWidths = ['35rem', '15rem', '15rem', '35rem']
  const commentColWidth = 3

  return (
    <table className="print-change-log-table">
      <tr className="print-change-table-header">
        <th style={{ width: columnWidths[0], textAlign, fontSize }}>{'Date / Time Updated'}</th>
        <th style={{ width: columnWidths[1], textAlign, fontSize }}>{'Updated By'}</th>
        <th style={{ width: columnWidths[2], textAlign, fontSize }}>{'Change'}</th>
        <th style={{ width: columnWidths[commentColWidth], textAlign, fontSize }}>{'Comment'}</th>
      </tr>
      {history.map((record, index) => {
        return (
          <tr className="print-change-log-row" key={index}>
            <td
              style={{
                width: columnWidths[0],
                fontSize,
              }}
            >
              {<ChangeLogDate original={record} />}
            </td>
            <td
              style={{
                width: columnWidths[1],
                fontSize,
              }}
            >
              {<ChangeLogName original={record} />}
            </td>
            <td
              style={{
                width: columnWidths[2],
                fontSize,
              }}
            >
              {<ChangeLogStatus original={record} />}
            </td>
            <td
              style={{
                width: columnWidths[commentColWidth],
                fontSize,
                whiteSpace: normal,
              }}
            >
              {<ChangeLogComment original={record} />}
            </td>
          </tr>
        )
      })}
    </table>
  )
}

PrintChangeLogTable.propTypes = {
  history: PropTypes.array,
}

PrintChangeLogTable.defaultProps = {
  history: [],
}

export default PrintChangeLogTable
