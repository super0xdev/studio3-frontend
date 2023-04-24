import React, { FC, useState } from 'react';
import InputLabel from '@mui/material/InputLabel';

import styles from './index.module.scss';

import Select from '@/components/based/Select';

type SelectOptionType = {
  value: string;
  data: string;
};

const FilterPanel: FC = () => {
  const TEMPLATE_COLLECTION = {
    Asset: [
      {
        value: 'JPG',
        data: 'JPG',
      },
      {
        value: 'PNG',
        data: 'PNG',
      },
      {
        value: 'WEBP',
        data: 'WEBP',
      },
    ],
    Tab: [
      {
        value: 'Meme',
        data: 'Meme',
      },
      {
        value: 'Merch',
        data: 'Merch',
      },
      {
        value: 'Collection',
        data: 'Collection',
      },
    ],
    Collection: [
      {
        value: 'MotleyDAO',
        data: 'MotleyDAO',
      },
      {
        value: 'y00ts',
        data: 'y00ts',
      },
    ],
    Tags: [
      {
        value: 'Cartoon',
        data: 'Cartoon',
      },
      {
        value: 'spiderman',
        data: 'spiderman',
      },
      {
        value: 'pointing',
        data: 'pointing',
      },
    ],
    'User Created': [
      {
        value: '1',
        data: '1',
      },
      {
        value: '0',
        data: '0',
      },
    ],
    UserID: [],
  } as { [key: string]: SelectOptionType[] };
  const [selectedValues, setSelectedValues] = useState(
    {} as { [key: string]: string }
  );

  return (
    <div className={styles.inner}>
      {Object.keys(TEMPLATE_COLLECTION).map((type: string) => {
        return (
          <div className={styles.filter} key={type}>
            <InputLabel className={styles.selectLabel} id={`select-${type}`}>
              {type}
            </InputLabel>
            <Select
              className={styles.select}
              labelId={`select-${type}`}
              options={TEMPLATE_COLLECTION[type]}
              value={selectedValues[type]}
              onChange={(ev) => {
                setSelectedValues({
                  ...selectedValues,
                  [type]: ev.target.value as string,
                });
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FilterPanel;
