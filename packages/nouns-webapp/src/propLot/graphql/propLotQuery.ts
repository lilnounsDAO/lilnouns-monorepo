import { gql } from '@apollo/client';

export const GET_PROPLOT_QUERY = gql`
  query getPropLot($options: PropLotInputOptions!) {
    propLot: getPropLot(options: $options) {
      metadata {
        requestUUID
        appliedFilters {
          key
          value
        }
      }
      sections {
        __typename
        ... on UIPropLotComponentList {
          list {
            __typename
            ... on UIIdeaRow {
              data {
                id
                title
                tldr
                creatorId
                description
                votecount
                createdAt
              }
            }
          }
        }
        ... on UIPropLotFilterBar {
          filters {
            id
            type
            label
            options {
              id
              label
              selected
              target {
                __typename
                ... on TargetFilterParam {
                  param {
                    key
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
