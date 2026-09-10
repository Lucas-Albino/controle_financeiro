import { forwardRef, useEffect, useId, useState } from 'react'

const InputDateTime = forwardRef(function InputDateTime(
    {
        label,
        id,
        type = 'date',
        error,
        helperText,
        value,
        defaultValue,
        onChange,
        onFocus,
        onBlur,
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
    const [isFocused, setIsFocused] = useState(false)
    const [hasValue, setHasValue] = useState(Boolean(value ?? defaultValue))

    useEffect(() => {
        if (value !== undefined) setHasValue(Boolean(value))
    }, [value])

    const labelIsRaised = isFocused || hasValue

    return (
        <div className={`w-full ${containerClassName}`}>
            <div className="relative">
                <input
                    ref={ref}
                    id={inputId}
                    type={type}
                    value={value}
                    defaultValue={defaultValue}
                    aria-invalid={Boolean(error)}
                    aria-describedby={descriptionId}
                    onChange={(event) => {
                        setHasValue(Boolean(event.target.value))
                        onChange?.(event)
                    }}
                    onFocus={(event) => {
                        setIsFocused(true)
                        onFocus?.(event)
                    }}
                    onBlur={(event) => {
                        setIsFocused(false)
                        setHasValue(Boolean(event.target.value))
                        onBlur?.(event)
                    }}
                    className={`min-h-12 w-full rounded-lg border bg-white px-3 pt-4 pb-1.5 outline-none transition-colors disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                        labelIsRaised ? 'text-slate-900' : 'text-transparent'
                    } ${
                        error
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                    } ${className}`}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={`pointer-events-none absolute left-3 bg-white px-1 transition-all ${
                        labelIsRaised
                            ? 'top-0 -translate-y-1/2 text-xs'
                            : 'top-1/2 -translate-y-1/2 text-sm'
                    } ${
                        error
                            ? 'text-red-600'
                            : isFocused
                              ? 'text-sky-600'
                              : 'text-slate-500'
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

export default InputDateTime
