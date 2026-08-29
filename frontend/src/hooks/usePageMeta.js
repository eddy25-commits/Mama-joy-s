import { useEffect } from "react";

const SITE_TITLE_SUFFIX = "Mama Joy's Cosmetics and Collections";
const DEFAULT_DESCRIPTION =
  "Shop quality skincare, makeup, hair care, and beauty essentials from Mama Joy's Cosmetics and Collections in Bantama, Kumasi. Secure Paystack checkout in Ghana cedis.";

/**
 * Sets document.title and the meta description tag for the current page,
 * restoring the previous values on unmount. Pass just a title, or a title
 * plus a page-specific description for better SEO/link-preview snippets.
 */
export function usePageMeta(title, description) {
  useEffect(() => {
    const previousTitle = document.title;
    const metaDescription = document.querySelector('meta[name="description"]');
    const previousDescription = metaDescription?.getAttribute("content");

    document.title = title ? `${title} | ${SITE_TITLE_SUFFIX}` : SITE_TITLE_SUFFIX;

    if (metaDescription) {
      metaDescription.setAttribute("content", description || DEFAULT_DESCRIPTION);
    }

    return () => {
      document.title = previousTitle;
      if (metaDescription && previousDescription) {
        metaDescription.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
