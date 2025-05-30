import { useMemo } from 'react';
import { useTable } from '../hooks/UseTable';
import { Badge, Center } from '@mantine/core';
import dayjs from 'dayjs';
import { TableColumn } from '../components/Column';
import { InvenTreeTable } from '../components/InvenTreeTable';
import { apiUrl } from '../lib/Api';
import { ApiEndpoints } from '../lib/ApiEndpoints';
import { render as preact_render } from 'preact';

const getColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'yellow';
    case 'Success':
      return 'green';
    case 'Failed':
      return 'red';
    default:
      return 'gray';
  }
};

export function render({ target,
  itemId,
}: Readonly<{ target: HTMLElement, itemId: number }>) {
  const table = useTable('stock_provisioning_tracking');

  const tableColumns: TableColumn[] = useMemo(() => {
    return [
      {
        accessor: 'date',
        title: `Date`,
        sortable: false,
        switchable: true,
        render: (record: any) => dayjs(record.date).format('YYYY-MM-DD'),
      },
      {
        accessor: 'status',
        title: `Status`,
        sortable: false,
        switchable: true,
        render: (record: any) => (
          <Center>
            {record?.status ? (
              <Badge color={getColor(record?.status)} variant="filled">
                {record?.status}
              </Badge>
            ) : null}
          </Center>
        ),
      },
      {
        accessor: 'notes',
        title: `Notes`,
        sortable: false,
        switchable: true,
      },
    ];
  }, []);

  preact_render(
    <InvenTreeTable
      tableState={table}
      url={apiUrl(ApiEndpoints.stock_tracking_list)}
      columns={tableColumns}
      props={{
        params: {
          item: itemId,
          user_detail: true,
        },
        enableDownload: true,
      }}
    />, target
  );
}
