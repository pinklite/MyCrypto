import React, { useContext, useState } from 'react';
import { Panel } from '@mycrypto/ui';
import styled from 'styled-components';

import { translateRaw } from '@translations';
import { RatesContext } from '@services';
import { SettingsContext, StoreContext } from '@services/Store';
import { TUuid, Balance } from '@types';
import { buildBalances, buildTotalFiatValue } from '@utils';
import { BREAK_POINTS, SPACING } from '@theme';
import { getFiat } from '@config/fiats';
import { Tooltip } from '@components';
import { isNotExcludedAsset } from '@services/Store/helpers';

import AccountDropdown from './AccountDropdown';
import BalancesDetailView from './BalancesDetailView';
import WalletBreakdownView from './WalletBreakdownView';
import NoAccountsSelected from './NoAccountsSelected';

const WalletBreakdownTop = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
  }
`;

const AccountDropdownWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 480px;
  margin-bottom: ${SPACING.SM};

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    margin-bottom: ${SPACING.BASE};
  }
`;

const SAccountDropdown = styled(AccountDropdown)`
  width: 100%;
  margin-left: ${SPACING.XS};
`;

const WalletBreakdownPanel = styled(Panel)`
  display: flex;
  flex-direction: column;
  margin-top: ${SPACING.XS};
  padding: 0;

  @media (min-width: ${BREAK_POINTS.SCREEN_MD}) {
    flex-direction: row;
    margin-top: 0;
  }
`;

export function WalletBreakdown() {
  const [showBalanceDetailView, setShowBalanceDetailView] = useState(false);
  const { accounts, totals, currentAccounts } = useContext(StoreContext);
  const { settings, updateSettingsAccounts } = useContext(SettingsContext);
  const { getAssetRate } = useContext(RatesContext);

  // Adds/updates an asset in array of balances, which are later displayed in the chart, balance list and in the secondary view
  const balances: Balance[] = buildBalances(
    totals,
    currentAccounts,
    settings,
    getAssetRate,
    isNotExcludedAsset
  );

  const totalFiatValue = buildTotalFiatValue(balances);

  const toggleShowChart = () => {
    setShowBalanceDetailView(!showBalanceDetailView);
  };

  const fiat = getFiat(settings);

  return (
    <>
      <WalletBreakdownTop>
        <AccountDropdownWrapper>
          <Tooltip tooltip={translateRaw('DASHBOARD_ACCOUNT_SELECT_TOOLTIP')} />
          <SAccountDropdown
            accounts={accounts}
            selected={settings.dashboardAccounts}
            onSubmit={(selected: TUuid[]) => {
              updateSettingsAccounts(selected);
            }}
          />
        </AccountDropdownWrapper>
      </WalletBreakdownTop>
      <WalletBreakdownPanel>
        {currentAccounts.length === 0 ? (
          <NoAccountsSelected />
        ) : showBalanceDetailView ? (
          <BalancesDetailView
            balances={balances}
            toggleShowChart={toggleShowChart}
            totalFiatValue={totalFiatValue}
            fiat={fiat}
            accounts={accounts}
            selected={settings.dashboardAccounts}
          />
        ) : (
          <WalletBreakdownView
            balances={balances}
            toggleShowChart={toggleShowChart}
            totalFiatValue={totalFiatValue}
            fiat={fiat}
            accounts={accounts}
            selected={settings.dashboardAccounts}
          />
        )}
      </WalletBreakdownPanel>
    </>
  );
}
