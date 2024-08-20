import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const getCountdownCopy = (startTime: number, endTime: number) => {
  const startDate = dayjs.unix(startTime);
  const endDate = dayjs.unix(endTime);

  const now = dayjs();

  if (now?.isBefore(startDate)) {
    return `starts ${endDate.fromNow()}`;
  } else if (now?.isBefore(endDate)) {
    return `ends ${dayjs(endDate).fromNow()}`;
  } else {
    return `ended ${dayjs(endDate).fromNow()}`;
  }
};

export interface StartOrEndTimeProps {
  startTime?: number;
  endTime?: number;
}

export default function StartOrEndTime({ startTime, endTime }: StartOrEndTimeProps) {
  return <>{getCountdownCopy(startTime ?? 0, endTime ?? 0)}</>;
}
