import type { ReactNode } from 'react';

interface SectionHeaderProps {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  action?: { href: string; label: string; external?: boolean };
  inverse?: boolean;
}

export function SectionHeader({ id, eyebrow, title, action, inverse }: SectionHeaderProps) {
  return (
    <div className={`section-head ${inverse ? 'section-head--inverse' : ''}`}>
      <div>
        {eyebrow && <p className="section-head__eyebrow">{eyebrow}</p>}
        <h2 id={id} className="h2">
          {title}
        </h2>
      </div>
      {action && (
        <a
          className="text-link"
          href={action.href}
          {...(action.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {action.label} <span aria-hidden="true">›</span>
        </a>
      )}
    </div>
  );
}
