// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
// Custom
import Rating from './Rating';

const styles = {
  container: {
    display: 'flex',
    'align-items': 'center',
    'justify-content': 'space-between',
    padding: '20px'
  },
  caption: {
    color: '#fff'
  }
};

/**
 * A filter for limiting the displayed places to only those above a certain rating
 */
class RatingFilter extends React.Component {
  /**
   * Constructor
   * @param {Object} props
   */
  constructor(props) {
    super(props);
    this.state = {
      minRating: 1
    };
  }
  /**
   * Rendering
   */
  render() {
    const classes = this.props.classes;
    return (
      <div className={`primary-bg ${classes.container}`}>
        <Typography variant="caption" classes={{ root: classes.caption }}>
          Filter ratings below
        </Typography>
        <Rating
          editable={true}
          onClick={(rating) => this.handleChange(rating)}
          value={this.state.minRating}
        />
      </div>
    );
  }
  /**
   * Handler for when the value of the filter is changed
   * @param {number} rating
   */
  handleChange(rating) {
    this.setState(
      {
        minRating: rating
      },
      () => {
        this.props.setMinRating(this.state.minRating);
      }
    );
  }
}

RatingFilter.propTypes = {
  classes: PropTypes.object.isRequired,
  setMinRating: PropTypes.func
};

export default withStyles(styles)(RatingFilter);
