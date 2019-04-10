import React from 'react'
import PropTypes from 'prop-types'
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, Cell, ResponsiveContainer } from 'recharts'
import { graphColors } from './comparisonGraphDataTransformations'

export const backupColor = () => {
  // this is a backup for the accident case that graphColors length shorter than amount of assessments
  // export this only for test purpose
  const base = 100000
  const multiple = 900000
  const colorCode = Math.floor(base + Math.random() * multiple)
  return `#${colorCode}`
}

const barColorGenerator = index => {
  return index + 1 > graphColors.length ? backupColor() : graphColors[index]
}

const ComparisonGraphInner = ({ domainBarsData, dates }) => {
  return (
    <ResponsiveContainer>
      <BarChart data={domainBarsData} className={'comparison-graph-barchart'} cursor="pointer">
        <CartesianGrid strokeDasharray="3 3" vertical={false} fill={'#f1f1f1'} />
        <XAxis dataKey="name" interval={0} />
        <YAxis padding={{ top: 20 }} />
        <Tooltip />
        <Legend verticalAlign="top" className={'comparison-graph-legend'} />
        {dates.map((date, index) => (
          <Bar dataKey={date} fill={barColorGenerator(index)} key={`bar-${date}`}>
            {domainBarsData.map(entry => <Cell cursor="pointer" key={`cell-${entry.name}`} />)}
          </Bar>
        ))}
      </BarChart>
    </ResponsiveContainer>
  )
}

ComparisonGraphInner.propTypes = {
  dates: PropTypes.array,
  domainBarsData: PropTypes.array,
}

ComparisonGraphInner.defaultProps = {
  dates: [],
  domainBarsData: [],
}

export default ComparisonGraphInner
