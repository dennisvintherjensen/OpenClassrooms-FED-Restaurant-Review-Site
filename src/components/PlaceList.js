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
import { Typography } from 'material-ui';

const style = {
  placeList: {
    height: '100%'
  },
  loaderText: {
    'margin-top': '10px'
  },
  error: {
    padding: '25px'
  },
  errorText: {
    color: '#fff'
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
        {!this.gotPlaces() && !this.gotError() ? (
          <div className="progress-container">
            <CircularProgress />
            <Typography classes={{ root: classes.loaderText }} type="caption">
              Loading restaurants...
            </Typography>
          </div>
        ) : null}
        {this.gotError() ? (
          <div className="warning-bg">
            <div className={classes.error}>
              <Typography classes={{ root: classes.errorText }} type="headline">
                Whoops!
              </Typography>
              <Typography classes={{ root: classes.errorText }}>
                An error occured and we are not able to display any restaurants
                at the moment. Please try again later.
              </Typography>
            </div>
          </div>
        ) : (
          <RatingFilter
            setMinRating={(value) => this.props.setMinRating(value)}
          />
        )}
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
  gotPlaces() {
    return (
      (this.props.googleQueryStatus === 'OK' ||
        this.props.localQueryStatus === 'OK') &&
      this.props.places.length > 0
    );
  }
  gotError() {
    return (
      this.props.googleQueryStatus !== 'OK' &&
      this.props.googleQueryStatus !== '' &&
      this.props.localQueryStatus !== 'OK' &&
      this.props.localQueryStatus !== ''
    );
  }
}

PlaceList.propTypes = {
  classes: PropTypes.object.isRequired,
  places: PropTypes.array,
  setSelectedPlace: PropTypes.func,
  minRating: PropTypes.number,
  setMinRating: PropTypes.func,
  googleQueryStatus: PropTypes.string,
  localQueryStatus: PropTypes.string
};

export default withStyles(style)(PlaceList);
