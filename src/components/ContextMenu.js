import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';

const styles = {
  menu: {
    position: 'absolute',
    background: '#fff',
    'z-index': 100
  }
};

class ContextMenu extends React.Component {
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
  position: PropTypes.object
};

export default withStyles(styles)(ContextMenu);
