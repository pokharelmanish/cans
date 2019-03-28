# frozen_string_literal: true

require 'page_objects/assessment_form'
require 'page_objects/client_profile'
require 'page_objects/staff_dashboard'

class AssessmentHelper
  include RSpec::Matchers
  def initialize
    @form = AssessmentForm.new
    @staff_dash = StaffDashboard.new
    @client_profile = ClientProfile.new
  end

  def start_assessment_for(client_name, should_start_prefilled = false)
    visit_start_assessment client_name
    sleep(2)
    is_reassessment = @form.has_reassessment_modal?(wait: 5)
    if is_reassessment
      if should_start_prefilled
        @form.reassessment_modal.fill_reassessment_with_preceding_data
      else
        @form.reassessment_modal.start_empty_reassessment
      end
    end
    expect(@form.header.child_name).to have_content(client_name)
    is_reassessment
  end

  def visit_start_assessment(client_name)
    @staff_dash.client_link(client_name).text eq(client_name)
    @staff_dash.visit_client_profile(client_name)
    expect(@client_profile).to have_add_cans_button
    @client_profile.add_cans_button.click
  end
end
