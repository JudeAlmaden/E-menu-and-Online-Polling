export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle ? (
        <p className="mt-1 text-sm text-gray-600 sm:text-base">{subtitle}</p>
      ) : null}
    </div>
  );
}


