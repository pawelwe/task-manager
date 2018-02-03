import React, { Component } from 'react';
import Modal from './Modal';
import Wrapper from '../../hoc/Wrapper';
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
      <Wrapper>
        <Modal
          id="deleteModuleModal"
          show={this.state.modals.deleteModuleModal.shown}
          toggle={this.toggleModal}
        >
          <DeleteTaskModuleDialog
            confirmModuleDeletion={this.props.removeTaskModule}
            hideModal={this.toggleModal}
            moduleToDeleteId={this.state.modals.deleteModuleModal.params}
            modalId="deleteModuleModal"
          />
        </Modal>
      </Wrapper>
    );
  }
}

export default ModalContainer;
