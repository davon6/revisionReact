import React, { Component } from 'react';
import axios from 'axios';

class displayXml extends Component {
  state = {
    data: [],
  };

  componentDidMount() {
    axios.get('https://cpfr2401:4443/display-xml') // Replace with the actual URL of your API
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
        {/* Use dangerouslySetInnerHTML to insert raw HTML content */}
        <div dangerouslySetInnerHTML={{ __html: data }} />
      </div>
    );
  }
}


export default displayXml;

/*
.map((element, index) => (
    // Use 'element' inside this block
    // 'index' is the index of the current element in the array
    <div key={index}>{element}</div>
  ))

  */