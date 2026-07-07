export function PageStub({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}
