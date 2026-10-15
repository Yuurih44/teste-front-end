import type { ReactNode } from "react";
import { useDialog } from "../hooks/useDialog";
interface Props {
  children: ReactNode;
  titleId: string;
  className: string;
  closeLabel: string;
  onClose: () => void;
}
export default function Dialog({
  children,
  titleId,
  className,
  closeLabel,
  onClose,
}: Props) {
  const ref = useDialog();
  return (
    <dialog
      ref={ref}
      className={className}
      aria-labelledby={titleId}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not(:disabled), a[href], input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
          ),
        );
        const first = controls[0],
          last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const rect = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < rect.left ||
          event.clientX > rect.right ||
          event.clientY < rect.top ||
          event.clientY > rect.bottom
        )
          onClose();
      }}
    >
      <button
        className="close-button"
        onClick={onClose}
        aria-label={closeLabel}
      >
        ×
      </button>
      {children}
    </dialog>
  );
}
