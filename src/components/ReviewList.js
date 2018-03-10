// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { withStyles } from 'material-ui/styles';
import List from 'material-ui/List';
// Custom
import ReviewListItem from './ReviewListItem';
import AddReview from './AddReview';

const styles = {
  list: {
    flex: 'none',
    padding: 0
  }
};

/**
 * A list of reviews for a place
 */
class ReviewList extends React.Component {
  /**
   * Rendering
   */
  render() {
    const classes = this.props.classes;
    return (
      <div>
        <AddReview submitReview={(review) => this.props.submitReview(review)} />
        {this.props.reviews ? (
          <List classes={{ root: classes.list }}>{this.renderReviews()}</List>
        ) : null}
      </div>
    );
  }
  /**
   * Renders each review
   */
  renderReviews() {
    return this.props.reviews.map((review, index) => {
      // The authors concatenated name and the time of the review is used as key for the React object
      const id = review.author_name.replace(' ', '') + review.time.toString();
      return <ReviewListItem review={review} key={id} />;
    });
  }
}

ReviewList.propTypes = {
  classes: PropTypes.object.isRequired,
  submitReview: PropTypes.func,
  reviews: PropTypes.array
};

export default withStyles(styles)(ReviewList);
