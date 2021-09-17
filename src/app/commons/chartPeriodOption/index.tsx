import * as React from 'react';
// @ts-ignore
import styles from './index.module.scss';

const PeriodOption = ({
  isSelected,
  text,
  onClick,
}: {
  isSelected: boolean;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className={`${styles.periodOption} ${
        isSelected ? styles.periodOptionSelected : ''
      }`}
    >
      {text}
    </div>
  );
};

export default PeriodOption;
