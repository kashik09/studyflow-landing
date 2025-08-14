export default function Section({ id, title, subtitle, children, className = "" }) {
  return (
    <section id={id} className={`container-p py-12 sm:py-16 ${className}`}>
      <div className="mx-auto max-w-6xl">
        {title && (
          <div className="mb-6">
            <h2 className="text-2xl sm:text-3xl font-semibold text-rose-900">{title}</h2>
            {subtitle && <p className="mt-2 text-rose-800/80">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  );
}
