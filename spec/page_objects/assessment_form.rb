# frozen_string_literal: true

require 'page_objects/sections/app_globals'
require 'page_objects/sections/breadcrumbs'

class AssessmentGlobal < SitePrism::Section
  element :assessment_page_header, 'h1', text: 'CANS Assessment Form'
  element :reassessment_page_header, 'h1', text: 'CANS Reassessment Form'
  element :save_button, 'button', text: 'SAVE'
  element :print_button, 'button', text: 'PRINT'
  element :global_save_success_message_box, 'div.global-alert', text: 'Success! '\
                                            'CANS assessment has been saved'
  element :global_complete_message_box, 'div.global-alert', text: 'This assessment was completed '\
                                        'and is available for view only.'
end

class AssessmentFormHeader < SitePrism::Section
  element :child_name, 'span#child-name'
  element :child_dob, 'span#child-dob'
  element :child_age, 'span#child-age'
  element :date_field, 'input#assessment-date_input'
  element :enabled_date_field, 'input#assessment-date_input[aria-disabled="false"]'
  element :date_field_validation_msg, 'div.validation-error-line'
  element :calendar_icon, 'span.rw-i-calendar'
  element :calendar_cell_11, 'td.rw-cell', text: '11'
  element :conducted_by, 'input#conducted-by'
  element :case_or_referral, 'div#case-or-referral-number'
  element :has_caregiver_no_label, '#has-caregiver-no'
  element :has_caregiver_yes_label, '#has-caregiver-yes'
  element :has_caregiver_no_radio, '#input-has-caregiver-no', visible: false
  element :has_caregiver_yes_radio, '#input-has-caregiver-yes', visible: false
  element :authorization_label_yes, 'div#can-release-control label', text: 'Yes'
  element :authorization_label_no, 'div#can-release-control label', text: 'No'
  element :authorization_radio_yes, 'input#input-can-release-yes', visible: false
  element :authorization_radio_no, 'input#input-can-release-no', visible: false
  element :redaction_message, 'div.warning-text'
  element :redaction_message_0_to_5, 'div.warning-text', text: 'By selecting "No" item EC 41'\
    ' (Substance Use Disorder Item) from this CANS assessment will be redacted when printed.'
  element :redaction_message_6_to_21, 'div.warning-text', text: 'By selecting "No" items 8 and 48'\
    ' (Substance Use Disorder Items) from this CANS assessment will be redacted when printed.'
  element :age_0_to_5_button, 'button#age-0-5-button'
  element :age_0_to_5_button_selected, 'button#age-0-5-button.age-button-selected'
  element :age_6_to_21_button, 'button#age-6-21-button'
  element :age_6_to_21_button_selected, 'button#age-6-21-button.age-button-selected'
end

class AssessmentSummary < SitePrism::Section
  elements :summary_card_tips, '.data-grid-header-help-icon'
  element :summary_header_strengths, 'span', text: 'Strengths'
  elements :summary_columns, 'div.assessment-summary-card div.rt-tbody'
end

class AssessmentFormFooter < SitePrism::Section
  element :review_confirmation_checkbox, 'span.review-confirmation-label'
  element :complete_button, 'button#submit-assessment'

  def confirm_domains_review
    review_confirmation_checkbox.click
  end
end

class ReassessmentModal < SitePrism::Section
  element :title, '.cans-modal-body > .info-modal-title'
  element :start_new_button, 'button.modal-regular-button', text: 'Start new'
  element :use_previous_button, 'button.modal-regular-button', text: 'Use previous rating'

  def start_empty_reassessment
    start_new_button.click
  end

  def fill_reassessment_with_preceding_data
    use_previous_button.click
  end
end

class AssessmentForm < SitePrism::Page
  section :app_globals, AppGlobals, 'body'
  section :global, AssessmentGlobal, 'body'
  section :breadcrumbs, Breadcrumbs, '.breadcrumbs'
  section :header, AssessmentFormHeader, 'div.assessment-form-header-card'
  section :summary, AssessmentSummary, 'div.assessment-summary-card'
  section :footer, AssessmentFormFooter, 'div.form-footer'
  section :reassessment_modal, ReassessmentModal, 'div.reassessment-modal'
  element :assessment_card_title_0_5, 'div.assessment-card-title', text: 'Age Range 0-5'
  element :assessment_card_title_6_21, 'div.assessment-card-title', text: 'Age Range 6-21'
  element :ec41_title, 'h2', text: 'EC41'
  element :sub8_title, 'h2', text: '8. SUBSTANCE USE'
  element :sub48a_title, 'h2', text: '48a. SUBSTANCE USE'
  elements :collapsed_domain_headers, 'div[aria-expanded="false"] h2'
  elements :inner_items, '.item-expand-icon'
  elements :expanded_inner_items, 'svg[data-icon="chevron-down"].item-expand-icon'
  elements :process_counts, 'span.progress-value'
  elements :fully_filled_progress_bars, 'div[aria-valuenow="100"][role="progressbar"]'
  elements :domain_score_badges, 'span.domain-score-badge'
  element :challenges_domain, 'svg#domain5-expand'
  element :caregiver_domain, 'svg#domain11-expand'
  element :impulse_hyperactivity, '#IMPULSIVITY_HYPERACTIVITY-item-expand'
  element :expand_all_button, 'button', text: 'EXPAND ALL'
  element :collapse_all_button, 'button', text: 'COLLAPSE ALL'
  element :collapsed_chevron, 'div[aria-expanded="false"]'
  element :expanded_chevron, 'div[aria-expanded="true"]'
  elements :domain_bottom_chevron, 'div.domain-inner-collapse-icon-container svg'
  elements :item_bottom_chevron, 'div.item-inner-collapse-icon-container svg'
  elements :domain_level_reg_rating, 'div.item-reg-rating label'
  elements :domain_reg_radios, 'div.item-reg-rating input', visible: false
  elements :inner_item_rating, 'div.item-form-control label'
  elements :inner_item_radios, 'div.item-form-control input', visible: false
  elements :all_regular_ratings_1, 'div.item-reg-rating label', text: '1'
  elements :all_boolean_ratings_yes, 'div.item-bool-rating label', text: 'Yes'
  elements :discretion_checkbox, 'div.item-confidential-block label'
  elements :discretion_checkbox_inputs, 'div.item-confidential-block input', visible: false
  element :not_applicable_checkbox, 'label', text: 'N/A'
  element :not_applicable_text, 'h2', text: 'N/A'
  element :item_level_comment, 'div.item-comment-block textarea'
  element :domain_level_comment, 'div.domain-comment-block textarea'
  elements :domain_toolbar_comment_icon_block, 'div.domain-toolbar-comment-icon-block'
  elements :item_comment_icons, '.item-toolbar-comment-icon'
  element :item_description_header, 'h3', text: 'Item Description:'
  # Caregiver domain specific elements
  elements :caregiver_domain_headers, 'h2', text: 'Caregiver Resources And Needs Domain'
  element :caregiver_domain_substance_use_confidential_checkbox,
          '#SUBSTANCE_USE_CAREGIVERCheckbox input',
          visible: false
  element :add_caregiver_button, 'button[aria-label="add caregiver button"]'
  elements :caregiver_name_fields, 'input.caregiver-name'
  elements :caregiver_domains_first_item_labels, '#SUPERVISION-regular-rating label'
  elements :caregiver_domains_first_item_radios, '#SUPERVISION-regular-rating input', visible: false
  element :remove_first_caregiver_domain_button,
          'button[aria-label="remove caregiver button"]',
          match: :first
  element :caregiver_domain_warning_popup, 'div.warning-modal-body'
  element :caregiver_domain_warning_message, 'div.warning-modal-body div div'
  element :change_log_link, '.view-changelog-link'

  def review_all_domains_0_to_5
    targets = [
      'button#domain5-review',
      'button#domain6-review',
      'button#domain7-review',
      'button#domain8-review',
      'button#domain9-review',
      'button#domain10-review',
      'button#domain11-review',
      'button#domain12-review'
    ]
    targets.each do |element|
      find(element).click
      sleep 2
    end
  end

  def review_all_domains_6_to_21
    targets = [
      'button#domain0-review',
      'button#domain1-review',
      'button#domain2-review',
      'button#domain3-review',
      'button#domain4-review',
      'button#domain11-review',
      'button#domain12-review'
    ]
    targets.each do |element|
      find(element).click
      sleep 2
    end
  end
end

def fill_conducted_by_field(text)
  @form.header.conducted_by.set ''
  @form.header.conducted_by.set text
  expect(@form.header.conducted_by.value).to eq(text)
end

def check_case_or_referral_number
  expect(@form.header.case_or_referral.text).not_to be_empty
end

def click_0_to_5_button
  with_retry(proc { @form.header.age_0_to_5_button.click },
             proc { @form.header.wait_until_age_0_to_5_button_selected_visible(wait: 2) })
end

def click_6_to_21_button
  with_retry(proc { @form.header.age_6_to_21_button.click },
             proc { @form.header.wait_until_age_6_to_21_button_selected_visible(wait: 2) })
end

def expand_all_domains
  click_button('Expand All')
  expect(@form).to have_collapse_all_button
  expect(@form).to have_no_collapsed_chevron
end

def collapse_all_domains
  click_button('Collapse All')
  expect(@form).to have_expand_all_button
  expect(@form).to have_no_expanded_chevron
end

def fill_out_assessment_form_with_rating_1
  @form.all_regular_ratings_1.each(&:click)
  @form.all_boolean_ratings_yes.each(&:click)
end

def save_and_check_the_success_message
  @form.global.save_button.click
  expect(@form.global).to have_global_save_success_message_box
end

def validate_save_button
  expect(@form.global.save_button.disabled?).to be(true)
end

def print_assessment
  @form.global.print_button.click
end
