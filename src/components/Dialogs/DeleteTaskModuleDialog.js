import React from 'react';
// import classes from './DeleteTaskModuleDialog.scss';
import Wrapper from '../../hoc/Wrapper';
import Button from '../Buttons/Button';

const DeleteTaskModuleDialog = ({
  moduleToDeleteId,
  confirmModuleDeletion,
  hideModal,
  modalId,
}) => (
  <Wrapper>
    <h5>Really delete Module of id:</h5>
    <p>{moduleToDeleteId}</p>
    <br />
    <Button
      action={() =>
        confirmModuleDeletion(moduleToDeleteId, () => hideModal(modalId))}
    >
      Yes
    </Button>
    <Button action={() => hideModal(modalId)}>No</Button>
  </Wrapper>
);

export default DeleteTaskModuleDialog;
