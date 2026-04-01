/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

interface HeaderProps {
  asLink?: boolean;
}

export function Header({ asLink = false }: HeaderProps) {
  const content = (
    <div className="flex items-center gap-3 h-8">
      {/* Brand logo and text removed as requested */}
    </div>
  );

  if (asLink) {
    return (
      <Link
        href="/"
        className="flex items-center hover:opacity-80 transition-opacity"
      >
        {content}
      </Link>
    );
  }

  return content;
}
