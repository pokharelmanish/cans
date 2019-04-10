import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid } from '@cwds/components'
import { gridMinRows } from '../../../../util/DataGridHelper'
import ComparisonInnerTable from './ComparisonInnerTable'
import ComparisonOuterTableHeader from './ComparisonOuterTableHeader'
import {
  CP_TABLE_COL_WIDTHS,
  getTitle,
  expander,
  blankColFiller,
  requiredDomainColumnsAmount,
  domainRatingSwitcher,
} from './comparisonTableHelper'
import '../style.sass'

class ComparisonOuterTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  domainTotalColsGenerator = assessmentDates => {
    return assessmentDates.map((el, index) => {
      const dateInfo = this.props.data.event_dates
      return {
        id: `domain-assessment-${index}`,
        Header: (
          <ComparisonOuterTableHeader date={dateInfo[index].event_date} status={dateInfo[index].assessment_status} />
        ),
        accessor: domain => {
          const ratingTotal = domain.domain_ratings[index].value
          const type = domain.items[0].item_ratings[0].type
          return domainRatingSwitcher(ratingTotal, type)
        },
        className: 'item-rating ',
      }
    })
  }

  renderSubComponent = props => {
    const assessmentDates = this.props.data.event_dates
    return (
      <ComparisonInnerTable
        key={`inner-table-${props.original.code}`}
        domainCode={props.original.code}
        items={props.original.items}
        assessmentDates={assessmentDates}
        i18n={this.props.i18n}
      />
    )
  }

  render() {
    if (!this.props.data) {
      return null
    }
    const assessmentDates = this.props.data.event_dates
    const domainNameCol = {
      id: 'domainName',
      width: CP_TABLE_COL_WIDTHS.DOMAIN_NAME,
      Header: 'Domain Name',
      sortable: true,
      accessor: domain => {
        const domainTitle = getTitle(this.props.i18n, domain.code)
        return domainTitle
      },
    }
    const domainTotalCols = this.domainTotalColsGenerator(assessmentDates)
    blankColFiller(domainTotalCols, 'domain', requiredDomainColumnsAmount)
    const domainCmparisonTableTemplate = [expander, domainNameCol, ...domainTotalCols]
    const domains = this.props.data.domains

    return (
      <DataGrid
        columns={domainCmparisonTableTemplate}
        data={domains}
        sortable={false}
        minRows={gridMinRows(domains)}
        noDataText={'No records found'}
        showPaginationBottom={false}
        defaultPageSize={50}
        SubComponent={this.renderSubComponent}
        className={'comparison-grid'}
      />
    )
  }
}

ComparisonOuterTable.propTypes = {
  data: PropTypes.shape({
    event_dates: PropTypes.array,
    domains: PropTypes.array,
  }),
  i18n: PropTypes.object,
}

ComparisonOuterTable.defaultProps = {
  i18n: {},
  data: null,
}

export default ComparisonOuterTable
