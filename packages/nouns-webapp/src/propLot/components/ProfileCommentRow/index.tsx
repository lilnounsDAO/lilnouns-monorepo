import { useEffect } from 'react';

import { useReverseENSLookUp } from '../../../utils/ensLookup';
import { useShortAddress } from '../../../utils/addressAndENSDisplayUtils';
import { getPropLotProfile_propLotProfile_list_Comment as Comment } from '../../graphql/__generated__/getPropLotProfile';
import Card from 'react-bootstrap/Card';
import moment from 'moment';

import { useLazyQuery } from '@apollo/client';
import { BigNumber as EthersBN } from 'ethers';
import { StandaloneNounCircular } from '../../../components/StandaloneNoun';
import { NOUNS_BY_OWNER_SUB } from '../../../wrappers/subgraph';

const ProfileCommentRow = ({ comment }: { comment: Comment }) => {
  const { idea, parent, parentId, createdAt, body } = comment;
  const wallet = parentId && parent ? parent.authorId : idea?.creatorId;
  const ens = useReverseENSLookUp(wallet || '');
  const shortAddress = useShortAddress(wallet || '');

  const [getNounsByOwnerQuerySub, { data: getNounsByOwnerDataSub }] = useLazyQuery(
    NOUNS_BY_OWNER_SUB,
    {
      context: {
        clientName: 'LilNouns',
      },
    },
  );

  useEffect(() => {
    if (!!parent) {
      getNounsByOwnerQuerySub({
        variables: {
          id: parent.authorId.toLowerCase(),
        },
      });
    }
  }, [parent]);

  const lilNounData = getNounsByOwnerDataSub?.account?.nouns || [];

  return (
    <Card className="border border-[#E2E3E8] !rounded-[16px] box-border bg-white">
      <Card.Header className="bg-white font-semibold text-[#8C8D92] text-[12px] !rounded-[16px] !border-0">
        <div className="flex flex-1 flex-row items-center gap-[8px] border-solid !border-[#E2E3E8] border-b-1 border-l-0 border-r-0 border-t-0 pb-[8px]">
          <span className="flex text-[#8C8D92] overflow-hidden gap-[8px] items-center">
            {Boolean(lilNounData.length) ? (
              <StandaloneNounCircular
                nounId={EthersBN.from(lilNounData[0].id)}
                styleOverride="!w-[20px] !h-[20px]"
              />
            ) : (
              <span>{idea?.id}</span>
            )}
            <span className="truncate">{ens || shortAddress}</span>
          </span>
          <span className="text-[#212529] truncate">
            {parentId && parent ? parent.body : idea?.title}
          </span>
        </div>
      </Card.Header>
      <Card.Body className="flex flex-col !p-[16px] gap-[8px]">
        <Card.Text className="font-medium text-[16px] text-[#212529] !mb-[0px] !p-[0px]">
          {body}
        </Card.Text>
        <Card.Text className="font-semibold text-[12px] text-[#8C8D92] !mb-[0px] !p-[0px]">
          {moment(createdAt).format('MMM Do YYYY')}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default ProfileCommentRow;
