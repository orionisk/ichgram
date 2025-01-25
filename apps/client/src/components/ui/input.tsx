import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

import * as React from 'react'

const inputVariants = cva(
  'flex w-full rounded-md border file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'h-10 px-3 py-2',
        profile: 'h-9 rounded-lg border-[#DBDBDB] px-4 text-sm sm:h-[42px]',
        website: 'h-9 rounded-lg px-9 text-sm font-semibold sm:h-[42px]',
        search:
          'h-9 rounded-lg pl-4 text-base placeholder:text-base placeholder:text-[#737373] sm:h-11',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(inputVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = 'Input'

export { Input, inputVariants }
