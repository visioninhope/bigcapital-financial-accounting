import React, { useEffect, useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { useIntl } from 'react-intl';

import TrialBalanceSheetHeader from './TrialBalanceSheetHeader';
import TrialBalanceSheetTable from './TrialBalanceSheetTable';
import TrialBalanceActionsBar from './TrialBalanceActionsBar';
import DashboardInsider from 'components/Dashboard/DashboardInsider';

import { compose } from 'utils';

import DashboardPageContent from 'components/Dashboard/DashboardPageContent';
import withDashboardActions from 'containers/Dashboard/withDashboardActions';
import withTrialBalanceActions from './withTrialBalanceActions';
import withSettings from 'containers/Settings/withSettings';

function TrialBalanceSheet({
  // #withDashboardActions
  changePageTitle,

  // #withTrialBalanceActions
  fetchTrialBalanceSheet,

  // #withPreferences
  organizationSettings,
}) {
  const [filter, setFilter] = useState({
    from_date: moment().startOf('year').format('YYYY-MM-DD'),
    to_date: moment().endOf('year').format('YYYY-MM-DD'),
    basis: 'accural',
    none_zero: false,
  });
  const [refresh, setRefresh] = useState(true);
  const { formatMessage } = useIntl();

  const fetchHook = useQuery(
    ['trial-balance', filter],
    (key, query) => fetchTrialBalanceSheet(query),
    { manual: true },
  );

  // handle fetch data of trial balance table.
  const handleFetchData = useCallback(() => {
    setRefresh(true);
  }, []);

  // Change page title of the dashboard.
  useEffect(() => {
    changePageTitle(formatMessage({ id: 'trial_balance_sheet' }));
  }, [changePageTitle, formatMessage]);

  const handleFilterSubmit = useCallback(
    (filter) => {
      const parsedFilter = {
        ...filter,
        from_date: moment(filter.from_date).format('YYYY-MM-DD'),
        to_date: moment(filter.to_date).format('YYYY-MM-DD'),
      };
      setFilter(parsedFilter);
      setRefresh(true);
    },
    [fetchHook],
  );

  useEffect(() => {
    if (refresh) {
      fetchHook.refetch({ force: true });
      setRefresh(false);
    }
  }, [refresh, fetchHook.refetch]);

  return (
    <DashboardInsider>
      <TrialBalanceActionsBar />

      <DashboardPageContent>
        <div class="financial-statement">
          <TrialBalanceSheetHeader
            pageFilter={filter}
            onSubmitFilter={handleFilterSubmit}
          />

          <div class="financial-statement__body">
            <TrialBalanceSheetTable
              companyName={organizationSettings.name}
              trialBalanceQuery={filter}
              onFetchData={handleFetchData}
            />
          </div>
        </div>
      </DashboardPageContent>
    </DashboardInsider>
  );
}

export default compose(
  withDashboardActions,
  withTrialBalanceActions,
  withSettings,
)(TrialBalanceSheet);
