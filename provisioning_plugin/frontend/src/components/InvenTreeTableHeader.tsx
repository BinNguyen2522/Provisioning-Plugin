import { t } from '@lingui/core/macro';
import { ActionIcon, Alert, Group, Indicator, Tooltip } from '@mantine/core';
import { IconFilter, IconRefresh } from '@tabler/icons-react';
import { useMemo, useState } from 'react';

import type { TableFilter } from '@lib/types/Filters';
import type { TableState } from '@lib/types/Tables';
import { TableColumnSelect } from './ColumnSelect';
import type { InvenTreeTableProps } from './InvenTreeTable';
import { TableSearchInput } from './Search';

/**
 * Render a composite header for an InvenTree table
 */
export default function InvenTreeTableHeader({
  tableUrl,
  tableState,
  tableProps,
  hasSwitchableColumns,
  columns,
  filters,
  toggleColumn,
}: Readonly<{
  tableUrl?: string;
  tableState: TableState;
  tableProps: InvenTreeTableProps<any>;
  hasSwitchableColumns: boolean;
  columns: any;
  filters: TableFilter[];
  toggleColumn: (column: string) => void;
}>) {
  // Filter list visibility
  const [filtersVisible, setFiltersVisible] = useState<boolean>(false);

  // Construct export filters
  const exportFilters = useMemo(() => {
    const filters: Record<string, any> = {};

    // Add in any additional parameters which have a defined value
    for (const [key, value] of Object.entries(tableProps.params ?? {})) {
      if (value != undefined) {
        filters[key] = value;
      }
    }

    // Add in active filters
    if (tableState.filterSet.activeFilters) {
      tableState.filterSet.activeFilters.forEach((filter) => {
        filters[filter.name] = filter.value;
      });
    }

    // Allow overriding of query parameters
    if (tableState.queryFilters) {
      for (const [key, value] of tableState.queryFilters) {
        if (value != undefined) {
          filters[key] = value;
        }
      }
    }

    return filters;
  }, [tableProps.params, tableState.filterSet, tableState.queryFilters]);

  const hasCustomSearch = useMemo(() => {
    return tableState.queryFilters.has('search');
  }, [tableState.queryFilters]);

  const hasCustomFilters = useMemo(() => {
    if (hasCustomSearch) {
      return tableState.queryFilters.size > 1;
    } else {
      return tableState.queryFilters.size > 0;
    }
  }, [hasCustomSearch, tableState.queryFilters]);

  return (
    <>
      {(hasCustomFilters || hasCustomSearch) && (
        <Alert
          color="yellow"
          withCloseButton
          title={t`Custom table filters are active`}
          onClose={() => tableState.clearQueryFilters()}
        />
      )}
      <Group justify="apart" grow wrap="nowrap">
        <Group justify="right" gap={5} wrap="nowrap">
          {tableProps.enableSearch && (
            <TableSearchInput
              disabled={hasCustomSearch}
              searchCallback={(term: string) => tableState.setSearchTerm(term)}
            />
          )}
          {tableProps.enableRefresh && (
            <ActionIcon variant="transparent" aria-label="table-refresh">
              <Tooltip label={t`Refresh data`}>
                <IconRefresh
                  onClick={() => {
                    tableState.refreshTable();
                    tableState.clearSelectedRecords();
                  }}
                />
              </Tooltip>
            </ActionIcon>
          )}
          {hasSwitchableColumns && (
            <TableColumnSelect
              columns={columns}
              onToggleColumn={toggleColumn}
            />
          )}
          {tableProps.enableFilters && filters.length > 0 && (
            <Indicator
              size="xs"
              label={tableState.filterSet.activeFilters?.length ?? 0}
              disabled={tableState.filterSet.activeFilters?.length == 0}
            >
              <ActionIcon
                disabled={hasCustomFilters}
                variant="transparent"
                aria-label="table-select-filters"
              >
                <Tooltip label={t`Table Filters`}>
                  <IconFilter
                    onClick={() => setFiltersVisible(!filtersVisible)}
                  />
                </Tooltip>
              </ActionIcon>
            </Indicator>
          )}
        </Group>
      </Group>
    </>
  );
}
