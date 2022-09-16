import { gql } from '@apollo/client';

export const propLotQuery = () =>{
  return gql`
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
        ...on UIPropLotComponentList {
          list {
            __typename
            ...on UIIdeaRow {
              data {
                id
                title
                tldr
                creatorId
              }
            }
          }
        }
        ...on UIPropLotFilterBar {
          sortPills {
            id
            pills {
              __typename
              ...on UITogglePill {
                id
                label
                options {
                  id
                  label
                  selected
                  target {
                    __typename
                    ...on TargetFilterParam {
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
    }
  }
`};