import React, { Component } from 'react';
import axios from 'axios';

class PremData extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get('https://localhost:4443/api/query') // Replace with the actual URL of your API
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    const { data } = this.state;

    return (
      <div>
        <h1>Data from "prem" table</h1>
        <table>
          <thead>
            <tr>
              <th>Lundi</th>
              <th>Mardi</th>
              <th>Mercredi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.lundi}>
                <td>{item.lundi}</td>
                <td>{item.mardi}</td>
                <td>{item.mercredi}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default PremData;
