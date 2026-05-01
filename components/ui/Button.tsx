import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-xl bg-[#5a94cc] hover:bg-[#487fb1] px-10 py-3 text-base font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[#025eb3]/50 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ${className || ""}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
