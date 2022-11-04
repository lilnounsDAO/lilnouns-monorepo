import { nounsTokenContract } from '../clients';
import { tryF, isError } from 'ts-try';

export const nounTokenCount = async (account: string) => {
  const data = await tryF(() => nounsTokenContract.getCurrentVotes(account));
  if (isError(data)) {
    console.error(`Error fetching votes for account ${account}: ${data.message}`);
    return;
  }
  return data?.toNumber();
};

export const nounsTotalSupply = async () => {
  const data = await tryF(() => nounsTokenContract.totalSupply());
  if (isError(data)) {
    console.error(`Error fetching total supply`);
    return;
  }
  return data?.toNumber();
};
