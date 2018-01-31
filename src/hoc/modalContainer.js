import React, { Component } from 'react';
import Modal from '../components/Modal/Modal';
import { getDisplayName } from '../utils/getDisplayName';
import Wrapper from './Wrapper';
import DeleteTaskModuleDialog from '../components/Dialogs/DeleteTaskModuleDialog';

const modalContainer = WrappedComponent => {
  class ModalContainer extends Component {
    state = {
      modals: {
        deleteModuleModal: {
          shown: false,
          params: null,
        },
      },
      listDataFromChild: null,
    };

    toggleModal = (modalName, toggle = false, params) => {
      const newModals = { ...this.state.modals };
      newModals[modalName].shown = toggle;
      if (params) {
        newModals[modalName].params = params;
      }
      this.setState({
        modals: newModals,
      });
    };

    deleteModuleModalCb = test => {
      console.log('hello ', test);
    };

    render() {
      return (
        <Wrapper>
          <WrappedComponent
            deleteModuleModalShown={this.state.modals.deleteModuleModal.shown}
            deleteModuleModalCb={this.deleteModuleModalCb}
            toggleModal={this.toggleModal}
            {...this.props}
          />
          <Modal
            id="deleteModuleModal"
            show={this.state.modals.deleteModuleModal.shown}
            toggle={this.toggleModal}
          >
            <DeleteTaskModuleDialog
              confirmModuleDeletion={this.doParentToggle}
              hideModal={this.toggleModal}
              moduleToDeleteId={this.state.modals.deleteModuleModal.params}
              modalId="deleteModuleModal"
            />
          </Modal>
        </Wrapper>
      );
    }
  }
  modalContainer.displayName = `ModalContainer(${getDisplayName(
    WrappedComponent,
  )})`;
  return ModalContainer;
};

export default modalContainer;
