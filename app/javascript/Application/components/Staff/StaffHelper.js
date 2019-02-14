import PropTypes from 'prop-types'

export const staffPropType = PropTypes.shape({
  staff_person: PropTypes.shape({
    first_name: PropTypes.string,
    last_name: PropTypes.string,
  }).isRequired,
  clients_count: PropTypes.number.isRequired,
  no_prior_cans_count: PropTypes.number.isRequired,
  in_progress_count: PropTypes.number.isRequired,
  completed_count: PropTypes.number.isRequired,
})

export const staffInfoPropTypes = PropTypes.shape({
  staff_person: PropTypes.shape({
    first_name: PropTypes.string.isRequired,
    last_name: PropTypes.string.isRequired,
    phone: PropTypes.string,
    phoneExtCode: PropTypes.string,
    email: PropTypes.string,
    county: PropTypes.shape({
      name: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  clients_count: PropTypes.number.isRequired,
  no_prior_cans_count: PropTypes.number.isRequired,
  in_progress_count: PropTypes.number.isRequired,
  completed_count: PropTypes.number.isRequired,
})

export const failedFetching = { message: 'Fail to fetch data from server side!' }
