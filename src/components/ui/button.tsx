import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../utils/cn"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg hover:shadow-indigo-500/25 hover:from-indigo-500 hover:to-purple-500 active:shadow-inner",
        destructive:
          "bg-red-600/10 text-red-400 border border-red-600/20 hover:bg-red-600/20 hover:border-red-600/30 shadow-lg backdrop-blur-sm hover:shadow-red-500/25 active:shadow-inner",
        outline:
          "border border-gray-700/30 bg-gray-800/30 backdrop-blur-xl hover:bg-gray-700/50 hover:text-accent-foreground",
        secondary:
          "bg-gray-700/50 text-white hover:bg-gray-600/50 hover:shadow-gray-500/25 active:shadow-inner shadow-lg backdrop-blur-sm",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-indigo-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }