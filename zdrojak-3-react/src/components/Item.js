import React from 'react';

export default class Item extends React.Component {

  render() {
    return <li>{this.props.text} <button onClick={this.props.removeItem}>✖</button></li>;
  }
};