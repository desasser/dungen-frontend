import { Component } from 'react'
import { PropTypes } from 'prop-types';

// Add check for children types, only a limited subset of SVG shapes that it can take
// Sketch SVG to react?
// Path
// Animation
export default class SVG extends Component {


  static propTypes = {
    // Aria Required Properties
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,

    // Sizing
    minX: PropTypes.string,
    minY: PropTypes.string,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
  }

  constructor(props) {
    super();
    this.props = { minX: 0, minY: 0 };
  }

  render() {
    const { minX, minY, width, height } = this.props;

    return (
      <svg {...this.props}
           aria-labelledby="title desc"
           role="img"
           preserveAspectRatio="xMidYMid meet"
           viewBox={`${minX} ${minY} ${width} ${height}`}>
        <title id="title">{this.props.title}</title>
        <desc id="desc">{this.props.description}</desc>
        {this.props.children}
      </svg>
    );
  }
}