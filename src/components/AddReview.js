// React
import React from 'react';
import PropTypes from 'prop-types';
// Material
import { withStyles } from 'material-ui/styles';
import ExpansionPanel, {
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  ExpansionPanelActions
} from 'material-ui/ExpansionPanel';
import ExpandMoreIcon from 'material-ui-icons/ExpandMore';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';
import Input, { InputLabel } from 'material-ui/Input';
import { FormControl } from 'material-ui/Form';
// Custom
import Rating from './Rating';

const styles = {
  expanded: {
    'margin-top': 0
  },
  root: {
    'border-bottom': '1px solid rgba(0,0,0,.1)'
  },
  addReviewNote: {
    'margin-left': 'auto',
    'margin-top': '5px',
    'margin-right': '5px',
    'text-transform': 'uppercase'
  },
  formControl: {
    width: '49%',
    'margin-bottom': '10px'
  },
  formControlReview: {
    width: '100%'
  },
  expansionPanelDetails: {
    'flex-wrap': 'wrap',
    'justify-content': 'space-between'
  }
};

class AddReview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: '',
      lastName: '',
      review: '',
      rating: 0,
      expanded: false
    };
  }

  render() {
    const classes = this.props.classes;
    return (
      <ExpansionPanel
        classes={{ expanded: classes.expanded, root: classes.root }}
        elevation={0}
        expanded={this.state.expanded}
      >
        <ExpansionPanelSummary
          onClick={(_) => this.setState({ expanded: !this.state.expanded })}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography type="subheading">Reviews</Typography>
          <Typography classes={{ root: classes.addReviewNote }} type="caption">
            Add
          </Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails
          classes={{ root: classes.expansionPanelDetails }}
        >
          <FormControl classes={{ root: classes.formControl }} required>
            <InputLabel htmlFor="firstName">First Name</InputLabel>
            <Input
              id="firstName"
              value={this.state.firstName}
              onChange={(event) => this.handleOnChange(event)}
            />
          </FormControl>
          <FormControl classes={{ root: classes.formControl }} required>
            <InputLabel htmlFor="lastName">Last Name</InputLabel>
            <Input
              id="lastName"
              value={this.state.lastName}
              onChange={(event) => this.handleOnChange(event)}
            />
          </FormControl>
          <FormControl
            className={classes.formControl}
            classes={{ root: classes.formControlReview }}
            required
            fullWidth
          >
            <InputLabel htmlFor="review">Review</InputLabel>
            <Input
              id="review"
              value={this.state.review}
              onChange={(event) => this.handleOnChange(event)}
              multiline
              rows={5}
              fullWidth
            />
          </FormControl>
          <Rating
            prependText="Rating"
            editable={true}
            onClick={(rating) => this.setState({ rating: rating })}
            value={this.state.rating}
          />
        </ExpansionPanelDetails>
        <ExpansionPanelActions>
          <Button size="small" onClick={(_) => this.resetForm()}>
            Cancel
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={(_) => this.submitReview()}
            disabled={!this.validForm()}
          >
            Save
          </Button>
        </ExpansionPanelActions>
      </ExpansionPanel>
    );
  }

  handleOnChange(event) {
    const update = {};
    update[event.target.id] = event.target.value;
    this.setState(update);
  }

  validForm() {
    return (
      this.state.firstName !== '' &&
      this.state.lastName !== '' &&
      this.state.review !== '' &&
      this.state.rating !== 0
    );
  }

  submitReview() {
    const author_name = `${this.state.firstName} ${this.state.lastName}`;
    const id = author_name.replace(' ', '') + new Date().getTime().toString();
    const review = {
      author_name: author_name,
      rating: this.state.rating,
      text: this.state.review,
      time: id
    };
    this.props.submitReview(review);
    this.resetForm();
  }

  resetForm() {
    this.setState({
      expanded: false
    });
    this.setState({
      firstName: '',
      lastName: '',
      review: '',
      rating: 0
    });
  }
}

AddReview.propTypes = {
  classes: PropTypes.object.isRequired,
  submitReview: PropTypes.func
};

export default withStyles(styles)(AddReview);
