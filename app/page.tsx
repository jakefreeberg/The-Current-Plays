'use client';

import dayjs from 'dayjs';

import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { useEffect, useState } from 'react';
import Select from 'react-tailwindcss-select';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

import {
  Stores,
  Playlist,
  addData,
  deleteData,
  getStoreData,
  initDB,
} from './lib/db';
import axios from 'axios';

//@ts-ignore
const fetcher = (...args) => fetch(...args).then((res) => res.json());
// const options = [
//   { value: 'fox', label: '🦊 Fox' },
//   { value: 'Butterfly', label: '🦋 Butterfly' },
//   { value: 'Honeybee', label: '🐝 Honeybee' },
// ];

export default function Page() {
  const [datesToLoad, setDatesToLoad] = useState<Array<string>>([]);
  const [currentData, setCurrentData] = useState<Array<Record<string, string>>>(
    [],
  );
  const [dateValue, setDateValue] = useState<DateValueType>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [selectedArtists, setSelectedArtists] = useState<SelectValue | null>(
    null,
  );

  const [minDate, setMinDate] = useState<Date>(new Date());

  const [isDBReady, setIsDBReady] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const sortNames = (nameA: string, nameB: string) => {
    nameA = nameA.toUpperCase(); // ignore upper and lowercase
    nameB = nameB.toUpperCase(); // ignore upper and lowercase
    if (nameA < nameB) {
      return -1;
    }
    if (nameA > nameB) {
      return 1;
    }

    // names must be equal
    return 0;
  };

  const handleInitDB = async () => {
    const status = await initDB();

    setDatesToLoad(
      [...Array(7)].map((_, i) => {
        return dayjs().subtract(i, 'day').format('YYYY-MM-DD');
      }),
    );
    setIsDBReady(!!status);
  };

  useEffect(() => {
    if (datesToLoad.length) {
      const day = datesToLoad.shift();
      axios.get('/api/' + day).then((response) => {
        const together = currentData.concat(response.data);
        setCurrentData(together);
        setMinDate(dayjs(day).toDate());
      });
    }
  }, [currentData, datesToLoad]);

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
  };

  const handleChange = (value: SelectValue) => {
    setSelectedArtists(value);
  };

  const addFilter = (name: string) => {
    const artistOption = options.find((o) => o.value === name);
    if (artistOption) {
      if (Array.isArray(selectedArtists)) {
        setSelectedArtists([...selectedArtists, artistOption]);
      } else if (selectedArtists) {
        setSelectedArtists([selectedArtists, artistOption]);
      } else {
        setSelectedArtists([artistOption]);
      }
    }
  };

  const multiPlayers: Record<string, number> = {};
  let artists =
    currentData?.map((item: Record<string, string>) => item.artist) || [];
  let deduped = artists.filter((item: string, index: number) => {
    if (artists.indexOf(item) === index) {
      return true;
    } else {
      if (multiPlayers[item]) {
        multiPlayers[item]++;
      } else {
        multiPlayers[item] = 2;
      }
    }
  });

  let multiEntries = Object.entries(multiPlayers);
  // multiEntries = multiEntries.sort((a: [string, number], b: [string, number]) =>
  //   sortNames(a[0], b[0]),
  // );

  multiEntries = multiEntries.sort(
    (a: [string, number], b: [string, number]) => b[1] - a[1],
  );

  let options =
    deduped?.map((item: string) => ({
      value: item,
      label: item,
    })) || [];

  options = options.sort(
    (a: Record<string, string>, b: Record<string, string>) =>
      sortNames(a.value, b.value),
  );

  const filteredData =
    currentData?.filter((item: any) => {
      if (Array.isArray(selectedArtists)) {
        const artistStrings = selectedArtists.map((option) => option.value);
        return artistStrings.includes(item.artist);
      }
      return true;
    }) || [];

  if (error) return <div>Failed to load</div>;
  // if (!currentData) return <div>Loading... </div>;
  // {JSON.stringify(dateValue)}

  return (
    <main className="flex min-h-screen bg-blue-100 p-6">
      <div className="mr-6 flex-none rounded-lg bg-gray-100 p-4">
        {!isDBReady ? (
          <button
            onClick={handleInitDB}
            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Start Loading Data
          </button>
        ) : (
          <div className="">
            {datesToLoad.length ? (
              <div>
                Dates loading:{' '}
                {datesToLoad.map((day, key) => (
                  <div key={key}>{day}</div>
                ))}
              </div>
            ) : (
              <>
                Last 7 days of Playlists loaded
                <br />
                <Datepicker
                  value={dateValue}
                  onChange={handleDateChange}
                  minDate={minDate}
                  maxDate={dayjs().add(1, 'day').toDate()}
                />
                <br />
              </>
            )}
            {options.length && (
              <Select
                primaryColor="violet"
                value={selectedArtists}
                isMultiple={true}
                onChange={handleChange}
                options={options}
              />
            )}

            <div>
              {multiEntries.map(([name, value], key: number) => (
                <button
                  key={key}
                  onClick={() => addFilter(name)}
                  className="mt-1 block rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                >
                  {name + ' ' + value}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white-100 mt-4 flex-1 grow flex-col gap-4 md:flex-row">
        <table className="table-fixed border-collapse">
          <thead>
            <tr>
              <th>Day</th>
              <th>Hour</th>
              <th>Artist</th>
              <th>Song</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row: any, key: number) => (
              <tr key={key}>
                <td className="border p-1">{row.date}</td>
                <td className="border p-1">{row.hour}</td>
                <td className="border p-1">{row.artist}</td>
                <td className="border p-1">{row.song}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
