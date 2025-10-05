import { ReactNode, useEffect } from "react";

interface AccessibilityWrapperProps {
  children: ReactNode;
  pageTitle: string;
  announcement?: string;
}

export const AccessibilityWrapper = ({ children, pageTitle, announcement }: AccessibilityWrapperProps) => {
  useEffect(() => {
    // Set document title for screen readers
    document.title = `${pageTitle} - Snake Scholars Quest`;

    // Announce page changes
    if (announcement) {
      const announcer = document.getElementById("live-announcer");
      if (announcer) {
        announcer.textContent = announcement;
      }
    }
  }, [pageTitle, announcement]);

  return (
    <>
      {/* Screen reader live region for announcements */}
      <div
        id="live-announcer"
        className="sr-only"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      />
      
      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:m-4"
      >
        Skip to main content
      </a>

      <main id="main-content" className="focus:outline-none" tabIndex={-1}>
        {children}
      </main>
    </>
  );
};
