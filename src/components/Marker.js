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
    // Scale icon for selected place
    if (this.props.selectedPlace !== prevProps.selectedPlace) {
      let icon = {
        url: this.marker.getIcon().url,
        scaledSize: {
          height: this.props.selectedPlace ? 60 : 40,
          width: this.props.selectedPlace ? 60 : 40
        }
      };
      this.marker.setIcon(icon);
    }
  }

  componentDidMount() {
    if (this.props.map && this.props.position) {
      this.renderMarker();
    }
  }

  componentWillUnmount() {
    if (this.marker) {
      this.removeMarker();
    }
  }

  removeMarker() {
    this.marker.setMap(null);
    this.marker = null;
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
      pref.icon = this.props.icon;
    } else {
      pref.icon = {
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
    this.marker.addListener('mouseover', (e) =>
      this.props.onHover(this.point(), this.props.place)
    );
    this.marker.addListener('mouseout', () => this.props.onHoverOut());
  }

  point() {
    const google = this.props.google;
    const map = this.props.map;
    var topRight = map
      .getProjection()
      .fromLatLngToPoint(map.getBounds().getNorthEast());
    var bottomLeft = map
      .getProjection()
      .fromLatLngToPoint(map.getBounds().getSouthWest());
    var scale = Math.pow(2, map.getZoom());
    var worldPoint = map
      .getProjection()
      .fromLatLngToPoint(this.marker.position);
    return new google.maps.Point(
      (worldPoint.x - bottomLeft.x) * scale,
      (worldPoint.y - topRight.y) * scale
    );
  }
}

Marker.propTypes = {
  position: PropTypes.object,
  map: PropTypes.object,
  google: PropTypes.object,
  onClick: PropTypes.func,
  icon: PropTypes.object,
  onHover: PropTypes.func,
  onHoverOut: PropTypes.func,
  place: PropTypes.object,
  selectedPlace: PropTypes.bool
};

export default Marker;
