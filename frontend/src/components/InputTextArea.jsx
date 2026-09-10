import { forwardRef, useId } from 'react'

const InputTextArea = forwardRef(function InputTextArea(
    {
        label,
        id,
        error,
        helperText,
        rows = 4,
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
                <textarea
                    ref={ref}
                    id={inputId}
                    rows={rows}
                    placeholder=" "
                    aria-invalid={Boolean(error)}
                    aria-describedby={descriptionId}
                    className={`peer w-full resize-y rounded-lg border bg-white px-3 pt-5 pb-2 text-slate-900 outline-none transition-colors placeholder:text-transparent disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500 ${
                        error
                            ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-100'
                            : 'border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-100'
                    } ${className}`}
                    {...props}
                />
                <label
                    htmlFor={inputId}
                    className={`pointer-events-none absolute left-3 top-0 -translate-y-1/2 bg-white px-1 text-xs transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs ${
                        error
                            ? 'text-red-600'
                            : 'text-slate-500 peer-focus:text-sky-600'
                    } peer-disabled:bg-slate-100 peer-disabled:text-slate-400`}
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

export default InputTextArea
