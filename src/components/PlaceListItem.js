// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
// Custom
import Rating from './Rating';

class PlaceListItem extends React.Component {
  render() {
    const place = this.props.place;
    const rating = place.rating;
    let imageUrl;
    if (place.photos && place.photos.length > 0) {
      imageUrl = place.photos[0].getUrl({
        maxWidth: 400,
        maxHeight: 400
      });
    } else {
      imageUrl = 'assets/images/default-place-icon.png';
    }
    return (
      <ListItem
        elevation={0}
        button
        onClick={(_) => this.props.setSelectedPlace(place)}
      >
        <div className="details">
          <Typography type="title">{place.name}</Typography>
          <Typography type="caption">{place.vicinity}</Typography>
          <Rating max={5} value={rating} />
        </div>
        <Avatar src={imageUrl} className="avatar" />
      </ListItem>
    );
  }
}

PlaceListItem.propTypes = {
  place: PropTypes.object,
  setSelectedPlace: PropTypes.func
};

export default PlaceListItem;
