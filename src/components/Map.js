// React
import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
// Material
import { CircularProgress } from 'material-ui/Progress';

class Map extends React.Component {
  componentWillUpdate(nextProps, nextState) {
    // Only act if google object changed. This will happen when navigating from one route to another if both have a Map component.
    if (nextProps.google !== this.props.google) {
      this.loadMap();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // Act if we get a new currentPosition.
    if (prevProps.currentPosition !== this.props.currentPosition) {
      this.loadMap();
    }
  }

  componentDidMount() {
    this.loadMap();
  }

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

  loadMap() {
    if (this.props.currentPosition === undefined) {
      return;
    }

    if (this.props && this.props.google) {
      const google = this.props.google;
      const maps = google.maps;
      const mapRef = this.refs.map;
      const node = ReactDOM.findDOMNode(mapRef);

      const zoom = this.props.zoom;
      const position = this.props.currentPosition;
      const lat = position.lat;
      const lng = position.lng;
      const center = new maps.LatLng(lat, lng);

      const mapConfig = Object.assign(
        {},
        {
          center: center,
          zoom: zoom
        }
      );

      const map = new maps.Map(node, mapConfig);
      this.map = map;
      this.props.refMap(this.map);
    }
  }
}

Map.propTypes = {
  google: PropTypes.object,
  zoom: PropTypes.number,
  defaultCurrentPosition: PropTypes.object,
  currentPosition: PropTypes.object,
  refMap: PropTypes.func
};

Map.defaultProps = {
  zoom: 15
};

export default Map;
