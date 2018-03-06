// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import List from 'material-ui/List';
import { CircularProgress } from 'material-ui/Progress';
import { withStyles } from 'material-ui/styles';
// Custom
import PlaceListItem from './PlaceListItem';
import RatingFilter from './RatingFilter';

const style = {
  placeList: {
    height: '100%'
  }
};

class PlaceList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: []
    };
  }

  render() {
    const classes = this.props.classes;
    return (
      <div className={classes.placeList}>
        <RatingFilter
          setMinRating={(value) => this.props.setMinRating(value)}
        />
        {this.props.places.length === 0 ? (
          <div className="progress-container">
            <CircularProgress />
          </div>
        ) : null}
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
  classes: PropTypes.object.isRequired,
  places: PropTypes.array,
  setSelectedPlace: PropTypes.func,
  minRating: PropTypes.number,
  setMinRating: PropTypes.func
};

export default withStyles(style)(PlaceList);
