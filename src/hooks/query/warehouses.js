import { useQueryClient, useMutation } from 'react-query';
import { transformPagination } from 'utils';
import { useRequestQuery } from '../useQueryRequest';
import useApiRequest from '../useRequest';
import t from './types';

// Common invalidate queries.
const commonInvalidateQueries = (queryClient) => {
  // Invalidate warehouses.
  queryClient.invalidateQueries(t.WAREHOUSES);
  queryClient.invalidateQueries(t.WAREHOUSE);

  // Invalidate warehouses transfers.
  queryClient.invalidateQueries(t.WAREHOUSE_TRANSFERS);
  queryClient.invalidateQueries(t.WAREHOUSE_TRANSFER);
};

/**
 * Create a new warehouse.
 */
export function useCreateWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((values) => apiRequest.post('warehouses', values), {
    onSuccess: (res, values) => {
      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Edits the given warehouse.
 */
export function useEditWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`warehouses/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific sale invoice.
        queryClient.invalidateQueries([t.WAREHOUSE, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given warehouse.
 */
export function useDeleteWarehouse(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`warehouses/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific warehoue.
      queryClient.invalidateQueries([t.WAREHOUSE, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

/**
 * Retrieve Warehoues list.
 */
export function useWarehouses(query, props) {
  return useRequestQuery(
    [t.WAREHOUSES, query],
    { method: 'get', url: 'warehouses', params: query },
    {
      select: (res) => res.data.warehouses,
      defaultData: [],
      ...props,
    },
  );
}

/**
 * Retrieve the warehouse details.
 * @param {number}
 */
export function useWarehouse(id, props, requestProps) {
  return useRequestQuery(
    [t.WAREHOUSE, id],
    { method: 'get', url: `warehouses/${id}`, ...requestProps },
    {
      select: (res) => res.data.warehouse,
      defaultData: {},
      ...props,
    },
  );
}

/**
 * Create a new warehouse transfer.
 */
export function useCreateWarehouseTransfer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    (values) => apiRequest.post('warehouses/transfers', values),
    {
      onSuccess: (res, values) => {
        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Edits the given warehouse transfer.
 */
export function useEditWarehouseTransfer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation(
    ([id, values]) => apiRequest.post(`warehouses/transfers/${id}`, values),
    {
      onSuccess: (res, [id, values]) => {
        // Invalidate specific sale invoice.
        queryClient.invalidateQueries([t.WAREHOUSE_TRANSFER, id]);

        // Common invalidate queries.
        commonInvalidateQueries(queryClient);
      },
      ...props,
    },
  );
}

/**
 * Deletes the given warehouse Transfer.
 */
export function useDeleteWarehouseTransfer(props) {
  const queryClient = useQueryClient();
  const apiRequest = useApiRequest();

  return useMutation((id) => apiRequest.delete(`warehouses/transfers/${id}`), {
    onSuccess: (res, id) => {
      // Invalidate specific warehoue.
      queryClient.invalidateQueries([t.WAREHOUSE_TRANSFER, id]);

      // Common invalidate queries.
      commonInvalidateQueries(queryClient);
    },
    ...props,
  });
}

const transformWarehousesTransfer = (res) => ({
  warehousesTransfers: res.data.data,
  pagination: transformPagination(res.data.pagination),
  filterMeta: res.data.filter,
});

/**
 * Retrieve Warehoues list.
 */
export function useWarehousesTransfers(query, props) {
  return useRequestQuery(
    [t.WAREHOUSE_TRANSFERS, query],
    { method: 'get', url: 'warehouses/transfers', params: query },
    {
      select: transformWarehousesTransfer,
      defaultData: {
        warehousesTransfers: [],
        pagination: {
          page: 1,
          pageSize: 20,
          total: 0,
        },
        filterMeta: {},
      },
      ...props,
    },
  );
}

/**
 * Retrieve the warehouse transfer details.
 * @param {number}
 */
export function useWarehouseTransfer(id, props, requestProps) {
  return useRequestQuery(
    [t.WAREHOUSE_TRANSFER, id],
    { method: 'get', url: `warehouses/transfers/${id}`, ...requestProps },
    {
      select: (res) => res.data.data,
      defaultData: {},
      ...props,
    },
  );
}

export function useRefreshWarehouseTransfers() {
  const queryClient = useQueryClient();

  return {
    refresh: () => {
      queryClient.invalidateQueries(t.WAREHOUSE_TRANSFERS);
    },
  };
}
