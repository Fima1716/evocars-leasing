export const Icon = {
  Arrow: ({ className = "" }: { className?: string }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M3 11L11 3M11 3H4.5M11 3V9.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ArrowRight: ({ className = "" }: { className?: string }) => (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M2 7H12M12 7L7 2M12 7L7 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
};
