# frozen_string_literal: true

require 'page_objects/sections/app_globals'

class ClientProfile < SitePrism::Page
  section :app_globals, AppGlobals, 'body'
  element :client_information_title, 'span', text: 'Client Information'
  element :last_name, 'div#client-data-Last_Name div'
  element :assessment_history_title, 'span', text: 'Assessment History'
  element :in_progress_record, 'span.assessment-in-progress', text: 'In Progress'
  element :add_cans_button, 'button#new-cans-button'
  element :recent_assessment_ellipsis_icon, 'div.ellipsis-menu', match: :first
  element :assessment_change_log_date, 'div.rt-td', match: :first
  element :delete_cans_button, 'button.delete-action'
  element :cans_change_log_button, 'a.changelog-action'
  elements :recently_updated_assessments_links, '.assessment-info a'

  def go_to_recently_updated_assessment(assessment_date)
    assessment = recently_updated_assessments_links.find do |assessment_link|
      assessment_link.text == assessment_date + ' CANS'
    end
    assessment.click
  end
end
