// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import Button from 'material-ui/Button';
import Input, { InputLabel, InputAdornment } from 'material-ui/Input';
import { FormControl, FormHelperText } from 'material-ui/Form';
import Dialog, {
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';

const styles = {
  form: {
    display: 'flex',
    'flex-wrap': 'wrap',
    'justify-content': 'space-between'
  },
  textField: {
    width: '48%'
  },
  formHelp: {
    'margin-top': '10px',
    'text-align': 'right'
  }
};

class AddPlaceDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      vicinity: '',
      website: '',
      phone: '',
      location: null
    };
  }

  initAutocomplete(input) {
    if (this.props.google && this.props.map && input) {
      const google = this.props.google;
      const bounds = this.props.map.getBounds();
      this.autocomplete = new google.maps.places.Autocomplete(input, {
        types: ['geocode'],
        bounds: bounds
      });
      this.autocomplete.addListener('place_changed', (event) =>
        this.onAddressSelect(event)
      );
    }
  }

  render() {
    const classes = this.props.classes;
    return (
      <div>
        <Dialog open={this.props.open} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Thanks for participating
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              You may add a new restaurant by filling in the fields below and
              submitting.
            </DialogContentText>
            <form className={classes.form} noValidate>
              <FormControl classes={{ root: classes.textField }}>
                <InputLabel>Name</InputLabel>
                <Input
                  name="name"
                  type="text"
                  margin="dense"
                  onChange={(event) => this.handleChange(event)}
                  required
                />
              </FormControl>
              <FormControl classes={{ root: classes.textField }}>
                <InputLabel>Address</InputLabel>
                <Input
                  name="vicinity"
                  type="text"
                  margin="dense"
                  inputRef={(input) => this.initAutocomplete(input)}
                  required
                />
                <FormHelperText>
                  Start typing, then select a suggested address
                </FormHelperText>
              </FormControl>
              <FormControl classes={{ root: classes.textField }}>
                <InputLabel>Website</InputLabel>
                <Input
                  name="website"
                  type="text"
                  margin="dense"
                  startAdornment={
                    <InputAdornment position="start">https://</InputAdornment>
                  }
                  onChange={(event) => this.handleChange(event)}
                />
              </FormControl>
              <FormControl classes={{ root: classes.textField }}>
                <InputLabel>Phone</InputLabel>
                <Input
                  name="phone"
                  type="text"
                  margin="dense"
                  onChange={(event) => this.handleChange(event)}
                />
              </FormControl>
            </form>
            <Typography className={classes.formHelp} type="caption">
              Fields marked with * are required
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={(_) => this.closeDialog()}>
              Cancel
            </Button>
            <Button
              color="primary"
              disabled={!this.validForm()}
              onClick={(_) => this.submitForm()}
            >
              Add
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }

  handleChange(event) {
    const update = {};
    update[event.target.name] = event.target.value;
    this.setState(update);
  }

  onAddressSelect() {
    const place = this.autocomplete.getPlace();
    this.setState({
      location: place.geometry.location,
      vicinity: place.formatted_address
    });
  }

  validForm() {
    return (
      this.state.name !== '' &&
      this.state.vicinity !== '' &&
      this.state.location !== null
    );
  }

  submitForm() {
    const place = {
      name: this.state.name,
      vicinity: this.state.vicinity,
      website: this.state.website,
      phone: this.state.phone,
      geometry: {
        location: {
          lat: this.state.location.lat(),
          lng: this.state.location.lng()
        }
      }
    };
    this.props.submitPlace(place);
  }

  closeDialog() {
    this.setState({
      name: '',
      vicinity: '',
      website: '',
      phone: ''
    });
    this.props.dialogClosed();
  }
}

AddPlaceDialog.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool,
  dialogClosed: PropTypes.func,
  submitPlace: PropTypes.func,
  google: PropTypes.object,
  map: PropTypes.object
};

export default withStyles(styles)(AddPlaceDialog);
