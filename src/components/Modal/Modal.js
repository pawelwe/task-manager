import React, { Component } from 'react';
import classes from './Modal.scss';
import Backdrop from '../Backdrop/Backdrop';
import Wrapper from '../../hoc/Wrapper';

class Modal extends Component {
  componentDidUpdate(prevProps) {
    console.info('Modal updated!');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.transitionState === 'entering' ||
      nextProps.transitionState === 'exiting'
    );
  }

  render() {
    let { toggle, id, children, transitionState } = this.props;

    const cssClasses = [
      classes.Modal,
      transitionState === 'entering' ? classes.isOpen : null,
      transitionState === 'exiting' ? classes.isClosed : null,
    ];

    return (
      <Wrapper>
        <Backdrop
          transitionState={transitionState}
          action={() => {
            toggle(id, false);
          }}
        />
        <div className={cssClasses.join(' ')}>
          <span
            className={classes.Modal_removeBtn}
            onClick={() => {
              toggle(id, false);
            }}
          />
          {children}
        </div>
      </Wrapper>
    );
  }
}

export default Modal;
