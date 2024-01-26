'use client';

import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { useState } from 'react';
import Select from 'react-tailwindcss-select';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

const options = [
  { value: 'fox', label: '🦊 Fox' },
  { value: 'Butterfly', label: '🦋 Butterfly' },
  { value: 'Honeybee', label: '🐝 Honeybee' },
];

export default function Search({ placeholder }: { placeholder: string }) {
  const [value, setValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [animal, setAnimal] = useState<SelectValue | null>(null);

  const handleValueChange = (newValue: DateValueType) => {
    console.log('newValue:', newValue);
    setValue(newValue);
  };

  const handleChange = (value: SelectValue) => {
    console.log('value:', value);
    setAnimal(value);
  };

  return (
    <div className="">
      <div className="">
        <Datepicker value={value} onChange={handleValueChange} />
      </div>

      <Select
        primaryColor="violet"
        value={animal}
        onChange={handleChange}
        options={options}
      />
    </div>
  );
}
