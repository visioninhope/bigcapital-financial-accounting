import React from 'react';
import { useHistory } from 'react-router';

import { DataTable, DashboardContentTable } from 'components';
import TableSkeletonRows from 'components/Datatable/TableSkeletonRows';
import TableSkeletonHeader from 'components/Datatable/TableHeaderSkeleton';

import VendorsEmptyStatus from './VendorsEmptyStatus';

import { useVendorsListContext } from './VendorsListProvider';
import withVendorsActions from './withVendorsActions';
import withVendors from './withVendors';
import withAlertsActions from 'containers/Alert/withAlertActions';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withDrawerActions from 'containers/Drawer/withDrawerActions';

import { compose } from 'utils';
import { ActionsMenu, useVendorsTableColumns } from './components';

/**
 * Vendors table.
 */
function VendorsTable({
  // #withVendorsActions
  setVendorsTableState,

  // #withVendors
  vendorsTableState,

  // #withAlertsActions
  openAlert,

  // #withDrawerActions
  openDrawer,

  // #withDialogActions
  openDialog,
}) {
  // Vendors list context.
  const {
    vendors,
    pagination,
    isVendorsFetching,
    isVendorsLoading,
    isEmptyStatus,
  } = useVendorsListContext();

  // Vendors table columns.
  const columns = useVendorsTableColumns();

  // History context.
  const history = useHistory();

  // Handle edit vendor data table
  const handleEditVendor = (vendor) => {
    history.push(`/vendors/${vendor.id}/edit`);
  };

  // Handle cancel/confirm inactive.
  const handleInactiveVendor = ({ id, contact_service }) => {
    openAlert('contact-inactivate', {
      contactId: id,
      service: contact_service,
    });
  };

  // Handle cancel/confirm  activate.
  const handleActivateVendor = ({ id, contact_service }) => {
    openAlert('contact-activate', { contactId: id, service: contact_service });
  };

  // Handle click delete vendor.
  const handleDeleteVendor = ({ id }) => {
    openAlert('vendor-delete', { contactId: id });
  };

  // Handle contact duplicate .
  const handleContactDuplicate = ({ id }) => {
    openDialog('contact-duplicate', {
      contactId: id,
    });
  };

  // Handle view detail item.
  const handleViewDetailVendor = ({ id }) => {
    openDrawer('contact-detail-drawer', { contactId: id });
  };

  // Handle cell click.
  const handleCellClick = (cell, event) => {
    openDrawer('contact-detail-drawer', { contactId: cell.row.original.id });
  };

  // Handle fetch data once the page index, size or sort by of the table change.
  const handleFetchData = React.useCallback(
    ({ pageSize, pageIndex, sortBy }) => {
      setVendorsTableState({
        pageIndex,
        pageSize,
        sortBy,
      });
    },
    [setVendorsTableState],
  );

  // Display empty status instead of the table.
  if (isEmptyStatus) {
    return <VendorsEmptyStatus />;
  }

  return (
    <DashboardContentTable>
      <DataTable
        noInitialFetch={true}
        columns={columns}
        data={vendors}
        initialState={vendorsTableState}
        loading={isVendorsLoading}
        headerLoading={isVendorsLoading}
        progressBarLoading={isVendorsFetching}
        onFetchData={handleFetchData}
        selectionColumn={true}
        expandable={false}
        sticky={true}
        pagination={true}
        manualSortBy={true}
        pagesCount={pagination.pagesCount}
        autoResetSortBy={false}
        autoResetPage={false}
        TableLoadingRenderer={TableSkeletonRows}
        TableHeaderSkeletonRenderer={TableSkeletonHeader}
        ContextMenu={ActionsMenu}
        onCellClick={handleCellClick}
        payload={{
          onEdit: handleEditVendor,
          onDelete: handleDeleteVendor,
          onDuplicate: handleContactDuplicate,
          onInactivate: handleInactiveVendor,
          onActivate: handleActivateVendor,
          onViewDetails: handleViewDetailVendor,
        }}
      />
    </DashboardContentTable>
  );
}

export default compose(
  withVendorsActions,
  withAlertsActions,
  withDialogActions,
  withDrawerActions,

  withVendors(({ vendorsTableState }) => ({ vendorsTableState })),
)(VendorsTable);
