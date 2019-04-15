import React from 'react'
import PropTypes from 'prop-types'
import { domainComment, domainContainer, domainCommentContent } from './PrintAssessmentStyle'
import { getI18nByCode } from '../../common/I18nHelper'
import PrintItem from './PrintItem'
import PrintDomainHeader from './PrintDomainHeader'
import PrintDomainCommentHeader from './PrintDomainCommentHeader'
import { totalScoreCalculation } from '../../Assessment/DomainScoreHelper.js'
import { shouldItemBeRendered } from '../../Assessment/AssessmentHelper'
import { isConfidential, isDiscretionNeeded } from './PrintAssessmentHelper'

const hasConfidentialItems = domain => domain.items.filter(isConfidential).length > 0
const hasDiscretionNeededItems = domain => domain.items.filter(isDiscretionNeeded).length > 0
const getTotalScore = (domain, items) => {
  let result
  if (hasConfidentialItems(domain)) return 'Confidential'
  if (hasDiscretionNeededItems(domain)) {
    result = 'Discretion Needed'
  } else {
    result = totalScoreCalculation(items)
  }
  return result
}

const PrintDomain = props => {
  const { domain, domainI18n, i18n, isAssessmentUnderSix } = props
  const { code, caregiver_index: caregiverIndex, items, comment } = domain
  const title = domainI18n._title_ || ''
  const caregiverName = domain.caregiver_name || ''
  const displayCaregiverName = caregiverName && `- ${caregiverName}`
  const totalScore = getTotalScore(domain, items)
  return (
    <div key={code + caregiverIndex} style={domainContainer}>
      <div>
        <PrintDomainHeader text={`${title} ${displayCaregiverName}`} total={totalScore} />
      </div>
      <div>
        {items.map((item, index) => {
          if (!shouldItemBeRendered(isAssessmentUnderSix, item)) return null
          const itemI18n = getI18nByCode(i18n, item.code)
          const printItemProps = {
            item,
            index,
            caregiverIndex,
            itemI18n,
            isAssessmentUnderSix,
          }
          return <PrintItem key={`item-${index}`} {...printItemProps} />
        })}
      </div>
      <div>
        {comment &&
          !hasConfidentialItems(domain) && (
            <div style={domainComment}>
              <PrintDomainCommentHeader text={`${title} ${displayCaregiverName}`} />
              <div style={domainCommentContent}>{comment}</div>
            </div>
          )}
      </div>
    </div>
  )
}

PrintDomain.propTypes = {
  domain: PropTypes.object.isRequired,
  domainI18n: PropTypes.object.isRequired,
  i18n: PropTypes.object.isRequired,
  isAssessmentUnderSix: PropTypes.bool.isRequired,
}

export default PrintDomain
