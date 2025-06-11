# Wallet Component Refactoring

## Issues Identified

### 1. Type Safety Issues
- **Missing Type for blockchain**: The `blockchain` parameter in `getPriority()` was typed as `any` instead of a specific type.
- **Undefined Variable**: `lhsPriority` was used in the filter function but was never defined (should be `balancePriority`).
- **Type Mismatch**: The `rows` mapping used `FormattedWalletBalance` type but the data came from `sortedBalances` which contained `WalletBalance` objects.
- **Missing Blockchain Property**: The interface definitions were missing the `blockchain` property that was being used in the code.

### 2. Performance Issues
- **Redundant Calculations**: `sortedBalances` was computed once but then mapped over twice.
- **Unnecessary Dependencies**: `prices` was included in the dependency array of `useMemo` but not used in the calculation.
- **Inefficient Rendering**: The component didn't use memoization for expensive calculations like `formattedBalances` and `rows`.
- **Missing Return Value**: The sort comparator function didn't handle the case when priorities are equal.

### 3. Code Structure Issues
- **Function Recreation**: The `getPriority` function was defined inside the component and recreated on every render.
- **Empty Interface Extension**: `Props` extended `BoxProps` without adding any properties, which is unnecessary.
- **Index as Key**: Using array index as React key can cause performance issues with dynamic lists.
- **Unused Formatted Balances**: `formattedBalances` was created but not used in the `rows` mapping.

## Improvements Made

### 1. Type Safety Improvements
- Added proper typing for the `blockchain` property in both interfaces
- Fixed the variable name issue by changing `lhsPriority` to `balancePriority`
- Used the correct data source (`formattedBalances`) for the rows mapping

### 2. Performance Optimizations
- Moved `getPriority` outside the component to prevent recreation on each render
- Removed `prices` from the dependency array of the first `useMemo` since it's not used
- Added `useMemo` for `formattedBalances` and `rows` to prevent unnecessary recalculations
- Added a missing return value (`return 0`) for the case when priorities are equal

### 3. Code Structure Improvements
- Changed `interface Props extends BoxProps {}` to `type Props = BoxProps` for cleaner code
- Used a more stable key for list items (`${balance.currency}-${index}`) instead of just index
- Used `formattedBalances` in the `rows` mapping instead of re-mapping `sortedBalances`
- Added helpful comments to explain the purpose of each section
