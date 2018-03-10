// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { withStyles } from 'material-ui/styles';

const styles = {
  panorama: {
    height: '200px',
    width: '100%'
  }
};

/**
 * Panorama view which displays a Google Places panorama view
 */
class Panorama extends React.Component {
  /**
   * Constructor
   * @param {Object} prop
   */
  constructor(props) {
    super(props);
    this.panorama = null;
  }
  /**
   * LifeCycle
   */
  componentDidMount() {
    this.renderPanorama();
  }
  /**
   * LifeCycle
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    // Render new panorama is place has changed
    if (this.props.place.place_id !== prevProps.place.place_id) {
      this.renderPanorama();
    }
  }
  /**
   * Rendering
   */
  render() {
    const classes = this.props.classes;
    return <div ref="panorama" className={classes.panorama} />;
  }
  /**
   * Renders the panorama
   */
  renderPanorama() {
    this.panorama = new this.props.google.maps.StreetViewPanorama(
      this.refs.panorama,
      {
        position: this.props.place.geometry.location,
        disableDefaultUI: true,
        showRoadLabels: false,
        pov: {
          heading: 160,
          pitch: 0
        },
        zoom: 1
      }
    );
  }
}

Panorama.propTypes = {
  place: PropTypes.object,
  classes: PropTypes.object.isRequired,
  google: PropTypes.object
};

export default withStyles(styles)(Panorama);
