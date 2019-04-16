# frozen_string_literal: true

class AppGlobals < SitePrism::Section
  element :warning_modal_heading, 'div.warning-modal-heading'
  element :delete_warning_modal, 'div#delete-assessment-modal'
  element :complete_warning_modal,
          'div.complete-modal-header', text: 'Confirm CANS completion'
  element :complete_warning_cancel_button, 'button.cancel-confirm-button'
  element :complete_warning_save_button, 'button.save-confirm-button'
  element :complete_warning_save_radio, '#complete-assessment-save', visible: false
  element :complete_warning_complete_radio, '#complete-assessment-complete', visible: false
  element :reason_select_drop_down, 'div.list__indicator'
  elements:reason_select_options, '.list__option'
  element :cancel_button_of_warning, 'button.warning-modal-logout'
  element :cancel_button_of_delete_modal, 'button', text: 'Cancel'
  element :delete_button_of_delete_modal, 'button', text: 'Delete CANS'
  element :agree_button_of_warning, 'button.warning-modal-stay-logged-in'
  element :return_to_the_assessment_button, 'button', text: 'Return to the Assessment'
  element :save_and_continue_button, 'button', text: 'Save Changes and Continue'
  element :discard_and_continue_button, 'button', text: 'Discard Changes and Continue'
end
