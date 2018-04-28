import React, { Component } from 'react';
import Map from "./pages/map";

class App extends Component {
  render() {
    return (
      <Map 
        containerElement={<div style={{height: 100+'%'}} />}
        mapElement={<div style={{height: 100+'%'}} />}
      />
    );
  }
}

export default App;
