import { cloneElement, isValidElement } from "react";

export function Slot({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (isValidElement(children)) {
    const child = children as React.ReactElement<Record<string, unknown>>;
    return cloneElement(child, {
      ...props,
      className: [props.className, child.props.className].filter(Boolean).join(" ")
    });
  }
  return null;
}
