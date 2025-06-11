interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string; // Added based on usage
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  blockchain: string; // Added based on usage
}

type Props = BoxProps;

// Move outside component to prevent recreation on each render
const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case 'Osmosis':
      return 100
    case 'Ethereum':
      return 50
    case 'Arbitrum':
      return 30
    case 'Zilliqa':
      return 20
    case 'Neo':
      return 20
    default:
      return -99
  }
}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // Keep original logic but fix the variable name issue (lhsPriority -> balancePriority)
  const sortedBalances = useMemo(() => {
    return balances.filter((balance: WalletBalance) => {
      const balancePriority = getPriority(balance.blockchain);
      if (balancePriority > -99) {
        if (balance.amount <= 0) {
          return true;
        }
      }
      return false
    }).sort((lhs: WalletBalance, rhs: WalletBalance) => {
      const leftPriority = getPriority(lhs.blockchain);
      const rightPriority = getPriority(rhs.blockchain);
      if (leftPriority > rightPriority) {
        return -1;
      } else if (rightPriority > leftPriority) {
        return 1;
      }
      return 0; // Added missing case for equal priorities
    });
  }, [balances]); // Remove prices from dependency array since it's not used

  // Create formatted balances
  const formattedBalances = useMemo(() => {
    return sortedBalances.map((balance: WalletBalance) => {
      return {
        ...balance,
        formatted: balance.amount.toFixed()
      }
    });
  }, [sortedBalances]);

  // Use formattedBalances instead of sortedBalances
  const rows = useMemo(() => {
    return formattedBalances.map((balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow 
          className={classes.row}
          key={`${balance.currency}-${index}`} // Better key for stability
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      )
    });
  }, [formattedBalances, prices]);

  return (
    <div {...rest}>
      {rows}
    </div>
  );
};