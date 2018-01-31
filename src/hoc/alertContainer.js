import React, { Component } from 'react';
import Alert from '../components/Alerts/Alert';
import Wrapper from './Wrapper';
import { getDisplayName } from '../utils/getDisplayName';

const alertContainer = WrappedComponent => {
  class AlertContainer extends Component {
    state = {
      alerts: {
        addTaskInputAlert: {
          shown: false,
          text: 'Please correct new task fields',
        },
        addModuleInputAlert: {
          shown: false,
          text: 'Please correct new module fields',
        },
      },
    };

    alertDisplayTime = 4000;

    toggleAlert = (alertName, toggle) => {
      console.info('Alert:', alertName, toggle ? 'on' : 'off');
      if (!alertName) {
        console.warn('No alert name!');
        return;
      }
      let nextAlerts = { ...this.state.alerts };

      // Clear previous timeouts
      Object.keys(this.state.alerts).forEach(alert => {
        clearTimeout(this[`${alert}Timeout`]);
        this[`${alert}Timeout`] = undefined;
      });

      // If next alert
      if (toggle) {
        let alertsToHide = Object.keys(nextAlerts)
          .map(alert => {
            // Hide previous alerts
            return {
              [alert]: {
                ...nextAlerts[alert],
                shown: false,
              },
            };
          })
          .reduce((result, item) => {
            // Convert to Object
            let key = Object.keys(item)[0];
            result[key] = item[key];
            return result;
          }, {});

        // AutoHide alerts
        this[`${alertName}Timeout`] = setTimeout(() => {
          this.toggleAlert(alertName, false);
        }, this.alertDisplayTime);

        nextAlerts = alertsToHide;
      }

      // Show next alert, as the all alerts are hidden at this point
      if (!nextAlerts[alertName]) return;
      nextAlerts[alertName].shown = toggle;

      this.setState(() => {
        return {
          alerts: nextAlerts,
        };
      });
    };

    render() {
      return (
        <Wrapper>
          <WrappedComponent
            toggleAlert={this.toggleAlert}
            {...this.props}
          />
          <Alert
            id="addModuleInputAlert"
            show={this.state.alerts.addModuleInputAlert.shown}
            action={this.toggleAlert}
          >
            <p>{this.state.alerts.addModuleInputAlert.text}</p>
          </Alert>
          <Alert
            id="addTaskInputAlert"
            show={this.state.alerts.addTaskInputAlert.shown}
            action={this.toggleAlert}
          >
            <p>{this.state.alerts.addTaskInputAlert.text}</p>
          </Alert>
        </Wrapper>
      );
    }
  }
  alertContainer.displayName = `AlertContainer(${getDisplayName(
    WrappedComponent,
  )})`;
  return AlertContainer;
};

export default alertContainer;
