import React from 'react';
import PropTypes from 'prop-types';

class Marker extends React.Component {
  render() {
    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.map !== prevProps.map && this.props.map !== null) {
      this.renderMarker();
    }
  }

  componentDidMount() {
    if (this.props.map && this.props.position) {
      this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.marker.setMap(null);
      this.marker = null;
    }
  }

  renderMarker() {
    const map = this.props.map;
    const google = this.props.google;
    const mapCenter = this.props.mapCenter;
    const position = this.props.position;
    const clickable = this.props.onClick !== undefined;

    const pos = position || mapCenter;
    const markerPosition = new google.maps.LatLng(pos.lat, pos.lng);

    const pref = {
      map: map,
      position: markerPosition,
      optimized: false,
      clickable: clickable
    };

    if (this.props.icon) {
      pref['icon'] = this.props.icon;
    } else {
      pref['icon'] = {
        url: 'assets/images/restaurantmarker.svg',
        scaledSize: new google.maps.Size(40, 40)
      };
    }

    this.marker = new google.maps.Marker(pref);

    if (clickable) {
      this.addListeners();
    }
  }

  addListeners() {
    this.marker.addListener('click', (_) => this.props.onClick());
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.object
};

export default Marker;
