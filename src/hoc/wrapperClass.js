import React, { Component } from 'react';

function wrapperClass(WrappedComponent) {
  // ...and returns another component...
  return class extends Component {
    render() {
      // ... and renders the wrapped component with the fresh data!
      // Notice that we pass through any additional props
      return (<WrappedComponent {...this.props}>
          { this.props.children }
        </WrappedComponent>
        );
    }
  };
}

export default wrapperClass;
