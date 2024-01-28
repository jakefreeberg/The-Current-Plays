'use client';

import dayjs from 'dayjs';
import axios from 'axios';
import Datepicker, { DateValueType } from 'react-tailwindcss-datepicker';
import { useEffect, useState } from 'react';
import Select from 'react-tailwindcss-select';
import { SelectValue } from 'react-tailwindcss-select/dist/components/type';

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

  // const [minDate, setMinDate] = useState<Date>(new Date());
  const [menuOpen, setMenuOpen] = useState<boolean>(true);

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

  useEffect(() => {
    if (datesToLoad.length) {
      const day = datesToLoad.shift();
      axios
        .get('/api/' + day)
        .then((response) => {
          const together = currentData.concat(response.data);
          setCurrentData(together);
          // setMinDate(dayjs(day).toDate());
        })
        .catch((err) => setError(err));
    }
  }, [currentData, datesToLoad]);

  const handleDateChange = (newValue: DateValueType) => {
    setDateValue(newValue);
    const numberOfDays =
      dayjs(newValue?.endDate).diff(newValue?.startDate, 'days') + 1;
    if (numberOfDays) {
      // could be undefined or null
      const selectedDates = [...Array(numberOfDays)].map((_, i) => {
        return dayjs(newValue?.endDate)
          .subtract(i, 'day')
          .format('YYYY-MM-DD');
      });
      console.log(selectedDates);
      setCurrentData([]);
      setDatesToLoad(selectedDates);
    }

    setIsDBReady(true);
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

  return (
    <main className="flex min-h-screen pr-6 ">
      <div
        className={
          (menuOpen ? 'block' : 'none') +
          ' w-220 relative mr-6 flex-none bg-white p-3 shadow-xl'
        }
      >
        <div className="text-right">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="mb-3 block rounded bg-indigo-600 px-3 py-1 font-bold text-white hover:bg-indigo-700"
          >
            {menuOpen ? '←' : '→'}
          </button>
        </div>
        {menuOpen && (
          <>
            {!isDBReady && (
              <div className="mb-2">
                {' '}
                Select a Time Range <br /> to see what
                <a
                  className="ml-1 text-blue-600 underline visited:text-purple-600 hover:text-blue-800"
                  href="https://www.thecurrent.org/playlist/"
                >
                  The Current
                </a>
                <br />
                has been playing
              </div>
            )}
            <Datepicker
              value={dateValue}
              onChange={handleDateChange}
              // minDate={minDate}
              maxDate={dayjs().add(1, 'day').toDate()}
            />

            <div className="mt-4">
              {options.length > 0 && (
                <Select
                  primaryColor="violet"
                  value={selectedArtists}
                  isMultiple={true}
                  onChange={handleChange}
                  options={options}
                />
              )}
            </div>
            <div className="mt-4">
              {multiEntries.map(([name, value], key: number) => (
                <button
                  key={key}
                  onClick={() => addFilter(name)}
                  className="mt-1 block rounded bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-700"
                >
                  {name + ' ' + value}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="mt-4 flex-1 grow flex-col gap-4 md:flex-row">
        <div className="text-right">
          {datesToLoad.length ? (
            <div role="status">
              Dates loading: {datesToLoad.join(', ')}
              {/* {datesToLoad.map((day, key) => (
                <span key={key}>{day}</span>
              ))} */}
              <svg
                aria-hidden="true"
                className="ml-4 inline h-8 w-8 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            </div>
          ) : (
            isDBReady &&
            dateValue?.startDate?.toLocaleString() +
              ' ~ ' +
              dateValue?.endDate?.toLocaleString()
          )}
        </div>
        {currentData.length > 0 && (
          <div className="w-full overflow-x-auto">
            <table className="tr-even:bg-grey-light w-full">
              <thead>
                <tr className="text-md border-b border-gray-600 bg-white text-left font-semibold uppercase tracking-wide text-gray-900">
                  <th className="border px-3 py-1">Day</th>
                  <th className="border px-3 py-1">Hour</th>
                  <th className="border px-3 py-1">Artist</th>
                  <th className="border px-3 py-1">Song</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredData.map((row: any, key: number) => (
                  <tr className="odd:bg-gray-100 hover:bg-gray-200" key={key}>
                    <td className="border px-3 py-1">{row.date}</td>
                    <td className="border px-3 py-1">{row.hour}</td>
                    <td className="border px-3 py-1">{row.artist}</td>
                    <td className="border px-3 py-1">{row.song}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
