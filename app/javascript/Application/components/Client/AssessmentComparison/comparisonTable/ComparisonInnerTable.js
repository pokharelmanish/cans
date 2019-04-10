import React from 'react'
import PropTypes from 'prop-types'
import { DataGrid, Icon } from '@cwds/components'
import { gridMinRows } from '../../../../util/DataGridHelper'
import {
  CP_TABLE_COL_WIDTHS,
  getTitle,
  expanderPlaceHolder,
  blankColFiller,
  requiredDomainColumnsAmount,
  itemRatingSwitcher,
} from './comparisonTableHelper'
import '../style.sass'

class ComparisonInnerTable extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {}
  }

  itemRatingColsGenerator = () => {
    const upIcon = <Icon icon="arrow-up" size="sm" className="icon-margin" />
    const downIcon = <Icon icon="arrow-up" size="sm" rotation={180} className="icon-margin" />
    return this.props.assessmentDates.map((el, index) => {
      return {
        id: `item-assessment-${index}`,
        accessor: item => {
          const itemRatings = item.item_ratings
          const trend = itemRatings[index].trend
          const itemSymbolGenerator = trend === 'UP' ? upIcon : '' || trend === 'DOWN' ? downIcon : ''
          const type = item.item_ratings[index].type
          const itemClassName = itemSymbolGenerator !== '' ? 'item-trending-indicator' : ''
          return (
            <span className={itemClassName}>
              {itemRatingSwitcher(itemRatings, index, type)} {itemSymbolGenerator}
            </span>
          )
        },
        className: 'item-rating',
        headerClassName: 'text-center',
      }
    })
  }

  render() {
    const itemNameCol = {
      id: 'itemName',
      width: CP_TABLE_COL_WIDTHS.ITEM_NAME,
      accessor: item => getTitle(this.props.i18n, item.code),
      className: 'inner-item-name-content',
    }

    const itemRatingCols = this.itemRatingColsGenerator()
    blankColFiller(itemRatingCols, 'item', requiredDomainColumnsAmount)
    const itemComparisonTableTemplate = [expanderPlaceHolder, itemNameCol, ...itemRatingCols]
    const { items, domainCode } = this.props
    const TheadComponent = () => null

    return (
      <DataGrid
        key={domainCode}
        columns={itemComparisonTableTemplate}
        data={items}
        sortable={false}
        minRows={gridMinRows(items)}
        noDataText={'No records found'}
        TheadComponent={TheadComponent}
        defaultPageSize={50}
        showPaginationBottom={false}
        className={'inner-table'}
      />
    )
  }
}

ComparisonInnerTable.propTypes = {
  assessmentDates: PropTypes.array.isRequired,
  domainCode: PropTypes.string.isRequired,
  i18n: PropTypes.object,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      code: PropTypes.string.isRequired,
      item_ratings: PropTypes.array.isRequired,
    })
  ).isRequired,
}

ComparisonInnerTable.defaultProps = {
  i18n: {},
}

export default ComparisonInnerTable
