/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { BigNumberish } from '@ethersproject/bignumber';
import BigNumber from 'bignumber.js';

export interface IBid {
  id: string;
  bidder: {
    id: string;
  };
  amount: BigNumber;
  blockNumber: number;
  blockTimestamp: number;
  txIndex?: number;
  noun: {
    id: number;
    startTime?: BigNumberish;
    endTime?: BigNumberish;
    settled?: boolean;
  };
}

interface ProposalVote {
  reason: string;
  supportDetailed: 0 | 1 | 2;
  voter: {
    id: string;
  };
}

export interface ProposalVotes {
  votes: ProposalVote[];
}

export interface Delegate {
  id: string;
  delegatedVotes?: string;
  nounsRepresented: {
    id: string;
  }[];
}

export interface Delegates {
  delegates: Delegate[];
}

//TODO: figure out way to fetch seeds for more than first 1k
export const lilnounsSeedsQuery = (nounIds: string[], first = 1_000) => gql`
{
  seeds(first: ${first}, where: { id_in: ${JSON.stringify(nounIds)} } ) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
`;

export const seedsQuery = (first = 1_000) => gql`
{
  seeds(first: ${first}) {
    id
    background
    body
    accessory
    head
    glasses
  }
}
`;

export const proposalsQuery = (first = 1_000) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const bigNounsProposalsQuery = (first = 1_000) => gql`
{
  nounsProps: proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const partialProposalsQuery = (first = 1_000) => gql`
{
  proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    title
    status
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    quorumVotes
    executionETA
    startBlock
    endBlock
  }
}
`;

export const bigNounsPartialProposalsQuery = (first = 1_000) => gql`
{
  nounsProps: proposals(first: ${first}, orderBy: createdBlock, orderDirection: asc) {
    id
    title
    status
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    quorumVotes
    executionETA
    startBlock
    endBlock
  }
}
`;

export const proposalQuery = (id: string | number) => gql`
{
  proposal(id: ${id}) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const bigNounsProposalQuery = (id: string | number) => gql`
{
  nounsProp: proposal(id: ${id}) {
    id
    description
    status
    proposalThreshold
    quorumVotes
    forVotes
    againstVotes
    abstainVotes
    createdTransactionHash
    createdBlock
    startBlock
    endBlock
    executionETA
    targets
    values
    signatures
    calldatas
    proposer {
      id
    }
  }
}
`;

export const auctionQuery = (auctionId: number) => gql`
{
	auction(id: ${auctionId}) {
	  id
	  amount
	  settled
	  bidder {
	  	id
	  }
	  startTime
	  endTime
	  noun {
		id
		seed {
		  id
		  background
		  body
		  accessory
		  head
		  glasses
		}
		owner {
		  id
		}
	  }
	  bids {
		id
		blockNumber
		txIndex
		amount
	  }
	}
  }
  `;

export const bidsByAuctionQuery = (auctionId: string) => gql`
 {
	bids(where:{auction: "${auctionId}"}) {
	  id
	  amount
	  blockNumber
	  blockTimestamp
	  txIndex
	  bidder {
	  	id
	  }
	  noun {
		id
	  }
	}
  }
 `;

export const nounQuery = (id: string) => gql`
 {
	noun(id:"${id}") {
	  id
	  seed {
	  background
		body
		accessory
		head
		glasses
	}
	  owner {
		id
	  }
	}
  }
 `;

export const nounsIndex = () => gql`
  {
    nouns {
      id
      owner {
        id
      }
    }
  }
`;

// Subgraph queries are limited by 1000.
// As a result, site doesn't load auction when user attempts to fetch lil noun ids < latest 1000.
// To ensure lil noun Ids < latest 1000 are fetchable, fetch backwards by 1000 using given lil noun auction startTime.
export const latestAuctionsQuery = (auctionStartTime: number) => gql`
  {
    auctions(orderBy: startTime, orderDirection: desc, first: 1000, where: {startTime_lte: ${auctionStartTime}} ) {
      id
      amount
      settled
      bidder {
        id
      }
      startTime
      endTime
      noun {
        id
        owner {
          id
        }
      }
      bids {
        id
        amount
        blockNumber
        blockTimestamp
        txIndex
        bidder {
          id
        }
      }
    }
  }
`;

// Used to fetch startTime for lil noun at given id
export const singularAuctionQuery = (auctionNounId: string) => gql`
  {
    auctions(where: {id: ${auctionNounId}}) {
      id
      startTime
    }
  }
`;

export const latestBidsQuery = (first: number = 10) => gql`
{
	bids(
	  first: ${first},
	  orderBy:blockTimestamp,
	  orderDirection: desc
	) {
	  id
	  bidder {
		id
	  }
	  amount
	  blockTimestamp
	  txIndex
	  blockNumber
	  auction {
		id
		startTime
		endTime
		settled
	  }
	}
  }  
`;

export const nounVotingHistoryQuery = (nounId: number) => gql`
{
	noun(id: ${nounId}) {
		id
		votes {
      blockNumber
      proposal {
        id
      }
      support
      supportDetailed
      voter {
        id
      }
		}
	}
}
`;

export const nounTransferHistoryQuery = (nounId: number) => gql`
{
  transferEvents(where: {noun: "${nounId}"}) {
    id
    previousHolder {
      id
    }
    newHolder {
      id
    }
    blockNumber
  }
}
`;

export const nounDelegationHistoryQuery = (nounId: number) => gql`
{
  delegationEvents(where: {noun: "${nounId}"}) {
    id
    previousDelegate {
      id
    }
    newDelegate {
      id
    }
    blockNumber
  }
}
`;

export const createTimestampAllProposals = () => gql`
  {
    proposals(orderBy: createdTimestamp, orderDirection: asc, first: 1000) {
      id
      createdTimestamp
    }
  }
`;

export const proposalVotesQuery = (proposalId: string) => gql`
  {
    votes(where: { proposal: "${proposalId}", votesRaw_gt: 0 }) {
      supportDetailed
      reason
      voter {
        id
      }
    }	
  }
`;

export const proposalVotesQuerya = (proposalId: string) => gql`
  {
    aa:votes(where: { proposal: "${proposalId}", votesRaw_gt: 0 }) {
      supportDetailed
      voter {
        id
      }
    }	
  }
`;

export const delegateNounsAtBlockQuery = (delegates: string[], block: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegates)} }, block: { number: ${block} }) {
    id
    delegatedVotes
    nounsRepresented {
      id
    }
  }
}
`;

export const delegateLilNounsAtBlockQuery = (delegatess: string[], blocks: number) => gql`
{
  delegates(where: { id_in: ${JSON.stringify(delegatess)} }, block: { number: ${blocks} }) {
    id
    delegatedVotes
    nounsRepresented {
      id
    }
  }
}
`;

export const snapshotProposalsQuery = () => gql`
  {
    proposals(
      first: 1000
      skip: 0
      where: { space_in: ["leagueoflils.eth"] }
      orderBy: "created"
      orderDirection: desc
    ) {
      id
      title
      body
      choices
      start
      end
      snapshot
      state
      author
      scores
      space {
        id
        name
      }
    }
  }
`;

export const snapshotSingularProposalVotesQuery = (proposalId: string) => gql` {
  votes(where: {
    proposal: "${proposalId}"
  }) {
    id
    voter
    vp
    choice
  }
}
`;

export const snapshotProposalVotesQuery = (snapshotProposalId: string) => gql`
  {
  votes(orderBy: "vp", where: { proposal: "${snapshotProposalId}"}) {
    voter
    vp
    choice
    }

  }
`;

export const nounsInTreasuryQuery = () => gql`
  {
    accounts(where: { id: "0xd5f279ff9eb21c6d40c8f345a66f2751c4eea1fb" }) {
      id
      tokenBalance
      nouns {
        id
      }
    }
    delegates(
    where: {id: "0xdcb4117e3a00632efcac3c169e0b23959f555e5e"}
  ) {
    id
    delegatedVotes
    tokenHoldersRepresentedAmount
    nounsRepresented {
      id
    }
    tokenHoldersRepresented(where: {id_not: "0xd5f279ff9eb21c6d40c8f345a66f2751c4eea1fb"}) {
      id
      tokenBalance
    }
  }
  }
`;

export const lilNounsHeldByVoterQuery = (snapshotProposalVoterIds: string) => gql`
 query {
  tokens(
    where:{
      collectionAddresses:["0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B"],
      ownerAddresses: ${snapshotProposalVoterIds}
    },
    pagination: {limit: 500}
  ) {
    nodes {
      token {
        tokenId
        owner
      }
    }
  }
}
`;

export const delegatedLilNounsHeldByVoterQuery = (voterId: string) => gql`
  query {
    accounts(where: { id: ${voterId} }) {
      id
      delegate {
        id
        tokenHoldersRepresentedAmount
        nounsRepresented {
          id
        }
      }
    }
  }
`;

export const totalNounSupplyAtPropSnapshot = (proposalId: string) => gql`
{
  proposals(where: {id: ${proposalId}}) {
    totalSupply
  }
}
`;

export const propUsingDynamicQuorum = (propoaslId: string) => gql`
{
  lilnounsprop: proposal(id: "${propoaslId}") {
    quorumCoefficient 
  }
}
`;

export const bigNounPropUsingDynamicQuorum = (propoaslId: string) => gql`
{
  nounsProp: proposal(id: "${propoaslId}") {
    quorumCoefficient 
  }
}
`;

// Used for PropLot
export const NOUNS_BY_OWNER_SUB = gql`
  query account($id: String!) {
    account(id: $id) {
      id
      nouns {
        id
        seed {
          background
          body
          accessory
          head
          glasses
        }
      }
    }
  }
`;

export const LIL_NOUNS_GOVERNANCE_BY_OWNER_SUB = gql`
  query governanceProfile($id: String!) {
    votes(where: { voter: $id }) {
      proposal {
        id
        description
        status
        proposalThreshold
        quorumVotes
        forVotes
        againstVotes
        abstainVotes
        createdTransactionHash
        createdBlock
        startBlock
        endBlock
        executionETA
        targets
        values
        signatures
        calldatas
        proposer {
          id
        }
      }
      reason
      supportDetailed
    }

    proposals(where: { proposer: $id }) {
      id
      description
      status
      proposalThreshold
      quorumVotes
      forVotes
      againstVotes
      abstainVotes
      createdTransactionHash
      createdBlock
      startBlock
      endBlock
      executionETA
      targets
      values
      signatures
      calldatas
      proposer {
        id
      }
    }
  }
`;

export const SNAPSHOT_GOVERNANCE_BY_OWNER_SUB = gql`
  query governanceProfile($id: String!) {
    votes(orderBy: "vp", where: { voter: $id, space_in: ["leagueoflils.eth"] }) {
      voter
      vp
      choice
      id
      reason
      proposal {
        id
        title
        body
        choices
        start
        end
        snapshot
        state
        author
        scores
        space {
          id
          name
        }
      }
    }
  }
`;

export const BIG_NOUNS_PROPOSALS_SUB = gql`
  query bigNounsProposalData($ids: [String!]!) {
    proposals(where: { id_in: $ids }) {
      id
      description
      status
      proposalThreshold
      quorumVotes
      forVotes
      againstVotes
      abstainVotes
      createdTransactionHash
      createdBlock
      startBlock
      endBlock
      executionETA
      targets
      values
      signatures
      calldatas
      proposer {
        id
      }
    }
  }
`;

export const BIG_NOUNS_GOVERNANCE_BY_OWNER_SUB = gql`
  query governanceProfile($id: String!) {
    votes(where: { voter: $id }) {
      proposal {
        id
        description
        status
        proposalThreshold
        quorumVotes
        forVotes
        againstVotes
        abstainVotes
        createdTransactionHash
        createdBlock
        startBlock
        endBlock
        executionETA
        targets
        values
        signatures
        calldatas
        proposer {
          id
        }
      }
      supportDetailed
    }

    proposals(where: { proposer: $id }) {
      id
      description
      status
      proposalThreshold
      quorumVotes
      forVotes
      againstVotes
      abstainVotes
      createdTransactionHash
      createdBlock
      startBlock
      endBlock
      executionETA
      targets
      values
      signatures
      calldatas
      proposer {
        id
      }
    }
  }
`;

export const activeProposals = (id: string) => gql`
  {
    activeProps: proposals(
      where: {
        status: "ACTIVE"
        votes_: { voter_contains: "${id}" }
      }
      first: 100
      orderBy: createdBlock
      orderDirection: desc
    ) {
      id
      status
      createdBlock
      description
      proposalThreshold
      quorumVotes
      forVotes
      againstVotes
      abstainVotes
      createdTransactionHash
      startBlock
      endBlock
      executionETA
      targets
      values
      signatures
      calldatas
      proposer {
        id
      }
    }
  }
`;

export const clientFactory = (uri: string) =>
  new ApolloClient({
    uri,
    cache: new InMemoryCache(),
  });
