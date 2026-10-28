export function Loading({ label = "ஏற்றுகிறது… Loading" }: { label?: string }) {
  return (
    <div className="mx-auto flex max-w-5xl items-center justify-center gap-3 px-4 py-24 text-ink-soft">
      <span className="h-5 w-5 animate-spin rounded-full border-4 border-saffron border-t-transparent" />
      {label}
    </div>
  );
}
