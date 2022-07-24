import { nounsTokenContract } from '../clients';
import { tryF, isError } from 'ts-try';

export const nounTokenCount = async (account: string) => {
  const data = await tryF(() => nounsTokenContract.balanceOf(account));
  if (isError(data)) {
    console.error(`Error fetching votes for account ${account}: ${data.message}`);
    return;
  }
  return data?.toNumber();
};
