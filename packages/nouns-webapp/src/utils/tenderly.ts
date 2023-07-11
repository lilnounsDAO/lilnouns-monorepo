import { utils } from 'ethers';
import axios from 'axios';
import { CHAIN_ID } from '../config';

const { REACT_APP_TENDERLY_ACCESS_KEY, REACT_APP_TENDERLY_USERNAME, REACT_APP_TENDERLY_PROJECT } =
  process.env;

export const simulateTransaction = async (
  from: string,
  to: string,
  calldata: any,
  value: number,
  abi: utils.Interface | undefined,
  funcName: string,
) => {
  //   if (!abi?.functions[funcName]) {
  //     throw new Error(`Function ${funcName} is not defined in the provided ABI`);
  //   }

  const func = funcName.substring(0, funcName.indexOf('('));
  const encodedData = abi ? abi.encodeFunctionData(func, JSON.parse(calldata)) : '0x';

  const apiURL = `https://api.tenderly.co/api/v1/account/${REACT_APP_TENDERLY_USERNAME}/project/${REACT_APP_TENDERLY_PROJECT}/simulate`;
  const body = {
    network_id: CHAIN_ID,
    from: from,
    to: to,
    input: encodedData,
    value: value.toString(),
  };

  const headers = {
    headers: {
      'content-type': 'application/JSON',
      'X-Access-Key': REACT_APP_TENDERLY_ACCESS_KEY as string,
    },
  };
  const resp = await axios.post(apiURL, body, headers);

  return resp;
};