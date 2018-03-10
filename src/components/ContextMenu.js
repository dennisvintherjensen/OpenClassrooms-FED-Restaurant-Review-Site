// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

const styles = {
  menu: {
    position: 'absolute',
    background: '#fff',
    'z-index': 100
  }
};

/**
 * Context menu with options for when right clicking the map
 */
class ContextMenu extends React.Component {
  /**
   * Rendering
   */
  render() {
    if (!this.props.open) {
      return null;
    }
    const classes = this.props.classes;
    return (
      <div className={classes.menu} style={this.positionStyle()}>
        <List dense>
          <ListItem button onClick={(_) => this.props.addRestaurant()}>
            <ListItemText primary="Add Restaurant" />
          </ListItem>
        </List>
      </div>
    );
  }
  /**
   * Position is calculated so that the context menu will not end up outside the map
   * - E.g: If right click occurs close to the right border of the map, we will display the menu on the left side of the clicked position
   * - default is right side of the position
   */
  positionStyle() {
    const y = this.props.position.y;
    const x = this.props.position.x;
    const height = window.innerHeight;
    const width = window.innerWidth - 400;
    let position = {};
    if (y + 50 > height) {
      position.top = `${y - 40}px`;
    } else {
      position.top = `${y + 5}px`;
    }
    if (x + 150 > width) {
      position.left = `${x - 120}px`;
    } else {
      position.left = `${x + 5}px`;
    }
    return position;
  }
}

ContextMenu.props = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  position: PropTypes.object,
  addRestaurant: PropTypes.func
};

export default withStyles(styles)(ContextMenu);
