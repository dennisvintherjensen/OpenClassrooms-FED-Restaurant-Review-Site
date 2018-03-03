import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';

const styles = {
  panorama: {
    height: '200px',
    width: '100%'
  }
};

class Panorama extends React.Component {
  constructor(props) {
    super(props);
    this.panorama = null;
  }

  componentDidMount() {
    this.renderPanorama();
  }

  componentDidUpdate(prevProps) {
    if (this.props.place.place_id !== prevProps.place.place_id) {
      this.renderPanorama();
    }
  }

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

  render() {
    const classes = this.props.classes;
    return <div ref="panorama" className={classes.panorama} />;
  }
}

Panorama.propTypes = {
  place: PropTypes.object,
  classes: PropTypes.object.isRequired,
  google: PropTypes.object
};

export default withStyles(styles)(Panorama);
