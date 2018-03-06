import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer';
import PlaceList from './components/PlaceList';
import PlaceDetails from './components/PlaceDetails';
import { MuiThemeProvider } from 'material-ui/styles';
import { themeOverrides } from './themeOverrides';
import ContextMenu from './components/ContextMenu';
import AddPlaceDialog from './components/AddPlaceDialog';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placesFromGoogle: [],
      placesInBounds: [],
      positionDenied: false,
      selectedPlace: null,
      minRating: 1,
      contextMenuOpen: false,
      contextMenuPosition: {},
      addPlaceDialogOpen: false
    };
    this.selectedPlaceIsInbounds = this.selectedPlaceIsInbounds.bind(this);
  }

  componentDidMount() {
    // @TODO: Refactor
    fetch('data/places.json', {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then((data) => data.json())
      .catch((error) => {
        console.log(error);
      })
      .then((places) => {
        this.setState({
          places: places
        });
      });

    // Try to get user's position
    if (navigator && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.getPositionSuccess(position);
        },
        (error) => {
          this.getPositionError(error);
        }
      );
    }
  }

  render() {
    return (
      <MuiThemeProvider theme={themeOverrides}>
        <div className="App">
          <ContextMenu
            open={this.state.contextMenuOpen}
            position={this.state.contextMenuPosition}
            addRestaurant={(_) => this.openAddPlaceDialog()}
          />
          <AddPlaceDialog
            open={this.state.addPlaceDialogOpen}
            dialogClosed={(_) => this.setState({ addPlaceDialogOpen: false })}
            submitPlace={(place) => this.submitPlace(place)}
            google={this.google}
            map={this.map}
          />
          <div className="map-wrapper">
            <MapContainer
              places={this.filterPlaces()}
              currentPosition={this.state.currentPosition}
              positionDenied={this.state.positionDenied}
              setSelectedPlace={(place) => this.setSelectedPlace(place)}
              clearSelectedPlace={() => this.setSelectedPlace(null)}
              selectedPlace={this.state.selectedPlace}
              refGoogle={(google) => this.refGoogle(google)}
              refMap={(map) => this.refMap(map)}
            />
            {this.state.positionDenied ? (
              <div className="position-denied warning-bg">
                We do not have access to your location. Should you decide to
                allow this, then reload the site after changing the setting.
              </div>
            ) : null}
          </div>
          <div className="sidebar">
            {this.state.selectedPlace === null ? (
              // If a place is not selected, display the list of places
              <PlaceList
                places={this.filterPlaces()}
                setSelectedPlace={(place) => this.setSelectedPlace(place)}
                positionDenied={this.state.positionDenied}
                setMinRating={(value) => this.setState({ minRating: value })}
              />
            ) : (
              // Else, display details for the seleted place
              <PlaceDetails
                place={this.state.selectedPlace}
                placeDetails={this.state.selectedPlaceDetails}
                google={this.google}
                clearSelectedPlace={() => this.setSelectedPlace(null)}
                submitReview={(review) => this.submitReview(review)}
              />
            )}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }

  filterPlaces() {
    return this.state.placesInBounds.filter(
      (place) =>
        place.rating >= this.state.minRating || place.rating === undefined
    );
  }

  submitReview(review) {
    // Don't directly update current state
    const selectedPlace = { ...this.state.selectedPlace };
    // Ensure that an array for reviews exists. It might not if this place is brand new.
    if (selectedPlace.reviews === undefined) {
      selectedPlace.reviews = [];
    }
    selectedPlace.reviews.unshift(review);
    // Calculate updated rating
    const rating =
      selectedPlace.reviews.reduce((total, current) => {
        return total + current.rating;
      }, 0) / selectedPlace.reviews.length;
    selectedPlace.rating = rating;
    this.setState({
      selectedPlace: selectedPlace
    });
  }

  submitPlace(place) {
    // Set place id to the next available one if missing
    if (place.id === undefined && place.place_id === undefined) {
      const id = this.state.places.length;
      place.id = id;
      place.place_id = id;
    }
    // Define as local place
    place.source = 'local';
    const places = [...this.state.places, place];
    this.setState(
      {
        places: places,
        addPlaceDialogOpen: false
      },
      () => {
        this.updatePlacesInBounds();
      }
    );
  }

  queryPlaces() {
    // Build query
    const query = {
      location: this.map.getCenter(),
      radius: 1000,
      type: ['restaurant']
    };

    this.placesService.nearbySearch(query, (places, status) => {
      // @TODO: Handle situations where status is not ok.
      if (status === this.google.maps.places.PlacesServiceStatus.OK) {
        this.setState({ placesFromGoogle: places }, () =>
          this.updatePlacesInBounds()
        );
        // Unset selected place if it's not contained in places currently displayed.
        if (!this.selectedPlaceIsInbounds()) {
          this.setSelectedPlace(null);
        }
      }
    });
  }

  updatePlacesInBounds() {
    const LatLng = this.google.maps.LatLng;
    const bounds = this.map.getBounds();
    // Filter places sourced locally
    const placesInBounds = this.state.places.filter((place) => {
      const latlng = new LatLng(
        place.geometry.location.lat,
        place.geometry.location.lng
      );
      return bounds.contains(latlng);
    });
    placesInBounds.push(...this.state.placesFromGoogle);
    this.setState({
      placesInBounds: placesInBounds
    });
  }

  getPlaceDetails(placeId) {
    if (!placeId) {
      // Well draw info on local places from local DB
      return;
    }
    this.placesService.getDetails(
      {
        placeId: placeId
      },
      (place, status) => {
        if (status === this.google.maps.places.PlacesServiceStatus.OK) {
          // Merge details with places object
          const selectedPlace = { ...this.state.selectedPlace, ...place };
          this.setState({
            selectedPlace: selectedPlace
          });
        }
      }
    );
  }

  selectedPlaceIsInbounds() {
    if (this.state.selectedPlace === null) {
      return false;
    }
    return this.state.placesInBounds.some(
      (place) => place.place_id === this.state.selectedPlace.place_id
    );
  }

  refMap(map) {
    if (this.map !== map) {
      // set placesService to undefined in order to reset the service
      this.placesService = undefined;
      this.map = map;
      this.setService();
    }
  }

  refGoogle(google) {
    if (this.google !== google) {
      // set placesService to undefined in order to reset the service
      this.placesService = undefined;
      this.google = google;
      this.setService();
    }
  }

  handleRightClick(event) {
    this.setState({
      contextMenuOpen: true,
      contextMenuPosition: event.pixel
    });
  }

  handleLeftClick() {
    if (this.state.contextMenuOpen) {
      this.setState({
        contextMenuOpen: false
      });
    }
  }

  handleDragStart() {
    if (this.state.contextMenuOpen) {
      this.setState({
        contextMenuOpen: false
      });
    }
  }

  openAddPlaceDialog() {
    this.setState({
      addPlaceDialogOpen: true,
      contextMenuOpen: false
    });
  }

  setService() {
    if (
      this.map !== undefined &&
      this.google !== undefined &&
      this.placesService === undefined
    ) {
      this.placesService = new this.google.maps.places.PlacesService(this.map);
      this.google.maps.event.addListener(this.map, 'idle', () =>
        this.queryPlaces()
      );
      this.google.maps.event.addListener(this.map, 'rightclick', (event) =>
        this.handleRightClick(event)
      );
      this.google.maps.event.addListener(this.map, 'click', (_) =>
        this.handleLeftClick()
      );
      this.google.maps.event.addListener(this.map, 'dragstart', (_) =>
        this.handleDragStart()
      );
    }
  }

  getPositionSuccess(position) {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    this.setState({
      currentPosition: currentPosition
    });
  }

  getPositionError(error) {
    console.log(`Error (${error.code}): ${error.message}`);
    this.setState({
      currentPosition: {
        lat: 48.874951,
        lng: 2.350572
      },
      positionDenied: true
    });
  }

  setSelectedPlace(place) {
    if (place !== null && place) {
      this.getPlaceDetails(place.place_id);
    }
    this.setState({
      selectedPlace: place
    });
  }
}

export default App;
