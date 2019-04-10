import React from 'react'
import PropTypes from 'prop-types'
import ComparisonGraphInner from './ComparisonGraphInner'
import { datesGenerator, domainBarsDataGenerator } from './comparisonGraphDataTransformations'

const ComparisonGraph = props => {
  const { data, i18n } = props
  const graphDates = [...data.event_dates]
  return (
    <ComparisonGraphInner
      dates={datesGenerator(graphDates)}
      domainBarsData={domainBarsDataGenerator(graphDates, data.domains, i18n)}
    />
  )
}

ComparisonGraph.propTypes = {
  data: PropTypes.shape({
    event_dates: PropTypes.array,
    domains: PropTypes.array,
  }),
  i18n: PropTypes.object,
}

ComparisonGraph.defaultProps = {
  i18n: {},
  data: null,
}

export default ComparisonGraph
