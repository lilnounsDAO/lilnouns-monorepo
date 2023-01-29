import React, { useCallback, useEffect } from 'react';
import classes from './ProposalNavigation.module.css';
import { useHistory } from 'react-router';
import navBarButtonClasses from '../NavBarButton/NavBarButton.module.css';
import clsx from 'clsx';

const ProposalNavigation: React.FC<{
    isFirstProposal: boolean;
    isLastProposal: boolean;
    onPrevProposalClick: () => void;
    onNextProposalClick: () => void;
    isShowVoteModalOpen: boolean;
}> = props => {
    const { isFirstProposal, isLastProposal, onPrevProposalClick, onNextProposalClick, isShowVoteModalOpen } = props;

    const history = useHistory();

    // Page through Nouns via keyboard
    // handle what happens on key press
    const handleKeyPress = useCallback(
        event => {
            if (event.key === 'ArrowLeft') {

                if (!isFirstProposal) {
                    onPrevProposalClick();
                }
            }
            if (event.key === 'ArrowRight') {
                if (!isLastProposal) {
                    onNextProposalClick();
                }
            }
        },
        [
            history,
            isFirstProposal,
            isLastProposal,
            onNextProposalClick,
            onPrevProposalClick,
        ],
    );

    useEffect(() => {
        if(isShowVoteModalOpen == true) return;
        // attach the event listener
        document.addEventListener('keydown', handleKeyPress);

        // remove the event listener
        return () => {
            document.removeEventListener('keydown', handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            <button
                onClick={() => onPrevProposalClick()}
                className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}
                disabled={isFirstProposal}
            >
                ←
            </button>
            <button
                onClick={() => onNextProposalClick()}
                className={clsx(classes.backButton, navBarButtonClasses.whiteInfo)}
                disabled={isLastProposal}
            >
                →
            </button>
        </>
    );
};
export default ProposalNavigation;
