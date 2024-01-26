'use client';

import dayjs from 'dayjs';

import useSWR from 'swr';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { useState } from 'react';
import Select from 'react-tailwindcss-select';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());
const options = [
  { value: 'fox', label: '🦊 Fox' },
  { value: 'Butterfly', label: '🦋 Butterfly' },
  { value: 'Honeybee', label: '🐝 Honeybee' },
];

export default function Page() {
  const [dateValue, setDateValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [animal, setAnimal] = useState<SelectValue | null>(null);

  const handleDateChange = (newValue: DateValueType) => {
    console.log('newValue:', newValue);
    setDateValue(newValue);
  };

  const handleChange = (value: SelectValue) => {
    console.log('value:', value);
    setAnimal(value);
  };

  const { data, error } = useSWR(
    '/api/' +
      dayjs(dateValue?.startDate).format('YYYY-MM-DD') +
      '/' +
      dayjs(dateValue?.endDate).format('YYYY-MM-DD'),
    fetcher,
  );

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading... {JSON.stringify(dateValue)}</div>;

  return (
    <main className="flex min-h-screen bg-blue-100 p-6">
      <div className="mr-6 flex-none rounded-lg bg-gray-100 p-4">
        <div className="">
          <Datepicker value={dateValue} onChange={handleDateChange} />

          <Select
            primaryColor="violet"
            value={animal}
            onChange={handleChange}
            options={options}
          />
        </div>
      </div>
      <div className="bg-white-100 mt-4 flex-1 grow flex-col gap-4 md:flex-row">
        {data.map((row: any, key: number) => (
          <div key={key}>{JSON.stringify(row)}</div>
        ))}
      </div>
    </main>
  );
}
