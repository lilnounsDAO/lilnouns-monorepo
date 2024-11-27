import clsx from 'clsx';
import classes from './BrandNumericEntry.module.css';
import { NumericFormat, OnValueChange } from 'react-number-format';

interface BrandNumericEntryProps {
  onValueChange?: OnValueChange;
  value?: string | number;
  placeholder?: string;
  label?: string;
  sublabel?: string;
  isInvalid?: boolean;
}

const BrandNumericEntry: React.FC<BrandNumericEntryProps> = props => {
  const { onValueChange, value, placeholder, label, sublabel, isInvalid = false } = props;

  return (
    <div className={classes.container}>
      <div className={classes.labelContainer}>
        {label && <span className={classes.label}>{label}</span>}
        {sublabel && <span className={classes.sublabel}>{sublabel}</span>}
      </div>
      <NumericFormat
        onValueChange={onValueChange}
        value={value}
        placeholder={placeholder}
        className={clsx(classes.entry, isInvalid ? classes.invalid : '')}
        allowNegative={false}
        thousandSeparator=","
      />
    </div>
  );
};

export default BrandNumericEntry;
