import React from 'react';
import ReactDOMServer from 'react-dom/server';
import PropTypes from 'prop-types';

class InfoWindow extends React.Component {

    render() {
        return null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.map !== prevProps.map) {
            this.renderInfoWindow();
        }
        if (this.props.selectedPlace !== prevProps.selectedPlace) {
            this.updateContent();
            if (this.props.selectedPlace === null) {
                this.closeWindow();
            } 
            else {
                this.openWindow();
            }
        }
    }

    renderInfoWindow() {
        const google = this.props.google;
        this.infoWindow = new google.maps.InfoWindow({
            content: ''
        });
        google.maps.event.addListener(this.infoWindow, 'closeclick', () => this.props.closeclick());
    }

    updateContent() {
        if (this.infoWindow) {
            const content = (<div>
                    {this.props.selectedPlace !== null ? this.props.selectedPlace.name : ''}
                </div>);
            const contentString = ReactDOMServer.renderToString(content);
            this.infoWindow.setContent(contentString);
        }
    }

    renderChildren() {
        const children = this.props.children;
        return ReactDOMServer.renderToString(children);
    }

    getPosition() {
        const maps = this.props.google.maps;
        const location = this.props.selectedPlace.geometry.location;
        const anchorPoint = new maps.Point(0, -40);
        const position = new maps.MVCObject();
        position.setValues({
            position: location,
            anchorPoint: anchorPoint
        });
        return position;
    }

    openWindow() {
        this.infoWindow.open(this.props.map, this.getPosition());
    }

    closeWindow() {
        this.infoWindow.close();
    }

}

InfoWindow.propTypes = {
    selectedPlace: PropTypes.object,
    map: PropTypes.object,
    google: PropTypes.object,
    mapCenter: PropTypes.object,
    children: PropTypes.object,
    closeclick: PropTypes.func
}

export default InfoWindow;