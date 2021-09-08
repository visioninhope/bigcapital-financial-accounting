import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

import { compose } from 'utils';

import { DataTable, DashboardContentTable } from 'components';
import PaymentReceivesEmptyStatus from './PaymentReceivesEmptyStatus';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import withPaymentReceives from './withPaymentReceives';
import withPaymentReceivesActions from './withPaymentReceivesActions';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';
import { usePaymentReceivesColumns, ActionsMenu } from './components';
import { usePaymentReceivesListContext } from './PaymentReceiptsListProvider';

/**
 * Payment receives datatable.
 */
function PaymentReceivesDataTable({
  // #withPaymentReceivesActions
  setPaymentReceivesTableState,

  // #withPaymentReceives
  paymentReceivesTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,
}) {
  const history = useHistory();

  // Payment receives list context.
  const {
    paymentReceives,
    pagination,

    isPaymentReceivesLoading,
    isPaymentReceivesFetching,
    isEmptyStatus,
  } = usePaymentReceivesListContext();

  // Payment receives columns.
  const columns = usePaymentReceivesColumns();

  // Handles edit payment receive.
  const handleEditPaymentReceive = ({ id }) => {
    history.push(`/payment-receives/${id}/edit`);
  };

  // Handles delete payment receive.
  const handleDeletePaymentReceive = ({ id }) => {
    openAlert('payment-receive-delete', { paymentReceiveId: id });
  };

  // Handle drawer payment receive.
  const handleDrawerPaymentReceive = ({ id }) => {
    openDrawer('payment-receive-drawer', { paymentReceiveId: id });
  };

  // Handle view detail  payment receive..
  const handleViewDetailPaymentReceive = ({ id }) => {
    openDrawer('payment-receive-detail-drawer', { paymentReceiveId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('payment-receive-detail-drawer', {
      paymentReceiveId: cell.row.original.id,
    });
  };

  // Handle datatable fetch once the table's state changing.
  const handleDataTableFetchData = useCallback(
    ({ pageIndex, pageSize, sortBy }) => {
      setPaymentReceivesTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setPaymentReceivesTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <PaymentReceivesEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        columns={columns}
        data={paymentReceives}
        initialState={paymentReceivesTableState}
        loading={isPaymentReceivesLoading}
        headerLoading={isPaymentReceivesLoading}
        progressBarLoading={isPaymentReceivesFetching}
        onFetchData={handleDataTableFetchData}
        manualSortBy={true}
        selectionColumn={true}
        noInitialFetch={true}
        sticky={true}
        autoResetSortBy={false}
        autoResetPage={false}
        pagination={true}
        pagesCount={pagination.pagesCount}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        payload={{
          onDelete: handleDeletePaymentReceive,
          onEdit: handleEditPaymentReceive,
          onDrawer: handleDrawerPaymentReceive,
          onViewDetails: handleViewDetailPaymentReceive,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withPaymentReceivesActions,
  withAlertsActions,
  withDrawerActions,
  withPaymentReceives(({ paymentReceivesTableState }) => ({
    paymentReceivesTableState,
  })),
)(PaymentReceivesDataTable);
