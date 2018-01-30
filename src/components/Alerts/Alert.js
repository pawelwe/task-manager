import React, { Component } from 'react';
import classes from './Alert.scss';

class Alert extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    let { show, children, action, id } = this.props;
    return (
      <div
        className={classes.Alert}
        style={{
          left: show ? '30px' : '-320px',
          opacity: show ? '1' : '0.2',
        }}
      >
      <span
        className={classes.Alert_removeBtn}
        onClick={() => {
          action(id, false);
        }}
      />
        {children}
      </div>
    )
  }
}

export default Alert;
