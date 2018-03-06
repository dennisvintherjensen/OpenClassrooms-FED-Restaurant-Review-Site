import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

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

  componentDidUpdate(prevProps) {
    if (this.props.place !== prevProps.place) {
      if (this.props.place === null) {
        this.closeWindow();
      } else {
        this.openWindow();
      }
    }
  }

  openWindow() {
    // @TODO: Keep this inside the map window (calculate)
    const infoWindow = this.refs.infoWindow;
    infoWindow.textContent = this.props.place.name;
    infoWindow.style.top = this.props.point.y - 55 + 'px';
    infoWindow.style.left = this.props.point.x + 32 + 'px';
    infoWindow.style.display = 'block';
  }

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
