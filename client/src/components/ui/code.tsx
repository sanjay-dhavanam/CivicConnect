import * as React from "react";
import { cn } from "@/lib/utils";

interface CodeProps {
  language?: string;
  className?: string;
  children?: React.ReactNode;
}

export function Code({ language = "text", className, children, ...props }: CodeProps) {
  return (
    <pre
      className={cn(
        "relative rounded-md bg-slate-950 p-4 overflow-x-auto text-sm text-slate-50",
        className
      )}
      {...props}
    >
      {language && (
        <div className="absolute top-2 right-2 text-xs text-slate-400">
          {language}
        </div>
      )}
      <code className="font-mono">{children}</code>
    </pre>
  );
}