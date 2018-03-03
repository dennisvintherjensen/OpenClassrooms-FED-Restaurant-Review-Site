import React from 'react';
import PropTypes from 'prop-types';
import PlaceListItem from './PlaceListItem';
import List from 'material-ui/List';
import RatingFilter from './RatingFilter';

class PlaceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: []
    };
  }

  render() {
    return (
      <div className="places-list">
        <RatingFilter
          setMinRating={(value) => this.props.setMinRating(value)}
        />
        <List>{this.renderListItems()}</List>
      </div>
    );
  }
  renderListItems() {
    return this.props.places.map((place) => {
      return (
        <PlaceListItem
          setSelectedPlace={this.props.setSelectedPlace}
          place={place}
          key={place.id}
        />
      );
    });
  }
}

PlaceList.propTypes = {
  places: PropTypes.array,
  setSelectedPlace: PropTypes.func,
  minRating: PropTypes.number,
  setMinRating: PropTypes.func
};

export default PlaceList;
