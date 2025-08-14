export default function FeatureCard({ title, children, icon }) {
  return (
    <div className="card p-5 sm:p-6">
      <div className="mb-3 flex items-center gap-3">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-rose-200 to-pink-200" />
        <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
      </div>
      <p className="text-rose-800/90">{children}</p>
    </div>
  );
}
