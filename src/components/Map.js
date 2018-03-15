// React
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// Material
import { CircularProgress } from 'material-ui/Progress';

/**
 * Map
 */
class Map extends React.Component {
  /**
   * LifeCycle
   * @param {Object} nextProps
   * @param {Object} nextState
   */
  componentWillUpdate(nextProps, nextState) {
    // Only act if google object has changed.
    // This may happen when navigating from one route to another if both have a Map component.
    if (nextProps.google !== this.props.google) {
      this.loadMap();
    }
  }
  /**
   * LifeCycle
   * @param {Object} prevProps
   * @param {Object} prevState
   */
  componentDidUpdate(prevProps, prevState) {
    // Act if we get a new currentPosition.
    // This happens on first load
    if (prevProps.currentPosition !== this.props.currentPosition) {
      this.loadMap();
    }
  }
  /**
   * Rendering
   */
  render() {
    return (
      <div ref="map" className="map">
        <div className="progress-container">
          <CircularProgress />
        </div>
        {this.renderChildren()}
      </div>
    );
  }
  /**
   * Render child components (markers)
   * By cloning the child components, references to map, google, and mapCenter is included
   */
  renderChildren() {
    const children = this.props.children;
    if (!children) {
      return;
    }
    return React.Children.map(children, (child) => {
      if (child) {
        return React.cloneElement(child, {
          map: this.map,
          google: this.props.google,
          mapCenter: this.props.currentPosition
        });
      }
    });
  }
  /**
   * Loads the map
   */
  loadMap() {
    // Wait for a position to be available in case one of the life cycles hooks are triggered before this
    if (this.props.currentPosition === undefined) {
      return;
    }
    if (this.props && this.props.google) {
      const google = this.props.google;
      const maps = google.maps;
      const node = ReactDOM.findDOMNode(this.refs.map);
      const zoom = this.props.zoom;
      const position = this.props.currentPosition;
      const lat = position.lat;
      const lng = position.lng;
      const center = new maps.LatLng(lat, lng);
      const mapConfig = {
        center: center,
        zoom: zoom
      };
      const map = new maps.Map(node, mapConfig);
      this.map = map;
      this.props.refMap(this.map);
    }
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  currentPosition: PropTypes.object,
  refMap: PropTypes.func
};

Map.defaultProps = {
  zoom: 15
};

export default Map;
