import React from 'react';
import PropTypes from 'prop-types';
import { GoogleApiWrapper } from 'google-maps-react';
import Map from './Map';
import Marker from './Marker';
import InfoWindow from './InfoWindow';

class MapContainer extends React.Component {

    componentDidUpdate(prevProps) {
        if (this.props.google !== prevProps.google) {
            this.props.refGoogle(this.props.google);
        }
    }

    render() {
        if (!this.props.loaded) {
            return (    
                <div className="map-container">
                    Loading Map...
                </div>
            );
        }
        return (
            <div className="map-container">
                <Map
                    google={this.props.google}
                    currentPosition={this.props.currentPosition}
                    refMap={(map) => this.props.refMap(map)}>
                    {this.renderMarkers()}
                    {this.renderCurrentPositionMarker()}
                    <InfoWindow selectedPlace={this.props.selectedPlace} 
                                closeclick={() => this.props.clearSelectedPlace()}/>
                </Map>
            </div>
        );
    }

    renderMarkers() {
        return this.props.places
            .map((place, index) => {
                let position = {};
                // Places fethced from local source
                if (place.source && place.source === 'local') {
                    position.lat = place.geometry.location.lat;
                    position.lng = place.geometry.location.lng;
                }
                // Places fetched from Google Places
                else {
                    position.lat = place.geometry.location.lat();
                    position.lng = place.geometry.location.lng();
                }
                return (<Marker onClick={() => this.props.setSelectedPlace(place)}
                                position={position}
                                key={place.id} />);
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
            strokeOpacity: .4,
            fillColor: '#1565c0',
            fillOpacity: 1
        };
        return (<Marker position={this.props.currentPosition}
                        icon={icon}
                        key={'currentPositionMarker'} />);
    }

}

MapContainer.propTypes = {
    places: PropTypes.array,
    currentPosition: PropTypes.object,
    positionDenied: PropTypes.bool,
    selectedPlace: PropTypes.object,
    clearSelectedPlace: PropTypes.func,
    setSelectedPlace: PropTypes.func,
    refGoogle: PropTypes.func,
    refMap: PropTypes.func
}

export default GoogleApiWrapper({
    apiKey: 'AIzaSyDRSqcyUfOVEVJuOiG42eGko-BKNUhxTII',
    version: '3'
})(MapContainer)