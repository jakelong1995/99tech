// Common types used across the application

export interface Token {
  symbol: string;
  name: string;
  logo?: string;
  address: string;
  price?: number;
}

export interface SwapDetails {
  sellAmount: string;
  buyAmount: string;
  price: string;
  minimumReceived: string;
  slippage: string;
  fee: string;
}

export interface SwapFormValues {
  sellAmount: string;
  buyAmount: string;
}
