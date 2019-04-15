import React from 'react'
import PropTypes from 'prop-types'

class DomainExpansionController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      domains: [],
      domainsExpanded: [],
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    if (nextProps.domains === state.domains) {
      return null
    }

    const newDomainsExpanded = nextProps.domains.map(domain => {
      const existingDomain = state.domainsExpanded.find(domainIsExpanded => domainIsExpanded.domain.id === domain.id)
      return {
        domain,
        isExpanded: existingDomain ? existingDomain.isExpanded : false,
      }
    })

    return { domains: nextProps.domains, domainsExpanded: newDomainsExpanded }
  }

  handleExpandedChange = (index, isExpanded) => {
    this.setState({
      domainsExpanded: this.state.domainsExpanded.map((prevValue, i) => ({
        domain: prevValue.domain,
        isExpanded: i === index ? isExpanded : prevValue.isExpanded,
      })),
    })
  }

  render() {
    return React.cloneElement(this.props.children, {
      domainsExpanded: this.state.domainsExpanded,
      onExpandedChange: this.handleExpandedChange,
    })
  }
}

DomainExpansionController.propTypes = {
  children: PropTypes.node.isRequired,
  domains: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })).isRequired,
}

export default DomainExpansionController
