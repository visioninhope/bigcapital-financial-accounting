import React, { createContext, useContext } from 'react';
import { isEmpty, pick, isEqual, isUndefined } from 'lodash';

import { DashboardInsider } from 'components';
import {
  useSettingsPaymentReceives,
  usePaymentReceiveEditPage,
  useAccounts,
  useCustomers,
  useBranches,
  useCreatePaymentReceive,
  useEditPaymentReceive,
} from 'hooks/query';

// Payment receive form context.
const PaymentReceiveFormContext = createContext();

/**
 * Payment receive form provider.
 */
function PaymentReceiveFormProvider({
  paymentReceiveId,
  baseCurrency,
  ...props
}) {
  // Form state.
  const [submitPayload, setSubmitPayload] = React.useState({});

  const [selectCustomer, setSelectCustomer] = React.useState(null);

  // Fetches payment recevie details.
  const {
    data: {
      paymentReceive: paymentReceiveEditPage,
      entries: paymentEntriesEditPage,
    },
    isLoading: isPaymentLoading,
    isFetching: isPaymentFetching,
  } = usePaymentReceiveEditPage(paymentReceiveId, {
    enabled: !!paymentReceiveId,
  });
  // Handle fetch accounts data.
  const { data: accounts, isLoading: isAccountsLoading } = useAccounts();

  // Fetch payment made settings.
  const fetchSettings = useSettingsPaymentReceives();

  // Fetches customers list.
  const {
    data: { customers },
    isLoading: isCustomersLoading,
  } = useCustomers({ page_size: 10000 });

  // Fetches the branches list.
  const {
    data: branches,
    isLoading: isBranchesLoading,
    isSuccess: isBranchesSuccess,
  } = useBranches();

  // Detarmines whether the new mode.
  const isNewMode = !paymentReceiveId;

  const isFeatureLoading = isBranchesLoading;

  // Create and edit payment receive mutations.
  const { mutateAsync: editPaymentReceiveMutate } = useEditPaymentReceive();
  const { mutateAsync: createPaymentReceiveMutate } = useCreatePaymentReceive();

  // Determines whether the foreign customer.
  const isForeignCustomer =
    !isEqual(selectCustomer?.currency_code, baseCurrency) &&
    !isUndefined(selectCustomer?.currency_code);

  // Provider payload.
  const provider = {
    paymentReceiveId,
    paymentReceiveEditPage,
    paymentEntriesEditPage,
    accounts,
    customers,
    branches,
    baseCurrency,

    isPaymentLoading,
    isAccountsLoading,
    isPaymentFetching,
    isCustomersLoading,
    isFeatureLoading,
    isBranchesSuccess,
    isForeignCustomer,
    isNewMode,

    submitPayload,
    setSubmitPayload,
    selectCustomer,
    setSelectCustomer,

    editPaymentReceiveMutate,
    createPaymentReceiveMutate,
  };

  return (
    <DashboardInsider
      loading={isPaymentLoading || isAccountsLoading || isCustomersLoading}
      name={'payment-receive-form'}
    >
      <PaymentReceiveFormContext.Provider value={provider} {...props} />
    </DashboardInsider>
  );
}

const usePaymentReceiveFormContext = () =>
  useContext(PaymentReceiveFormContext);

export { PaymentReceiveFormProvider, usePaymentReceiveFormContext };
