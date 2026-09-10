import { forwardRef } from 'react'

const variants = {
    default:
        'border-slate-300 bg-transparent text-slate-700 hover:border-slate-400 hover:bg-slate-100',
    sucess: 'border-green-600 bg-green-600 text-white hover:bg-green-700',
    success: 'border-green-600 bg-green-600 text-white hover:bg-green-700',
    warning: 'border-orange-500 bg-orange-500 text-white hover:bg-orange-600',
    danger: 'border-red-600 bg-red-600 text-white hover:bg-red-700',
}

const Buttons = forwardRef(function Buttons(
    {
        variant = 'default',
        type = 'button',
        className = '',
        children,
        ...props
    },
    ref,
) {
    const variantClasses = variants[variant] ?? variants.default

    return (
        <button
            ref={ref}
            type={type}
            className={`inline-flex min-h-10 cursor-pointer items-center justify-center rounded-lg border px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:opacity-50 ${variantClasses} ${className}`}
            {...props}
        >
            {children}
        </button>
    )
})

export default Buttons
