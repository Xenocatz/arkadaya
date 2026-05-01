import * as React from "react";
import { LucideIcon } from "lucide-react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: LucideIcon;
  onIconClick?: () => void;
  iconRight?: LucideIcon;
  onIconRightClick?: () => void;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon: Icon, onIconClick, iconRight: IconRight, onIconRightClick, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {Icon && (
          <div 
            className={`absolute left-3 top-1/2 -translate-y-1/2 text-[#0a2d5e] ${onIconClick ? "cursor-pointer" : ""}`}
            onClick={onIconClick}
          >
            <Icon size={20} strokeWidth={2.5} />
          </div>
        )}
        <input
          type={type}
          className={`flex h-12 w-full rounded-xl border border-[#b4cbe0] bg-[#dce6f1] px-4 py-2 text-sm text-[#0a2d5e] placeholder:text-[#0a2d5e]/50 focus:outline-none focus:ring-2 focus:ring-[#5a94cc] focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${Icon ? "pl-11" : ""} ${IconRight ? "pr-11" : ""} ${className || ""}`}
          ref={ref}
          {...props}
        />
        {IconRight && (
          <div 
            className={`absolute right-3 top-1/2 -translate-y-1/2 text-[#0a2d5e] ${onIconRightClick ? "cursor-pointer" : ""}`}
            onClick={onIconRightClick}
          >
            <IconRight size={20} strokeWidth={2.5} />
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
