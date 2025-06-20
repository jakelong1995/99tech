import type { Token } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateTokenAmount = (
  inputAmount: string,
  inputToken: Token,
  outputToken: Token,
): string => {
  if (!inputAmount || !inputToken || !outputToken) return "";

  const inputPrice = inputToken.price;
  const outputPrice = outputToken.price;

  if (!inputPrice || !outputPrice) return "";

  const inputValue = parseFloat(inputAmount);
  if (isNaN(inputValue)) return "";

  const inputValueInUSDT = inputValue * inputPrice;
  const outputValue = inputValueInUSDT / outputPrice;

  return outputValue.toFixed(4);
};
