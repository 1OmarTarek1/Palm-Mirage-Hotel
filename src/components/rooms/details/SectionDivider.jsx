export function SectionDivider({ className = "" }) {
  return (
    <div className={`flex justify-center py-1 ${className}`}>
      <div className="h-px w-full max-w-5xl bg-gradient-to-r from-transparent via-border/80 to-transparent" />
    </div>
  );
}
