import React, { Component } from 'react';
import { getDisplayName } from '../utils/getDisplayName';

const asyncComponent = importComponent => {
  class AsyncComponent extends Component {
    state = {
      component: null,
    };

    componentDidMount() {
      importComponent().then(cmp => {
        this.setState({ component: cmp.default });
      });
    }

    render() {
      const C = this.state.component;
      return C ? <C {...this.props} /> : null;
    }
  }
  asyncComponent.displayName = `AsyncComponent(${getDisplayName(
    asyncComponent,
  )})`;
  return AsyncComponent;
};

export default asyncComponent;
