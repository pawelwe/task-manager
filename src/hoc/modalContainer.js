import React, { Component } from 'react';
import Transition from 'react-transition-group';
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

    render() {
      return (
        <Transition
          in={this.state.modals.deleteModuleModal.shown}
          timeout={1450}
          // mountOnEnter
          // unmountOnExit
        >
          {state => (
            <Wrapper>
              <WrappedComponent
                show={
                  state
                }
                toggleModal={this.toggleModal}
                {...this.props}
              />

              <Modal
                id="deleteModuleModal"
                // show={state}
                test={}
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
          )}
        </Transition>
      );
    }
  }
  modalContainer.displayName = `ModalContainer(${getDisplayName(
    WrappedComponent,
  )})`;
  return ModalContainer;
};

export default modalContainer;
