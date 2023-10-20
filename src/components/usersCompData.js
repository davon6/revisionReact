import React, { Component } from 'react';
import axios from 'axios';

class usersCompData extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get('https://localhost:4443/api/allUsers') // Replace with the actual URL of your API
      .then((response) => {
        this.setState({ data: response.data });
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }

  render() {
    const { data } = this.state;


    const tableStyle = {
      borderCollapse: 'collapse',
      width: '100%',
    };

    const thTdStyle = {
      border: '1px solid #dddddd',
      textAlign: 'left',
      padding: '8px',
    };

    const thStyle = {
      backgroundColor: '#f2f2f2',
    };

    return (
      <div>
        
        <h1>Data from "usersComp" table</h1>
        <table style={tableStyle}>
          <thead>
            <tr>
            <th style={thTdStyle}>ID</th>
              <th style={thTdStyle}>Name</th>
              <th style={thTdStyle}>Address</th>
              <th style={thTdStyle}>City</th>
              <th style={thTdStyle}>Age</th>
              <th style={thTdStyle}>Sex</th>
            </tr>
          </thead>
          <tbody>
          {data.map((item, index) => (
              <tr key={index}>
                <td>{item[0]}</td>        {/* ID */}
                <td>{item[1]}</td>        {/* Name */}
                <td>{item[2]}</td>        {/* Address */}
                <td>{item[3]}</td>        {/* City */}
                <td>{item[4]}</td>        {/* Age */}
                <td>{item[5]}</td>        {/* Sex */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default usersCompData;
