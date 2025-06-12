import { FormField, FormItem, FormControl } from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { ChevronDown } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import type { Token, SwapFormValues } from '../types';

interface TokenFieldProps {
  type: 'sell' | 'buy';
  token: Token;
  form: UseFormReturn<SwapFormValues>;
  onAmountChange: (value: string) => void;
  onTokenClick: () => void;
  renderTokenLogo: (symbol: string) => React.ReactNode;
  className?: string;
}

export function TokenField({
  type,
  token,
  form,
  onAmountChange,
  onTokenClick,
  renderTokenLogo,
  className = '',
}: TokenFieldProps) {
  const fieldName = type === 'sell' ? 'sellAmount' : 'buyAmount';
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className={`bg-zinc-800 rounded-xl p-4 mb-2 w-full ${className}`}>
      <div className="text-md font-medium text-zinc-300 text-left mb-2">{label}</div>
      <div className="flex justify-between items-center">
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => onAmountChange(e.target.value)}
                  className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 font-semibold text-white -ml-3"
                  placeholder="0"
                  style={{ fontSize: '2rem' }}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button 
          className="rounded-full border border-zinc-700 h-10 flex items-center gap-2"
          onClick={onTokenClick}
        >
          <div className="w-6 h-6 rounded-full overflow-hidden flex items-center justify-center">
            {renderTokenLogo(token.symbol)}
          </div>
          <div className="text-lg font-medium text-white">{token.symbol}</div>
          <ChevronDown className="h-4 w-4 text-zinc-400" />
        </Button>
      </div>
    </div>
  );
}
