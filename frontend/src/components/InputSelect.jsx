import { forwardRef, useId } from 'react'

const InputSelect = forwardRef(function InputSelect(
    {
        label,
        id,
        options = [],
        children,
        placeholder,
        isMulti = false,
        error,
        helperText,
        className = '',
        containerClassName = '',
        ...props
    },
    ref,
) {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const description = error || helperText
    const descriptionId = description ? `${inputId}-description` : undefined

    return (
        <div className={`w-full ${containerClassName}`}>
            <div className="relative">
                <select
                    ref={ref}
                    id={inputId}
                    multiple={isMulti}
                    aria-invalid={Boolean(error)}
                    aria-describedby={descriptionId}
                    className={`w-full rounded-lg border bg-white px-3 pt-4 pb-1.5 text-slate-900 outline-none transition-colors disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                        isMulti ? 'min-h-28' : 'min-h-12'
                    } ${
                        error
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                    } ${className}`}
                    {...props}
                >
                    {placeholder && !isMulti && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {children ??
                        options.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                </select>
                <label
                    htmlFor={inputId}
                    className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs ${
                        error ? 'text-red-600' : 'text-slate-500'
                    }`}
                >
                    {label}
                </label>
            </div>

            {description && (
                <p
                    id={descriptionId}
                    className={`mt-1.5 text-sm ${error ? 'text-red-600' : 'text-slate-500'}`}
                >
                    {error || helperText}
                </p>
            )}
        </div>
    )
})

export default InputSelect
