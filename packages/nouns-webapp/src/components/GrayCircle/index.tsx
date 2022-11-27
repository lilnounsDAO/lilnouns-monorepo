import { getGrayBackgroundSVG } from '../../utils/grayBackgroundSVG';
import nounClasses from '../Noun/Noun.module.css';
import Noun from '../Noun';
import classes from './GrayCircle.module.css';

interface GrayCircleProps {
  isDelegateView?: boolean;
  renderOverlay?: () => JSX.Element;
  styleOverride?: string;
}

export const GrayCircle: React.FC<GrayCircleProps> = props => {
  const { isDelegateView, renderOverlay, styleOverride } = props;
  return (
    <div className={isDelegateView ? classes.wrapper : ''}>
      {renderOverlay && renderOverlay()}
      <Noun
        imgPath={getGrayBackgroundSVG()}
        alt={''}
        wrapperClassName={`${
          isDelegateView
            ? nounClasses.delegateViewCircularNounWrapper
            : nounClasses.circularNounWrapper
        } ${styleOverride}`}
        className={isDelegateView ? nounClasses.delegateViewCircular : nounClasses.circular}
      />
    </div>
  );
};
