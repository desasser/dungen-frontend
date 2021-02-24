import { Component } from 'react'

export default class Rectangle extends Component {
  render () {
    return <rect {...this.props}>{this.props.children}</rect>;
  }
}