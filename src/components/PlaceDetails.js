// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import Card, { CardHeader, CardContent } from 'material-ui/Card';
import List, { ListItem, ListItemText, ListItemIcon } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import CloseIcon from 'material-ui-icons/Close';
import OpenInNewIcon from 'material-ui-icons/OpenInNew';
import LocationOnIcon from 'material-ui-icons/LocationOn';
import PhoneIcon from 'material-ui-icons/Phone';
import { withStyles } from 'material-ui/styles';
// Custom
import Rating from './Rating';
import ReviewList from './ReviewList';
import Panorama from './Panorama';

const styles = {
  headerTitle: {
    color: '#fff',
    'text-transform': 'none',
    'font-size': '1.3rem'
  },
  action: {
    fill: '#fff'
  },
  rating: {
    padding: '0 10px',
    'padding-bottom': '25px',
    'margin-top': '-10px',
    display: 'flex',
    '& .value': {
      'margin-top': '3px'
    }
  }
};

class PlaceDetails extends React.Component {
  render() {
    const classes = this.props.classes;
    const place = this.props.place;
    return (
      <Card elevation={0}>
        <CardHeader
          className="primary-bg"
          classes={{ title: classes.headerTitle }}
          action={
            <IconButton onClick={(_) => this.props.clearSelectedPlace()}>
              <CloseIcon classes={{ root: classes.action }} />
            </IconButton>
          }
          title={place.name}
        />
        <CardContent className="primary-bg" classes={{ root: classes.rating }}>
          <Rating max={5} value={place.rating} />
        </CardContent>
        <Panorama place={this.props.place} google={this.props.google} />
        <List dense={true}>
          {this.renderProp('vicinity')}
          {this.renderProp('formatted_phone_number')}
          {this.renderProp('website')}
        </List>
        <div>
          <ReviewList
            reviews={place.reviews}
            submitReview={(review) => this.props.submitReview(review)}
          />
        </div>
      </Card>
    );
  }

  renderProp(prop) {
    if (this.props.place[prop]) {
      const place = this.props.place;
      let icon;
      let text = place[prop];
      switch (prop) {
        case 'formatted_phone_number':
          icon = <PhoneIcon />;
          break;
        case 'vicinity':
          icon = <LocationOnIcon />;
          break;
        case 'website':
          icon = <OpenInNewIcon />;
          text = (
            <a href={place[prop]} target="_blank">
              {place[prop]}
            </a>
          );
          break;
        default:
          break;
      }
      return (
        <ListItem>
          <ListItemIcon>{icon}</ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      );
    }
  }
}

PlaceDetails.propTypes = {
  place: PropTypes.object,
  clearSelected: PropTypes.func,
  classes: PropTypes.object.isRequired,
  google: PropTypes.object,
  submitReview: PropTypes.func
};

export default withStyles(styles)(PlaceDetails);
