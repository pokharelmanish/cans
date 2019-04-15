import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardBody, CardFooter } from '@cwds/components'
import { getI18nByCode } from '../common/I18nHelper'
import Domain from './Domain'
import DomainsHeader from './DomainsHeader'

const AssessmentCard = ({
  actions,
  canReleaseConfidentialInfo,
  disabled,
  domainsExpanded,
  footer,
  i18n,
  isCompletedAssessment,
  isDomainsReviewed,
  isUnderSix,
  isUnifiedExpansion,
  isUsingPriorRatings,
  onExpandedChange,
  onExpandCollapseAll,
  previousRatingsMap,
}) => (
  <Card className="card assessment-card">
    <DomainsHeader
      isUnderSix={isUnderSix}
      isDomainsReviewed={isDomainsReviewed}
      isUnifiedExpansion={isUnifiedExpansion}
      expandCollapse={onExpandCollapseAll}
    />
    <CardBody>
      {domainsExpanded.map(({ domain, isExpanded }, index) => {
        const { id, code, caregiver_index: caregiverIndex } = domain
        const domainI18n = getI18nByCode(i18n, code)
        return (
          <Domain
            index={index}
            key={code + caregiverIndex + id}
            domain={domain}
            i18n={domainI18n}
            i18nAll={i18n}
            isAssessmentUnderSix={isUnderSix}
            isCompletedAssessment={isCompletedAssessment}
            isExpanded={isExpanded}
            isUsingPriorRatings={isUsingPriorRatings}
            canReleaseConfidentialInfo={canReleaseConfidentialInfo}
            onExpandedChange={onExpandedChange}
            onRatingUpdate={actions.onRatingUpdate}
            onItemCommentUpdate={actions.onItemCommentUpdate}
            onConfidentialityUpdate={actions.onConfidentialityUpdate}
            onAddCaregiverDomain={actions.onAddCaregiverDomain}
            onRemoveCaregiverDomain={actions.onRemoveCaregiverDomain}
            onCaregiverNameUpdate={actions.onCaregiverNameUpdate}
            onDomainCommentUpdate={actions.onDomainCommentUpdate}
            onDomainReviewed={actions.onDomainReviewed}
            handleWarningShow={actions.handleWarningShow}
            disabled={disabled}
            previousRatingsMap={previousRatingsMap}
          />
        )
      })}
    </CardBody>
    <CardFooter>{footer}</CardFooter>
  </Card>
)

AssessmentCard.propTypes = {
  actions: PropTypes.shape({
    onRatingUpdate: PropTypes.func.isRequired,
    onItemCommentUpdate: PropTypes.func.isRequired,
    onConfidentialityUpdate: PropTypes.func.isRequired,
    onAddCaregiverDomain: PropTypes.func.isRequired,
    onRemoveCaregiverDomain: PropTypes.func.isRequired,
    onCaregiverNameUpdate: PropTypes.func.isRequired,
    onDomainCommentUpdate: PropTypes.func.isRequired,
    onDomainReviewed: PropTypes.func.isRequired,
    handleWarningShow: PropTypes.func.isRequired,
  }).isRequired,
  canReleaseConfidentialInfo: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired,
  domainsExpanded: PropTypes.arrayOf(
    PropTypes.shape({
      domain: PropTypes.object.isRequired,
      isExpanded: PropTypes.bool.isRequired,
    })
  ),
  footer: PropTypes.node.isRequired,
  i18n: PropTypes.object.isRequired,
  isCompletedAssessment: PropTypes.bool.isRequired,
  isDomainsReviewed: PropTypes.bool.isRequired,
  isUnderSix: PropTypes.bool.isRequired,
  isUnifiedExpansion: PropTypes.bool,
  isUsingPriorRatings: PropTypes.bool.isRequired,
  onExpandCollapseAll: PropTypes.func,
  onExpandedChange: PropTypes.func,
  previousRatingsMap: PropTypes.object,
}

AssessmentCard.defaultProps = {
  domainsExpanded: [],
  isUnifiedExpansion: false,
  onExpandedChange: () => {},
  onExpandCollapseAll: () => {},
  previousRatingsMap: undefined,
}

export default AssessmentCard
