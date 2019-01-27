# frozen_string_literal: true

require 'acceptance_helper'
require 'feature'
require 'page_objects/assessment_form'
require 'page_objects/client_profile'
require 'page_objects/staff_dashboard'
require 'page_objects/assessment_changelog'

feature 'Case Worker Functionality' do
  current_date = Time.now.strftime('%m/%d/%Y')
  before(:all) do
    @form = AssessmentForm.new
    @staff_dash = StaffDashboard.new
    @client_profile = ClientProfile.new
  end
  before(:each) do
    @domain_total_count = []
    @total_radio_selected = []
  end

  after(:all) do
    logout
  end

  scenario 'Form Header, Domain, and Item common functionalities test' do
    login
    create_new_assessment(CLIENT_NAME)
    input_date_and_calendar_icon_test(current_date)
    fill_conducted_by_field('Mike Seaver')
    check_case_or_referral_number
    click_0_to_5_button
    expand_all_domains
    collapse_all_domains
    domain_and_item_rating_test
    discretion_and_not_applicable_checkbox_test
    item_and_domain_level_comment_test
    save_and_check_the_success_message
  end

  scenario 'Fill out and complete assessment from 0 to 5' do
    login
    fill_form_header_0_to_5
    expand_all_domains
    check_redacted_checkbox_0_to_5
    fill_out_assessment_form_and_check_domain_total
    check_all_progress_are_fully_filled
    warning_and_summary_card_shown_after_complete_button_clicked
    verify_the_tool_tip_of_summary_card
    verify_the_content_of_summary_card('0to5')
  end

  scenario 'Fill out and complete assessment from 6 to 21' do
    login
    fill_form_header_6_to_21
    expand_all_domains
    check_redacted_checkbox_6_to_21
    fill_out_assessment_form_and_check_domain_total
    check_all_progress_are_fully_filled
    click_complete_button_then_summary_card_shown
    verify_the_tool_tip_of_summary_card
    verify_the_content_of_summary_card('6to21')
  end

  scenario 'Case worker creates and deletes assessment' do
    login
    @assessment_changelog = AssessmentChangeLog.new
    create_new_assessment(CLIENT_NAME_2)
    verify_radio_buttons_on_assessment_header(current_date)
    validate_domain_radio_and_chevron
    save_and_check_the_success_message
    navigate_to_client_profile(CLIENT_NAME_2)
    validate_new_assessment(current_date)
    navigate_to_client_profile(CLIENT_NAME_2)
    view_cans_change_log_test(current_date, CLIENT_NAME_2)
    navigate_to_client_profile(CLIENT_NAME_2)
    delete_assessment_test(current_date)
  end

  scenario 'Case worker login, tests caregiver domain with new assessment and logs out' do
    login
    create_new_assessment(CLIENT_NAME)
    click_0_to_5_button
    expand_all_domains
    caregiver_domain_name_and_item_rating_test
    has_caregiver_domain_option_yes_to_no_test
    save_and_check_the_success_message
  end

  def validate_new_assessment(current_date)
    @client_profile.go_to_recently_updated_assessment(current_date)
    expect(@form.global).to have_assessment_page_header
  end

  def navigate_to_client_profile(client_name)
    @form.breadcrumbs.route_from_breadcrumbs(client_name)
    expect(@client_profile).to have_in_progress_record
  end

  def delete_assessment_test(current_date)
    @client_profile.recent_assessment_ellipsis_icon.click
    @client_profile.delete_cans_button.click
    expect(@client_profile.app_globals.delete_warning_modal['style']).to eq('display: block;')
    @form.app_globals.cancel_button_of_warning.click
    expect(@client_profile.app_globals).to have_no_warning_modal_heading
    @client_profile.recent_assessment_ellipsis_icon.click
    @client_profile.delete_cans_button.click
    @form.app_globals.agree_button_of_warning.click
    expect(@client_profile.is_assessment_deleted?(current_date)).to be(true)
  end

  def view_cans_change_log_test(current_date, client_name)
    @client_profile.recent_assessment_ellipsis_icon.click
    @client_profile.cans_change_log_button.click
    expect(@assessment_changelog.is_client_name?(client_name)).to be(true)
    expect(@assessment_changelog.is_assessment?(current_date)).to be(true)
  end

  def verify_radio_buttons_on_assessment_header(current_date)
    click_0_to_5_button
    expect(@form.header).to have_redaction_message
    expect(@form.header.date_field.value).to eq(current_date)
    expect(@form.header).to have_conducted_by
    check_case_or_referral_number
    expect(@form).to have_assessment_card_title_0_5
    expect(@form).to have_caregiver_domain_headers
    @form.caregiver_domain.click
    expect(@form.header.authorization_radio_no.checked?).to be(true)
    expect(@form.header.has_caregiver_yes_radio.checked?).to be(true)
    expect(@form.caregiver_domain_substance_use_confidential_checkbox.checked?).to be(true)
  end

  def validate_domain_radio_and_chevron
    @form.challenges_domain.click
    @form.impulse_hyper_activity.click
    @form.impulse_hyper_activity_input.click
    expect(@form).to have_item_description_header
    @form.impulse_hyper_activity.click
    expect(@form).to have_no_item_description_header
    progress_bar_value = page.all('span.progress-value', match: :first).map(&:text)
    progress_bar_value.each { |element| @total_radio_selected.push(element) }
    expect(progress_bar_value).to eq(@total_radio_selected)
  end

  def create_new_assessment(client_name)
    @staff_dash.client_link(client_name).text eq(client_name)
    @staff_dash.visit_client_profile(client_name)
    expect(@client_profile).to have_add_cans_link
    @client_profile.add_cans_link.click
    expect(@form.global).to have_assessment_page_header
  end

  def input_date_and_calendar_icon_test(current_date)
    @form.header.date_field.click
    @form.header.date_field.native.clear # avoid stuck
    @form.header.date_field.native.clear
    new_date = Time.now.strftime('%m/11/%Y')
    @form.header.date_field.set current_date
    expect(@form.header.date_field.value).to eq(current_date)
    @form.header.calendar_icon.click
    @form.header.calendar_cell_11.click
    expect(@form.header.date_field.value).to eq(new_date)
    @form.header.date_field.native.clear
    @form.header.date_field.set current_date
  end

  def domain_and_item_rating_test
    @form.collapsed_domain_headers[0].click
    expect(@form).to have_domain_level_reg_rating
    target_domain_reg_radios = @form.domain_reg_radios[0, 4]
    @form.domain_level_reg_rating[0, 4].each_with_index do |label, index|
      label.click
      expect(target_domain_reg_radios[index].checked?).to be(true)
    end
    @form.inner_items[0].click
    expect(@form).to have_inner_item_rating
    @form.inner_item_rating.each_with_index do |label, index|
      label.click
      expect(@form.inner_item_radios[index].checked?).to be(true)
      expect(target_domain_reg_radios[index].checked?).to be(true)
    end
  end

  def discretion_and_not_applicable_checkbox_test
    discretion_checkbox_input = @form.discretion_checkbox_inputs[0]
    @form.discretion_checkbox[0].click
    expect(discretion_checkbox_input.checked?).to be(true)
    @form.discretion_checkbox[0].click
    expect(discretion_checkbox_input.checked?).to be(false)
    @form.not_applicable_checkbox.click
    within(@form.not_applicable_checkbox) do
      expect(find('input', visible: false).checked?).to be(true)
    end
    not_applicable_radio_group = @form.not_applicable_text.sibling('div.item-reg-rating')
    within(not_applicable_radio_group) do
      not_applicable_radios = page.all('input', visible: false)
      not_applicable_radios.each do |radio|
        expect(radio.disabled?).to be(true)
      end
    end
    @form.not_applicable_checkbox.click
    within(@form.not_applicable_checkbox) do
      expect(find('input', visible: false).checked?).to be(false)
    end
  end

  def item_and_domain_level_comment_test
    item_comment_content = 'some item level comments'
    @form.item_level_comment.set item_comment_content
    expect(@form.item_level_comment.value).to eq(item_comment_content)
    expect(page.has_content?("#{item_comment_content.length}/250")).to be(true)
    item_comment_label = @form.item_level_comment.sibling('label')
    within item_comment_label do
      expect(find('svg')[:class].include?('comment-icon-solid')).to be(true)
    end
    domain_comment_content = 'some domain level comments'
    @form.inner_items[-1].click
    @form.domain_level_comment.set domain_comment_content
    expect(@form.domain_level_comment.value).to eq(domain_comment_content)
    expect(page.has_content?("#{domain_comment_content.length}/2500")).to be(true)
    domain_comment_label = @form.domain_level_comment.sibling('label')
    within domain_comment_label do
      expect(find('svg')[:class].include?('comment-icon-solid')).to be(true)
    end
    within @form.domain_toolbar_comment_icon_block[0] do
      expect(find('svg')[:class].include?('comment-icon-solid')).to be(true)
    end
  end

  def fill_form_header_0_to_5
    create_new_assessment(CLIENT_NAME)
    fill_conducted_by_field('')
    expect(@form.header).to have_redaction_message
    click_0_to_5_button
    expect(@form.header.age_0_to_5_button[:class].include?('age-button-selected')).to be(true)
    expect(@form).to have_assessment_card_title_0_5
  end

  def fill_form_header_6_to_21
    create_new_assessment(CLIENT_NAME)
    fill_conducted_by_field('')
    @form.header.authorization_label_yes.click
    expect(@form.header).to have_no_redaction_message
    @form.header.age_6_to_21_button.click
    expect(@form.header.age_6_to_21_button[:class].include?('age-button-selected')).to be(true)
    expect(@form).to have_assessment_card_title_6_21
  end

  def check_redacted_checkbox_0_to_5
    within @form.ec41_title.sibling('h2.item-confidential-checkbox') do
      ec41_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(ec41_checkbox.checked?).to be(true)
      expect(ec41_checkbox.disabled?).to be(true)
    end
    @form.header.authorization_label_yes.click
    within @form.ec41_title.sibling('h2.item-confidential-checkbox') do
      ec41_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(ec41_checkbox.checked?).to be(true)
      expect(ec41_checkbox.disabled?).to be(false)
    end
    @form.header.authorization_label_no.click
  end

  def check_redacted_checkbox_6_to_21
    within @form.sub7_title.sibling('h2.item-confidential-checkbox') do
      sub7_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(sub7_checkbox.checked?).to be(true)
      expect(sub7_checkbox.disabled?).to be(false)
    end
    within @form.sub48a_title.sibling('h2.item-confidential-checkbox') do
      sub48a_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(sub48a_checkbox.checked?).to be(true)
      expect(sub48a_checkbox.disabled?).to be(false)
    end
    @form.header.authorization_label_no.click
    within @form.sub7_title.sibling('h2.item-confidential-checkbox') do
      sub7_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(sub7_checkbox.checked?).to be(true)
      expect(sub7_checkbox.disabled?).to be(true)
    end
    within @form.sub48a_title.sibling('h2.item-confidential-checkbox') do
      sub48a_checkbox = find('input[type = "checkbox"]', visible: false)
      expect(sub48a_checkbox.checked?).to be(true)
      expect(sub48a_checkbox.disabled?).to be(true)
    end
    @form.header.authorization_label_yes.click
  end

  def fill_out_assessment_form_and_check_domain_total
    fill_out_assessment_form_with_rating_1
    all_items_amount = @form.process_counts.map(&:text)
    all_items_amount.each { |element| @domain_total_count.push(element.split('/')[1]) }
    change_some_rating_to_mixed_value
    adjust_domain_total_count
    collapse_all_domains
    domain_totals = @form.domain_score_badges.map(&:text)
    expect(domain_totals).to eq(@domain_total_count)
  end

  def check_all_progress_are_fully_filled
    domain_amount = @form.collapsed_domain_headers.length
    expect(@form.fully_filled_progress_bars.length).to eq(domain_amount)
  end

  def change_some_rating_to_mixed_value
    targets = [
      '#label-IMPULSIVITY_HYPERACTIVITY-0',
      '#label-ANXIETY-2',
      '#label-OPPOSITIONAL-3',
      '#label-SEXUAL_ABUSE-0'
    ]
    targets.each { |element| find(element).click }
  end

  def adjust_domain_total_count
    @domain_total_count[0] = (@domain_total_count[0].to_i + 2).to_s
    @domain_total_count[-1] = (@domain_total_count[-1].to_i - 1).to_s
  end

  def warning_and_summary_card_shown_after_complete_button_clicked
    expect(@form.header.authorization_radio_no.checked?).to be(true)
    @form.footer.complete_button.click
    expect(@form.app_globals.complete_warning_modal['style']).to eq('display: block;')
    @form.app_globals.cancel_button_of_warning.click
    expect(@form.global).to have_assessment_page_header
    expect(@form.footer).to have_complete_button
    @form.footer.complete_button.click
    @form.app_globals.agree_button_of_warning.click
    expect(@form.global).to have_global_complete_message_box
    expect(@form).to have_summary
  end

  def click_complete_button_then_summary_card_shown
    expect(@form.header.authorization_radio_yes.checked?).to be(true)
    @form.footer.complete_button.click
    expect(@form.global).to have_global_complete_message_box
    expect(@form.app_globals).to have_no_complete_warning_modal
    expect(@form).to have_summary
  end

  def verify_the_tool_tip_of_summary_card
    first_tip = @form.summary.summary_card_tips[0]
    tip_text = 'Ratings of 0 or 1 in the Strengths Domain. These are central or useful in planning.'
    @form.summary.summary_header_strengths.click # avoid stuck
    first_tip.hover
    expect(page).to have_content(tip_text)
  end

  def verify_the_content_of_summary_card(age_range)
    summary_cols_content = @form.summary.summary_columns.map(&:text)
    @strengths_column_text =
      if age_range == '0to5'
        ['Family Spiritual/Religious', 'Family Strengths', 'Interpersonal', 'Natural Supports',
         'Playfulness', 'Relationship Permanence', 'Resiliency']
      else
        ['Community Life', 'Cultural Identity', 'Educational Setting', 'Family Strengths',
         'Interpersonal', 'Natural Supports', 'Resiliency', 'Spiritual/Religious',
         'Talents and Interests']
      end
    action_required_column_text = ['Anxiety']
    immediate_action_required_column_text = ['Oppositional (Non-compliance with Authority)']
    trauma_column_text = ['Physical Abuse', 'Emotional Abuse', 'Neglect', 'Medical Trauma',
                          'Witness to Family Violence', 'Witness to Community/School Violence',
                          'Natural or Manmade Disaster', 'War/Terrorism Affected',
                          'Victim/Witness to Criminal Activity',
                          'Disruptions in Caregiving/Attachment Losses',
                          'Parental Criminal Behaviors']
    expect(summary_cols_content.length).to be(4)
    expect(summary_cols_content[0].split(/\r\n|\n|\r/)).to eq(@strengths_column_text)
    expect(summary_cols_content[1].split(/\r\n|\n|\r/)).to eq(action_required_column_text)
    expect(summary_cols_content[2].split(/\r\n|\n|\r/)).to eq(immediate_action_required_column_text)
    expect(summary_cols_content[3].split(/\r\n|\n|\r/)).to eq(trauma_column_text)
  end

  def caregiver_domain_name_and_item_rating_test
    @form.add_caregiver_button.click
    expect(@form.caregiver_name_fields.length).to eq(2)
    @form.caregiver_name_fields[0].set 'Caregiver One'
    @form.caregiver_name_fields[0].set 'Awesome Caregiver'
    expect(@form.caregiver_name_fields[0].value).to eq('Awesome Caregiver')
    expect(@form.caregiver_domain_headers[0].text).to include('Awesome Caregiver')
    @form.caregiver_domains_first_item_labels[1].click
    expect(@form.caregiver_domains_first_item_radios[1].checked?).to be(true)
    @form.caregiver_name_fields[0].set ''
    expect(@form.caregiver_name_fields[0].value).to eq('')
    @form.remove_first_caregiver_domain_button.click
    expect(@form).to have_caregiver_domain_warning_popup
    expect(@form.caregiver_domain_warning_message.text).to eq(CAREGIVER_DOMAIN_WARNING_MESSAGE)
    expect(@form.app_globals).to have_agree_button_of_warning
    @form.app_globals.agree_button_of_warning.click
    expect(@form.caregiver_name_fields.length).to eq(1)
  end

  def has_caregiver_domain_option_yes_to_no_test
    expect(@form.caregiver_name_fields.length).to eq(1)
    @form.header.has_caregiver_no_label.click
    expect(@form).to have_caregiver_domain_warning_popup
    expect(@form.caregiver_domain_warning_message.text).to eq(CAREGIVER_DOMAIN_WARNING_MESSAGE)
    expect(@form.app_globals).to have_cancel_button_of_warning
    @form.app_globals.cancel_button_of_warning.click
    expect(@form.caregiver_name_fields.length).to eq(1)
    expect(@form.header.has_caregiver_yes_radio.checked?).to be(true)
    @form.header.has_caregiver_no_label.click
    expect(@form).to have_caregiver_domain_warning_popup
    expect(@form.caregiver_domain_warning_message.text).to eq(CAREGIVER_DOMAIN_WARNING_MESSAGE)
    expect(@form.app_globals).to have_agree_button_of_warning
    @form.app_globals.agree_button_of_warning.click
    expect(@form.caregiver_name_fields.length).to eq(0)
    expect(@form.header.has_caregiver_no_radio.checked?).to be(true)
  end
end
