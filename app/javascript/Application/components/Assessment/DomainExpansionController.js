import React from 'react'
import PropTypes from 'prop-types'

class DomainExpansionController extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      domains: [],
      domainsExpanded: [],
      isUnifiedExpansion: false,
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
    const domainsExpanded = this.state.domainsExpanded.map((prevValue, i) => ({
      domain: prevValue.domain,
      isExpanded: i === index ? isExpanded : prevValue.isExpanded,
    }))
    this.setState({ domainsExpanded })

    const isUnified = domainsExpanded.every(({ isExpanded: isDomainExpanded }) => isDomainExpanded === isExpanded)
    if (isUnified) {
      this.setState({ isUnifiedExpansion: isExpanded })
    }
  }

  handleExpandCollapseAll = () => {
    const isExpandOperation = !this.state.isUnifiedExpansion
    this.setState({
      domainsExpanded: this.state.domainsExpanded.map(({ domain }) => ({ domain, isExpanded: isExpandOperation })),
      isUnifiedExpansion: isExpandOperation,
    })
  }

  render() {
    return React.cloneElement(this.props.children, {
      domainsExpanded: this.state.domainsExpanded,
      onExpandedChange: this.handleExpandedChange,
      onExpandCollapseAll: this.handleExpandCollapseAll,
      isUnifiedExpansion: this.state.isUnifiedExpansion,
    })
  }
}

DomainExpansionController.propTypes = {
  children: PropTypes.node.isRequired,
  domains: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.number.isRequired })).isRequired,
}

export default DomainExpansionController
