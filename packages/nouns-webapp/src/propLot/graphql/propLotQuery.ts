import { gql } from '@apollo/client';

export const GET_PROPLOT_QUERY = gql`
  query getPropLot($options: PropLotInputOptions!) {
    propLot: getPropLot(options: $options) {
      ideas {
        id
        title
        tldr
        creatorId
        description
        votecount
        createdAt
        ideaStats {
          comments
        }
        votes {
          id
          voterId
          ideaId
          direction
          voter {
            wallet
            lilnounCount
          }
        }
      }
      sortFilter {
        ...filterProperties
      }
      dateFilter {
        ...filterProperties
      }
      tagFilter {
        ...filterProperties
      }
      metadata {
        requestUUID
        appliedFilters {
          id
          value
        }
      }
    }
  }

  fragment filterProperties on PropLotFilter {
    id
    type
    label
    options {
      id
      label
      selected
      value
    }
  }
`;
