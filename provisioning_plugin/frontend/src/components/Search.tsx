import { CloseButton, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';

export function TableSearchInput({
  disabled,
  searchCallback,
}: Readonly<{
  disabled?: boolean;
  searchCallback: (searchTerm: string) => void;
}>) {
  const [value, setValue] = useState<string>('');
  const [searchText] = useDebouncedValue(value, 500);

  useEffect(() => {
    searchCallback(searchText);
  }, [searchText]);

  return (
    <TextInput
      value={value}
      disabled={disabled}
      aria-label="table-search-input"
      leftSection={<IconSearch />}
      placeholder={`Search`}
      onChange={(event) => setValue(event.target.value)}
      rightSection={
        value.length > 0 ? (
          <CloseButton
            size="xs"
            onClick={() => {
              setValue('');
              searchCallback('');
            }}
          />
        ) : null
      }
    />
  );
}
