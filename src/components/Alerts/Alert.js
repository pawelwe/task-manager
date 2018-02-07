import React, { Component } from 'react';
import classes from './Alert.scss';

class Alert extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    let { show, children, action, id } = this.props;

    const cssClasses = [
      classes.Alert,
      show ? classes.isVisible : classes.isHidden,
    ];

    return (
      <div className={cssClasses.join(' ')}>
        <span
          className={classes.Alert_removeBtn}
          onClick={() => {
            action(id, false);
          }}
        />
        {children}
      </div>
    );
  }
}

export default Alert;
