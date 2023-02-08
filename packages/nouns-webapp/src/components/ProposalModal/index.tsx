import { RouteComponentProps } from 'react-router-dom';
import Modal from 'react-modal';
import clsx from 'clsx';
import classes from './ProposalModal.module.css';
import { useState } from 'react';
import { Proposal } from '../../wrappers/nounsDao';


const ProposalModal = ({
  match: {
    params: { id },
  },
}: RouteComponentProps<{ id: string }>) => {

    const [open, setOpen] = useState(true)
    const handleClosePropModal = () => {
      // if (!community || !round) return;
      // dispatch(setModalActive(false));
      // navigate(buildRoundPath(community, round), { replace: false });
    };

  return (
    <>
      <Modal
        isOpen={open}
        onRequestClose={() => handleClosePropModal()}
        className={clsx(classes.modal, 'proposalModalContainer')}
        id="propModal"
      >
        aaa
      </Modal>
    </>
  );
};
export default ProposalModal;
