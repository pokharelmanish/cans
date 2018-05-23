import React, { Component } from 'react';
import { PersonService } from './person.service';
import { groupClientsByLastName } from './person.helper';
import './style.css'

class Clients extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      clients_status: 'idle',
    };
  }

  componentDidMount() {
    this.fetchAllClients();
  }

  fetchAllClients = () => {
    this.setState({ assessment_status: 'waiting' });
    return PersonService.fetchAllClients()
      .then(this.onFetchAllClientsSuccess)
      .catch(() => this.setState({ assessment_status: 'error' }));
  };

  onFetchAllClientsSuccess = clients => {
    const groupedClients = groupClientsByLastName(clients);
    this.setState({
      clients: groupedClients,
      clients_status: 'ready',
    });
  };

  renderClientsRecord = record => {
    return (
      <div className="client-name-container">
        <div className="header">{record.letter}</div>
        {record.clients.map(client => {
          return this.renderClientName(client);
        })}
      </div>
    )
  };

  renderClientName = client => {
    return (
      <div className="client-name">
        <a href={`/clients/${client.id}`}>{`${client.last_name}, ${client.first_name}`}</a>
      </div>
    );
  };

  render = () => {
    const clients = this.state.clients || [];
    const { clients_status } = this.state;
    return (
      <div className="clients-container">
        {clients.map(record => {
          return this.renderClientsRecord(record);
        })}

        {clients_status === 'ready' && clients.length === 0
          ? <div>No clients found</div>
          : null
        }
      </div>
    );
  };
}

export default Clients;
