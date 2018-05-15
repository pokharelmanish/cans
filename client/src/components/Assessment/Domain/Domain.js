import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Divider from '@material-ui/core/Divider';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Item from './../Item'
import {getI18nByCode} from "../../../utils/i18nHelper";
import {isEmpty} from "lodash";

class Domain extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static propTypes = {
    key: PropTypes.string.isRequired,
    domain: PropTypes.object.isRequired,
    i18n: PropTypes.object.isRequired,
    i18nAll: PropTypes.object.isRequired,
    onRatingUpdate: PropTypes.func.isRequired,
  };

  renderItems = items => {
    const { i18nAll } = this.props;
    if (isEmpty(i18nAll)) {
      return;
    }

    return items.map(item => {
      const code = item.code;
      const itemI18n = getI18nByCode(i18nAll, code);
      return (
        <div>
          <Item key={code} item={item} i18n={itemI18n} onRatingUpdate={this.props.onRatingUpdate} />
          <Divider/>
        </div>
      )
    });
  };

  render = () => {
    const { i18n } = this.props;
    const title = (i18n['_title_'] || 'Untitled').toUpperCase();
    const description = i18n['_description_'] || 'No Description';
    const { items } = this.props.domain;
    return (
      <ExpansionPanel style={{ 'background-color': '#114161' }}>
        <ExpansionPanelSummary
          expandIcon={<ExpandMoreIcon style={{ 'height': '28px', 'color': 'white' }} />}
          style={{ 'min-height': '28px' }}>
          <Typography variant="title" style={{ 'color': 'white' }}>
            {title}
          </Typography>
          <Tooltip title={description} placement="top-end">
            <i className="material-icons" style={{
              'color': '#09798e',
              'font-size': '14px',
              'margin-left': '3px'
            }}>help</i>
          </Tooltip>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails style={{display: 'block', padding: '0'}}>
            { this.renderItems(items) }
        </ExpansionPanelDetails>
      </ExpansionPanel>
    );
  };
}

export default Domain;