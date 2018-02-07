import React, { Component } from 'react';
import Transition from 'react-transition-group/Transition';
import Modal from './Modal';
import DeleteTaskModuleDialog from '../../components/Dialogs/DeleteTaskModuleDialog';

class ModalContainer extends Component {
  state = {
    modals: {
      deleteModuleModal: {
        shown: false,
        params: null,
      },
    },
  };

  componentDidMount() {
    this.props.onRef(this);
  }

  componentDidUpdate() {
    console.info('Modal Container updated!');
  }

  componentWillUnmount() {
    this.props.onRef(undefined);
  }

  toggleModal = (modalName, toggle = false, params = null) => {
    this.setState({
      modals: {
        [modalName]: {
          shown: toggle,
          params: params,
        },
      },
    });
  };

  render() {
    return (
      <Transition
        in={this.state.modals.deleteModuleModal.shown}
        timeout={{ enter: 1000, exit: 450 }}
        mountOnEnter
        unmountOnExit
        onEntered={() => {
          console.info('Modal entered');
        }}
        onExited={() => {
          console.info('Modal exited');
        }}
      >
        {state => (
          <Modal
            id="deleteModuleModal"
            transitionState={state}
            toggle={this.toggleModal}
          >
            <DeleteTaskModuleDialog
              confirmModuleDeletion={this.props.removeTaskModule}
              hideModal={this.toggleModal}
              moduleToDeleteId={this.state.modals.deleteModuleModal.params}
              modalId="deleteModuleModal"
            />
          </Modal>
        )}
      </Transition>
    );
  }
}

export default ModalContainer;
