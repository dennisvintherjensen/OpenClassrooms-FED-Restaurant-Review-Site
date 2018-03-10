// React
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Info window used for diplaying place details on the map
 * - Built in map-info-window is not used due to limitations:
 * -- for example, not being able to hide the "close" icon which is odd when it is only displayed on hover
 */
class InfoWindow extends React.Component {
  render() {
    const style = {
      background: '#fff',
      padding: '5px',
      zIndex: '1500',
      position: 'absolute',
      top: 0,
      left: 0,
      display: 'none',
      fontSize: '0.8rem'
    };
    return <div className="info-window" ref="infoWindow" style={style} />;
  }
  /**
   * LifeCycle
   * @param {Object} prevProps
   */
  componentDidUpdate(prevProps) {
    if (this.props.place !== prevProps.place) {
      if (this.props.place === null) {
        // No place is currently hovered
        this.closeWindow();
      } else {
        this.openWindow();
      }
    }
  }
  /**
   * Opens the window
   */
  openWindow() {
    // @TODO: Keep this inside the map window like the context menu
    const infoWindow = this.refs.infoWindow;
    infoWindow.textContent = this.props.place.name;
    infoWindow.style.top = this.props.point.y - 55 + 'px';
    infoWindow.style.left = this.props.point.x + 32 + 'px';
    infoWindow.style.display = 'block';
  }
  /**
   * Hides the window
   */
  closeWindow() {
    const infoWindow = this.refs.infoWindow;
    infoWindow.style.display = 'none';
  }
}

InfoWindow.propTypes = {
  place: PropTypes.object,
  point: PropTypes.object
};

export default InfoWindow;
