import { calculateDateDifferenceInYears, getCurrentIsoDate } from '../../util/dateHelper'
import { clone } from '../../util/common'
import { shouldDomainBeRendered, shouldItemBeRendered } from './AssessmentHelper'
import { isNARating } from './Item/ItemHelper'

export const prepareReassessment = (assessment, precedingAssessment, previousRatingsMap) => {
  const reassessment = clone(assessment)
  reassessment.can_release_confidential_info = false
  reassessment.state.under_six = isReassessmentUnderSix(assessment.person.dob)
  prepareCaregiverDomains(reassessment, precedingAssessment)
  reassessment.state.domains.forEach(domain => {
    const caregiverIndex = domain.caregiver_index
    domain.items.forEach(item => {
      const previousRatingAndConfidential = previousRatingsMap[buildItemUniqueKey(item.code, caregiverIndex)]
      prepareItemForReassessment(item, previousRatingAndConfidential)
    })
  })
  return reassessment
}

export const isReassessmentUnderSix = dob => {
  const SIX = 6
  return calculateDateDifferenceInYears(dob, getCurrentIsoDate()) < SIX
}

export const prepareCaregiverDomains = (reassessment, precedingAssessment) => {
  const precedingCaregiverDomains = precedingAssessment.state.domains.filter(domain => domain.is_caregiver_domain)
  reassessment.has_caregiver = Boolean(precedingCaregiverDomains.length)
  const domains = reassessment.state.domains
  const initialCaregiverDomainIndex = -2
  const insertCaregiverDomainIndex = -1
  domains.splice(initialCaregiverDomainIndex, 1)
  precedingCaregiverDomains.forEach(precedingDomain => {
    const newCaregiverDomain = clone(reassessment.state.caregiver_domain_template)
    newCaregiverDomain.caregiver_index = precedingDomain.caregiver_index
    newCaregiverDomain.caregiver_name = precedingDomain.caregiver_name
    domains.splice(insertCaregiverDomainIndex, 0, newCaregiverDomain)
  })
}

export const prepareItemForReassessment = (item, previousRatingAndConfidential) => {
  if (!previousRatingAndConfidential) {
    return
  }
  const itemRating =
    item.has_na_option && isNARating(previousRatingAndConfidential.rating)
      ? item.rating
      : previousRatingAndConfidential.rating
  const itemConfidential = item.confidential_by_default
    ? item.confidential_by_default
    : previousRatingAndConfidential.confidential
  if (previousRatingAndConfidential) {
    item.rating = itemRating
    item.confidential = itemConfidential
  }
}

export const buildItemUniqueKey = (code, caregiverIndex) => `${code}${caregiverIndex || ''}`

export function createRatingsMap(assessment) {
  const codeToRatingMap = {}
  const { domains, under_six: underSix } = assessment.state
  domains.filter(domain => shouldDomainBeRendered(underSix, domain)).forEach(domain =>
    domain.items.filter(item => shouldItemBeRendered(underSix, item)).forEach(item => {
      const key = buildItemUniqueKey(item.code, domain.caregiver_index)
      codeToRatingMap[key] = {
        rating: item.rating,
        confidential: item.confidential,
      }
    })
  )
  return codeToRatingMap
}

export const containsNotReviewedDomains = (domains, isUnderSix) => {
  return Boolean(domains.find(domain => shouldDomainBeRendered(isUnderSix, domain) && !domain.is_reviewed))
}

export const hasOneCompletedForReassessment = (assessments, clientCaseReferralNumber) => {
  if (!assessments || assessments.length === 0 || !clientCaseReferralNumber) return false
  return (
    assessments.filter(
      assessment => assessment.status === 'COMPLETED' && assessment.service_source_id === clientCaseReferralNumber
    ).length > 0
  )
}
