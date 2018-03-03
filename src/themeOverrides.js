import { createMuiTheme } from 'material-ui/styles';

export const themeOverrides = createMuiTheme({
  overrides: {
    MuiFormLabel: {
      focused: {
        color: '#9C27B0'
      }
    },
    MuiInput: {
      inkbar: {
        '&:after': {
          'background-color': '#9C27B0'
        }
      }
    },
    MuiButton: {
      flatPrimary: {
        color: '#9C27B0'
      }
    },
    MuiTypography: {
      headline: {
        'font-size': '1.1rem',
        'font-weight': '400',
        'margin-bottom': '1px'
      },
      caption: {
        'margin-bottom': '3px'
      },
      title: {
        'font-size': '16px',
        'font-weight': '400',
        'margin-bottom': '3px'
      }
    },
    MuiList: {
      padding: {
        'padding-top': 0,
        'padding-bottom': 0
      },
      dense: {
        padding: 0,
        'word-break': 'break-all',
        'padding-top': 0,
        'padding-bottom': 0
      }
    },
    MuiListItem: {
      root: {
        display: 'flex',
        padding: '10px',
        'border-bottom': '1px solid rgba(0,0,0,.1)',
        '& > .avatar:not(:first-child)': {
          width: 80,
          height: 80
        },
        '& > .avatar:first-child': {
          'margin-right': '10px'
        },
        '& > .details': {
          flex: 1
        }
      },
      gutters: {
        'padding-left': '10px',
        'padding-right': '10px'
      }
    },
    MuiListItemText: {
      root: {
        padding: '0 10px'
      }
    },
    MuiExpansionPanelSummary: {
      root: {
        padding: '0 10px',
        'align-items': 'center'
      }
    },
    MuiExpansionPanelDetails: {
      root: {
        padding: '0 10px',
        'flex-wrap': 'wrap'
      }
    },
    MuiCardHeader: {
      root: {
        padding: '17px 10px 0 10px'
      },
      action: {
        'margin-right': '-10px',
        'margin-top': 0
      }
    }
  }
});
