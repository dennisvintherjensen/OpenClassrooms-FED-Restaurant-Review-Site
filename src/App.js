// React
import React, { Component } from 'react';
// Material
import { MuiThemeProvider } from 'material-ui/styles';
// Custom
import MapContainer from './components/MapContainer';
import PlaceList from './components/PlaceList';
import PlaceDetails from './components/PlaceDetails';
import ContextMenu from './components/ContextMenu';
import AddPlaceDialog from './components/AddPlaceDialog';
import { themeOverrides } from './themeOverrides';
// Using imported CSS as oposed to CSS in JSX due to larger amount of CSS and media quries
import './App.css';

// Set to true to emulate an error when fetching places from local source and/or google
const debugWithErrorGoogle = false;
const debugWithErrorLocal = false;

class App extends Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      placesFromGoogle: [],
      placesInBounds: [],
      positionDenied: false,
      selectedPlace: null,
      currentPosition: null,
      minRating: 1,
      contextMenuOpen: false,
      contextMenuPosition: {},
      addPlaceDialogOpen: false,
      googleQueryStatus: '',
      localQueryStatus: ''
    };
    this.selectedPlaceIsInbounds = this.selectedPlaceIsInbounds.bind(this);
  }
  /**
   * LifeCycle
   */
  componentDidMount() {
    // Component has mounted and it's safe to fetch data.
    // If fetched earlier, we might get it back before the component has mounted which will cause setState to fail.
    this.fetchLocalPlaces();
    // Get user's position
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
  /**
   * Rendering
   */
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
              selectedPlace={this.state.selectedPlace}
              refGoogle={(google) => this.refGoogle(google)}
              refMap={(map) => this.refMap(map)}
            />
            {// Show notice if user has denied access to position.
            this.state.positionDenied ? (
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
                googleQueryStatus={this.state.googleQueryStatus}
                localQueryStatus={this.state.localQueryStatus}
                setSelectedPlace={(place) => this.setSelectedPlace(place)}
                minRating={this.state.minRating}
                setMinRating={(value) => this.setState({ minRating: value })}
              />
            ) : (
              // Else, display details for the seleted place
              <PlaceDetails
                place={this.state.selectedPlace}
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
  /**
   * Runs when position is available and access is allowed
   * @param {Position} position
   */
  getPositionSuccess(position) {
    const currentPosition = {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
    this.setState({
      currentPosition: currentPosition
    });
  }
  /**
   * Runs when position is not available
   * @param {PositionError} error
   */
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
  /**
   * Fetches places from the local API and saves them to state
   */
  fetchLocalPlaces() {
    let endpoint = 'data/places.json';
    if (debugWithErrorLocal) {
      // Ensure a failed fetch by obstructing the url
      endpoint += 'error';
    }
    const headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };
    fetch(endpoint, {
      method: 'get',
      headers: headers
    })
      .then((data) => data.json())
      .then((places) => {
        this.setState({
          places: places,
          localQueryStatus: 'OK'
        });
      })
      .catch((error) => {
        this.setState({
          localQueryStatus: 'ERROR'
        });
      });
  }
  /**
   * Fetches places from Google Places and saves them to state
   */
  fetchGooglePlaces() {
    // Get places of type restaurant that are within 1000 feet of the map center.
    const query = {
      location: this.map.getCenter(),
      radius: 1000,
      type: ['restaurant']
    };
    this.placesService.nearbySearch(query, (places, status) => {
      // Ensure that status is error and that we return an empty array if error debugging is set
      if (debugWithErrorGoogle) {
        status = 'UNKNOWN_ERROR';
        places = [];
      }
      // Use setState with a callBack to ensure we do not run updatePlacesInBounds before the state has been set
      this.setState(
        {
          placesFromGoogle: places,
          googleQueryStatus: status
        },
        () => {
          this.filterPlacesInBounds();
        }
      );
      // Unset selected place if it is not currently displayed
      if (!this.selectedPlaceIsInbounds()) {
        this.setSelectedPlace(null);
      }
    });
  }
  /**
   * Fetches information about a place and saves it to state.
   * @param {string} placeId
   */
  fetchPlaceDetails(placeId) {
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
  /**
   * Filter places that are within the currently displayed map and save the outcome to state.
   */
  filterPlacesInBounds() {
    const LatLng = this.google.maps.LatLng;
    const bounds = this.map.getBounds();
    // Filter places comming from local DB that are within the map
    const placesInBounds = this.state.places.filter((place) => {
      const latlng = new LatLng(
        place.geometry.location.lat,
        place.geometry.location.lng
      );
      return bounds.contains(latlng);
    });
    // Join in places comming from Google Places
    placesInBounds.push(...this.state.placesFromGoogle);
    this.setState({
      placesInBounds: placesInBounds
    });
  }
  /**
   * Return true if the currently selected place is within the bounds of the displayed map
   * This may happen, if a place has been selected, and the map is then moved, triggering places to be fetched from Google Places,
   * and the places returned from Goggle Places does not include the place previously selected.
   */
  selectedPlaceIsInbounds() {
    // No reason to iterate if no place is selected
    if (this.state.selectedPlace === null) {
      return false;
    }
    return this.state.placesInBounds.some(
      (place) => place.place_id === this.state.selectedPlace.place_id
    );
  }
  /**
   * Returns places currently within bounds of the map and with a rating above or equal to minRating.
   */
  filterPlaces() {
    return this.state.placesInBounds.filter(
      (place) =>
        place.rating >= this.state.minRating || place.rating === undefined
    );
  }
  /**
   * Adds a review to the currently selected place
   * @param {Object} review
   */
  submitReview(review) {
    // Don't directly update current state
    const selectedPlace = { ...this.state.selectedPlace };
    // Ensure that an array for reviews exists. It might not if this place is brand new.
    if (selectedPlace.reviews === undefined) {
      selectedPlace.reviews = [];
    }
    // Add review to start of array in order to display it on top of the others
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
  /**
   * Adds a new place
   * @param {Object} place
   */
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
        this.filterPlacesInBounds();
      }
    );
  }
  /**
   * Sets the state so that the add place dialog opens
   */
  openAddPlaceDialog() {
    this.setState({
      addPlaceDialogOpen: true,
      contextMenuOpen: false
    });
  }
  /**
   * Adds a reference to map to this classes properties
   * @param {Map} map
   */
  refMap(map) {
    if (this.map !== map) {
      // Map has changed - either from no map to a map, or from one map to another.
      // Set placesService to undefined in order to reset the service.
      this.placesService = undefined;
      this.map = map;
      this.setService();
    }
  }
  /**
   * Adds a reference to google to this classes properties
   * @param {google} google
   */
  refGoogle(google) {
    if (this.google !== google) {
      // Google has changed - either from no google to a google, or from one google to another.
      // Set placesService to undefined in order to reset the service.
      this.placesService = undefined;
      this.google = google;
      this.setService();
    }
  }
  /**
   * Handler for when the map is right clicked
   * @param {Event} event
   */
  handleRightClick(event) {
    this.setState({
      contextMenuOpen: true,
      contextMenuPosition: event.pixel
    });
  }
  /**
   * Handler for when the map is left clicked
   */
  handleLeftClick() {
    if (this.state.contextMenuOpen) {
      this.setState({
        contextMenuOpen: false
      });
    }
  }
  /**
   * Handler for when the map is dragged - start
   */
  handleDragStart() {
    if (this.state.contextMenuOpen) {
      this.setState({
        contextMenuOpen: false
      });
    }
  }
  /**
   * Handles wiring the event handlers and setting up services
   */
  setService() {
    if (
      this.map !== undefined &&
      this.google !== undefined &&
      this.placesService === undefined
    ) {
      this.placesService = new this.google.maps.places.PlacesService(this.map);
      this.google.maps.event.addListener(this.map, 'idle', () =>
        this.fetchGooglePlaces()
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
  /**
   * Save selected place to state
   * @param {Object} place
   */
  setSelectedPlace(place) {
    if (place !== null && place) {
      // Places comming from local DB does not have the property placeId set, so this is comming from local DB.
      // We do not fetch info from Google Places for our own places.
      this.fetchPlaceDetails(place.place_id);
    }
    this.setState({
      selectedPlace: place
    });
  }
}

export default App;
