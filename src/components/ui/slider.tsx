import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@/lib/utils';

type RadixProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>;

type SliderProps = Omit<RadixProps, 'value' | 'onValueChange'> & {
  // Accept either number (single thumb) or number[] (multi-thumb) for convenience
  value?: number | number[];
  defaultValue?: number | number[];
  onValueChange?: (val: number | number[]) => void;
};

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, value, defaultValue, onValueChange, ...props }, ref) => {
    // Normalize value/defaultValue to number[] for Radix
    const normalizedValue = value === undefined ? undefined : (Array.isArray(value) ? value : [value]);
    const normalizedDefault = defaultValue === undefined ? undefined : (Array.isArray(defaultValue) ? defaultValue : [defaultValue]);

    const handleValueChange = (vals: number[]) => {
      if (!onValueChange) return;
      // If original consumer passed a single number, call with number; otherwise pass array
      if (value !== undefined && !Array.isArray(value)) {
        onValueChange(vals[0]);
      } else if (defaultValue !== undefined && !Array.isArray(defaultValue) && value === undefined) {
        // uncontrolled single-number usage (used defaultValue), call with single number
        onValueChange(vals[0]);
      } else {
        onValueChange(vals);
      }
    };

    return (
      <SliderPrimitive.Root
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        {...(normalizedValue ? { value: normalizedValue } : {})}
        {...(normalizedDefault ? { defaultValue: normalizedDefault } : {})}
        onValueChange={handleValueChange}
        {...props}
      >
        <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
          <SliderPrimitive.Range className="absolute h-full bg-primary" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" />
      </SliderPrimitive.Root>
    );
  }
);

Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
