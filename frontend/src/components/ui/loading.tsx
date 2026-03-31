export function Loading() {
  return (
    <div className="flex w-full items-center justify-center gap-2 py-8 text-sm text-slate-500">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
      <span>Carregando...</span>
    </div>
  );
}
