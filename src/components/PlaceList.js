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
  text: {
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
        {!this.allSourcesGotError() ? (
          <RatingFilter
            setMinRating={(value) => this.props.setMinRating(value)}
          />
        ) : (
          <div className="warning-bg">
            <div className={classes.text}>
              <Typography classes={{ root: classes.errorText }} type="headline">
                Whoops!
              </Typography>
              <Typography classes={{ root: classes.errorText }}>
                An error occured and we are not able to display any restaurants
                at the moment. Please try again later.
              </Typography>
            </div>
          </div>
        )}

        {!this.gotPlaces() && !this.sourcesReplied() ? (
          <div className="progress-container">
            <CircularProgress />
            <Typography classes={{ root: classes.loaderText }} type="caption">
              Loading restaurants...
            </Typography>
          </div>
        ) : null}

        {!this.gotPlaces() && this.props.minRating > 1 ? (
          <div className={classes.text}>
            <Typography>
              No restarurants with a rating of {this.props.minRating} or above
              if located in this area. Try lowering the ratings filter to show
              restaurants with lower ratings.
            </Typography>
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
  gotPlaces() {
    return this.props.places.length > 0;
  }
  sourcesReplied() {
    return (
      this.props.googleQueryStatus === 'OK' ||
      this.props.localQueryStatus === 'OK'
    );
  }
  allSourcesGotError() {
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
