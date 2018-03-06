// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { CircularProgress } from 'material-ui/Progress';
// Maps
import { GoogleApiWrapper } from 'google-maps-react';
// Custom
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';

class MapContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      infoWindowPoint: null,
      InfoWindowPlace: null
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.google !== prevProps.google) {
      this.props.refGoogle(this.props.google);
    }
  }

  render() {
    if (!this.props.loaded) {
      return (
        <div className="map-container">
          <div className="progress-container">
            <CircularProgress />
          </div>
        </div>
      );
    }
    return (
      <div className="map-container">
        <Map
          google={this.props.google}
          currentPosition={this.props.currentPosition}
          refMap={(map) => this.props.refMap(map)}
        >
          {this.renderMarkers()}
          {this.renderCurrentPositionMarker()}
        </Map>
        <InfoWindow
          place={this.state.InfoWindowPlace}
          point={this.state.infoWindowPoint}
        />
      </div>
    );
  }

  renderMarkers() {
    return this.props.places.map((place, index) => {
      let position = {};
      // Places fethced from local source
      if (place.source && place.source === 'local') {
        position.lat = place.geometry.location.lat;
        position.lng = place.geometry.location.lng;
      } else {
        // Places fetched from Google Places
        position.lat = place.geometry.location.lat();
        position.lng = place.geometry.location.lng();
      }
      return (
        <Marker
          onClick={() => this.props.setSelectedPlace(place)}
          onHover={(point, place) => this.setHoveredPlace(point, place)}
          onHoverOut={() => this.setHoveredPlace(null, null)}
          place={place}
          selectedPlace={
            (this.props.selectedPlace &&
              place.id === this.props.selectedPlace.id) ||
            false
          }
          position={position}
          key={place.id}
        />
      );
    });
  }

  renderCurrentPositionMarker() {
    // Only render a marker for the user's current position if it is accessible
    if (this.props.positionDenied || this.props.currentPosition === undefined) {
      return null;
    }
    const icon = {
      path: this.props.google.maps.SymbolPath.CIRCLE,
      scale: 4,
      strokeWeight: 20,
      strokeColor: '#2196f3',
      strokeOpacity: 0.4,
      fillColor: '#1565c0',
      fillOpacity: 1
    };
    return (
      <Marker
        position={this.props.currentPosition}
        icon={icon}
        key={'currentPositionMarker'}
      />
    );
  }

  setHoveredPlace(point, place) {
    this.setState({
      infoWindowPoint: point,
      InfoWindowPlace: place
    });
  }
}

MapContainer.propTypes = {
  places: PropTypes.array,
  currentPosition: PropTypes.object,
  positionDenied: PropTypes.bool,
  setSelectedPlace: PropTypes.func,
  selectedPlace: PropTypes.object,
  refGoogle: PropTypes.func,
  refMap: PropTypes.func
};

export default GoogleApiWrapper({
  apiKey: 'AIzaSyDRSqcyUfOVEVJuOiG42eGko-BKNUhxTII',
  version: '3'
})(MapContainer);
