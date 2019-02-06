# frozen_string_literal: true

require 'page_objects/sections/app_globals'
require 'page_objects/sections/breadcrumbs'

class AssessmentGlobal < SitePrism::Section
  element :assessment_page_header, 'h1', text: 'CANS Communimetric Assessment Form'
  element :save_button, 'div.header-buttons-block i.fa-save'
  element :global_save_success_message_box, 'div.global-alert', text: 'Success! '\
                                            'CANS assessment has been saved'
  element :global_complete_message_box, 'div.global-alert', text: 'This assessment was completed '\
                                        'and is available for view only.'
end

class AssessmentFormHeader < SitePrism::Section
  element :child_name, 'span#child-name'
  element :date_field, 'input#assessment-date_input'
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
  element :age_0_to_5_button, 'button#age-0-5-button'
  element :age_0_to_5_button_selected, 'button#age-0-5-button.age-button-selected'
  element :age_6_to_21_button, 'button#age-6-21-button'
  element :age_6_to_21_button_selected, 'button#age-6-21-button.age-button-selected'
end

class AssessmentSummary < SitePrism::Section
  elements :summary_card_tips, 'i.assessment-summary-help-icon'
  element :summary_header_strengths, 'span', text: 'Strengths'
  elements :summary_columns, 'div.assessment-summary-card div.rt-tbody'
end

class AssessmentFormFooter < SitePrism::Section
  element :complete_button, 'button#submit-assessment'
end

class AssessmentForm < SitePrism::Page
  section :app_globals, AppGlobals, 'body'
  section :global, AssessmentGlobal, 'body'
  section :breadcrumbs, Breadcrumbs, 'div.breadcrumb-container'
  section :header, AssessmentFormHeader, 'div.assessment-header-date'
  section :summary, AssessmentSummary, 'div.assessment-summary-card'
  section :footer, AssessmentFormFooter, 'div.form-footer'
  element :assessment_card_title_0_5, 'div.assessment-card-title', text: 'Age Range 0-5'
  element :assessment_card_title_6_21, 'div.assessment-card-title', text: 'Age Range 6-21'
  element :ec41_title, 'h2', text: 'EC41'
  element :sub7_title, 'h2', text: '7. SUBSTANCE USE'
  element :sub48a_title, 'h2', text: '48a. SUBSTANCE USE'
  elements :collapsed_domain_headers, 'div[aria-expanded="false"] h2'
  elements :inner_items, 'i.item-expand-icon'
  elements :process_counts, 'span.progress-value'
  elements :fully_filled_progress_bars, 'div[aria-valuenow="100"][role="progressbar"]'
  elements :domain_score_badges, 'span.domain-score-badge'
  element :challenges_domain, 'svg#domain5-expand'
  element :caregiver_domain, 'svg#domain11-expand'
  element :impulse_hyper_activity, 'i#IMPULSIVITY_HYPERACTIVITY-item-expand'
  element :impulse_hyper_activity_input, '#input-IMPULSIVITY_HYPERACTIVITY-0-select'
  element :expand_all_button, 'button', text: 'EXPAND ALL'
  element :collapse_all_button, 'button', text: 'COLLAPSE ALL'
  element :collapsed_chevron, 'div[aria-expanded="false"]'
  element :expanded_chevron, 'div[aria-expanded="true"]'
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
  elements :item_comment_icons, 'svg.item-toolbar-comment-icon'
  element :item_description_header, 'h1', text: 'Item Description:'
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
end

def fill_conducted_by_field(text)
  @form.header.conducted_by.set text
  expect(@form.header.conducted_by.value).to eq(text)
end

def check_case_or_referral_number
  expect(@form.header.case_or_referral.text).not_to be_empty
end

def click_0_to_5_button
  with_retry(Proc.new { @form.header.age_0_to_5_button.click },
             Proc.new { @form.header.wait_until_age_0_to_5_button_selected_visible(wait: 2) })
end

def click_6_to_21_button
  with_retry(Proc.new { @form.header.age_6_to_21_button.click },
             Proc.new { @form.header.wait_until_age_6_to_21_button_selected_visible(wait: 2) })
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
