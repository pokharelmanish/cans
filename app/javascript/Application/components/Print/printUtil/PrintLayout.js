import React from 'react'
import PropTypes from 'prop-types'

const PrintLayout = props => {
  return (
    <table className="print-container">
      <thead className="print-header">
        <tr>
          <th className="header-content">
            <div className="top-cover" />
            {props.header}
          </th>
        </tr>
      </thead>
      <tfoot className="print-footer">
        <tr>
          <th>
            <p />
            <div className="bottom-cover">{props.footer}</div>
          </th>
        </tr>
      </tfoot>

      <tbody>
        <tr>
          <th>
            <div className="content">{props.children}</div>
          </th>
        </tr>
      </tbody>
    </table>
  )
}

PrintLayout.propTypes = {
  children: PropTypes.node.isRequired,
  footer: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  header: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
}

PrintLayout.defaultProps = {
  header: '',
  footer: '',
}

export default PrintLayout
