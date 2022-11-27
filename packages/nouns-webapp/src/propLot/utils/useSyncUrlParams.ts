import { useEffect } from 'react';
/**
 * Syncs PropLot GraphQL filters to the URL
 */
const useSyncURLParams = (appliedFilters: string[]) => {
  useEffect(() => {
    const urlParams = appliedFilters.join('&');
    const currentURLParams = window.location.search;
    const currentRoute = window.location.pathname;

    if (urlParams && urlParams !== currentURLParams) {
      window.history.pushState('', '', `${currentRoute}?${urlParams}`);
    }
  }, [appliedFilters]);
};

export default useSyncURLParams;
