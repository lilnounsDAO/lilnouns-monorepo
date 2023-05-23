import { useHistory, useLocation } from 'react-router-dom';
import DelegationModal from '../../components/DelegationModal';
import { getAddressFromQueryParams } from '../../utils/getAddressFromQueryParams';
import { useEffect } from 'react';

const DelegatePage = () => {
  const { search } = useLocation();
  const delegateTo = getAddressFromQueryParams('to', search);

  const history = useHistory();

  const pageTitle = "Delegate my vote - Lil Nouns DAO";

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  if (!delegateTo || delegateTo.length === 0) {
    return <>
      <DelegationModal onDismiss={() => history.push('/vote')} />
    </>
  }

  return (
    <>
      <DelegationModal onDismiss={() => history.push('/vote')} delegateTo={delegateTo} />
    </>
  );
};

export default DelegatePage;