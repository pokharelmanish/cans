import React from 'react'
import PropTypes from 'prop-types'
import { domainComment, domainContainer, domainCommentContent } from './PrintAssessmentStyle'
import { getI18nByCode } from '../../common/I18nHelper'
import PrintItem from './PrintItem'
import PrintDomainHeader from './PrintDomainHeader'
import PrintDomainCommentHeader from './PrintDomainCommentHeader'
import { totalScoreCalculation } from '../../Assessment/DomainScoreHelper.js'
import { shouldItemBeRendered } from '../../Assessment/AssessmentHelper'
import { isConfidential, isDiscretionNeeded, redactLevels } from './PrintAssessmentHelper'

const hasConfidentialItems = domain => domain.items.filter(isConfidential).length > 0
const hasDiscretionNeededItems = domain => domain.items.filter(isDiscretionNeeded).length > 0
const shouldShowConfidentialLabel = (domain, redactLevel) =>
  (redactLevel === redactLevels.all || redactLevel === redactLevels.confidential) && hasConfidentialItems(domain)
const shouldShowDiscretionLabel = (domain, redactLevel) =>
  (redactLevel === redactLevels.all || redactLevel === redactLevels.discrationNeeded) &&
  hasDiscretionNeededItems(domain)
const getTotalScore = (domain, items, redactLevel) => {
  if (shouldShowConfidentialLabel(domain, redactLevel)) return 'Confidential'
  if (shouldShowDiscretionLabel(domain, redactLevel)) return 'Discretion Needed'
  return totalScoreCalculation(items)
}
const commentRemark = comment => {
  return comment ? '' : 'None'
}

const PrintDomain = props => {
  const { domain, domainI18n, i18n, isAssessmentUnderSix, redactLevel } = props
  const { code, caregiver_index: caregiverIndex, items, comment } = domain
  const title = domainI18n._title_ || ''
  const caregiverName = domain.caregiver_name || ''
  const displayCaregiverName = caregiverName && `- ${caregiverName}`
  const totalScore = getTotalScore(domain, items, redactLevel)
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
            redactLevel,
          }
          return <PrintItem key={`item-${index}`} {...printItemProps} />
        })}
      </div>
      <div>
        <PrintDomainCommentHeader text={`${title} ${displayCaregiverName}`} remark={commentRemark(comment)} />
        {comment &&
          (!hasConfidentialItems(domain) || redactLevel === redactLevels.doNotRedact) && (
            <div style={domainComment}>
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
  redactLevel: PropTypes.oneOf([
    redactLevels.all,
    redactLevels.discrationNeeded,
    redactLevels.confidential,
    redactLevels.doNotRedact,
  ]),
}

PrintDomain.defaultProps = {
  redactLevel: redactLevels.all,
}

export default PrintDomain
