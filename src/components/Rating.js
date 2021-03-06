// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import StarIcon from 'material-ui-icons/Star';
import Typography from 'material-ui/Typography';
// Using imported CSS as oposed to CSS in JSX due to larger amount of CSS and child classes being overwritten
import './Rating.css';

/**
 * Rating component with functionality to both show rating and to act as input
 */
class Rating extends React.Component {
  /**
   * Rendering
   */
  render() {
    return (
      <div className="star-rating">
        {this.props.prependText ? (
          <span className="prepend-text">{this.props.prependText}</span>
        ) : null}
        {this.renderValue()}
        {this.renderRating()}
      </div>
    );
  }
  /**
   * Display the current rating if available
   */
  renderValue() {
    if (this.props.value > 0 && !this.props.editable) {
      return (
        <Typography className="value" type="caption">
          {Number(this.props.value).toFixed(1)}
        </Typography>
      );
    }
  }
  /**
   * Render the filled and empty stars
   */
  renderRating() {
    if (this.props.value > 0 || this.props.editable) {
      const style = {
        width: this.props.value / this.props.max * 100 + '%'
      };
      const classNames = this.props.editable ? 'editable stars' : 'stars';
      return (
        <div className={classNames}>
          <div className="filled" style={style}>
            {this.renderStars(this.props.max)}
          </div>
          <div className="empty">{this.renderStars(this.props.max)}</div>
        </div>
      );
    }
    return <div className="no-rating">No rating</div>;
  }
  /**
   * Renders an amount of stars
   */
  renderStars(amount) {
    const stars = [];
    while (stars.length < amount) {
      let star;
      const rating = stars.length + 1;
      if (this.props.editable) {
        star = (
          <StarIcon
            className="star"
            key={stars.length}
            onClick={(_) => this.props.onClick(rating)}
          />
        );
      } else {
        star = <StarIcon className="star" key={stars.length} />;
      }
      stars.push(star);
    }
    return stars;
  }
}

Rating.defaultProps = {
  max: 5,
  value: 0,
  editable: false
};

Rating.propTypes = {
  max: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  count: PropTypes.number,
  editable: PropTypes.bool,
  onClick: PropTypes.func,
  prependText: PropTypes.string
};

export default Rating;
