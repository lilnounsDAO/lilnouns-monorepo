import { useEffect } from 'react';
import redirects from '../../redirects.json'; // replace with the path to your json file

interface Redirections {
    [key: string]: string;
  }

const RedirectToStandalone: React.FC<{
    id: string
  }> = props => {
    const { id } = props;

    const redirections: Redirections = redirects;

  useEffect(() => {
    const redirectId = redirections[id];
    if (redirectId) {
      window.location.href = `https://lilnouns.proplot.wtf/idea/${redirectId}`;
    }
  }, [id]);

  return null;
};

export default RedirectToStandalone;
