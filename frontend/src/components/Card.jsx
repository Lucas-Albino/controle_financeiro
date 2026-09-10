function Card({
    title,
    children,
    className = '',
    contentClassName = '',
    titleClassName = '',
    ...props
}) {
    return (
        <section
            className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
            {...props}
        >
            {title && (
                <header
                    className={`flex min-h-12 items-center justify-start border-b border-slate-200 bg-slate-100 px-5 py-3 text-left font-semibold text-slate-800 ${titleClassName}`}
                >
                    {title}
                </header>
            )}

            <div className={`p-5 ${contentClassName}`}>{children}</div>
        </section>
    )
}

export default Card
