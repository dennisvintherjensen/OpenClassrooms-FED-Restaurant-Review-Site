import React from 'react';
import PropTypes from 'prop-types';
import { ListItem } from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Typography from 'material-ui/Typography';
import Rating from './Rating';

class ReviewListItem extends React.Component {
  render() {
    const review = this.props.review;
    return (
      <ListItem elevation={0}>
        {review.profile_photo_url && review.profile_photo_url.length > 0 ? (
          <Avatar src={review.profile_photo_url} className="avatar" />
        ) : (
          <Avatar className="avatar">{this.getInitials()}</Avatar>
        )}
        <div className="details">
          <Typography type="title">{review.author_name}</Typography>
          <Rating max={5} value={review.rating} />
          <Typography type="caption">{review.text}</Typography>
        </div>
      </ListItem>
    );
  }

  getInitials() {
    return this.props.review.author_name
      .split(' ')
      .map((name) => name.substr(0, 1))
      .join('');
  }
}

ReviewListItem.propTypes = {
  review: PropTypes.object
};

export default ReviewListItem;
