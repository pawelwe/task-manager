import React, { Component } from 'react';
import classes from './Modal.scss';
import Backdrop from '../Backdrop/Backdrop';
import Wrapper from '../../hoc/Wrapper';

class Modal extends Component {
  componentDidUpdate() {
    console.info('Modal updated!');
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.show !== this.props.show;
  }

  render() {
    let { show, toggle, id, children } = this.props;
    return (
      <Wrapper>
        <Backdrop
          show={show}
          action={() => {
            toggle(id, false);
          }}
        />
        <div
          className={classes.Modal}
          style={{
            marginLeft: show ? '0' : '-110%',
            opacity: show ? '1' : '0.8',
          }}
        >
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
