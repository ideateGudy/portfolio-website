import { useId } from 'react';

const fieldClass =
  'h-11 w-full rounded-xl border border-line bg-transparent px-4 text-sm text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
};

/** Labeled native <select> matching the Input styling (PRD §5 shared components). */
export function Select({ label, error, id, className = '', children, ...props }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? autoId;
  const errorId = `${selectId}-error`;
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-fg">
          {label}
        </label>
      )}
      <select
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? errorId : undefined}
        className={`${fieldClass} ${error ? 'border-red-600 dark:border-red-400' : ''} ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p id={errorId} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
