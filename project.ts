// A typed summary of the project. The site's own source code is private.

type Locale = "ka" | "en";

interface Project {
  name: string;
  client: string;
  liveSite: string;
  locales: Locale[];
  stack: string[];
  features: string[];
}

export const project: Project = {
  name: "Protools",
  client: "Protools, a supplier of professional construction tools in Tbilisi",
  liveSite: "https://www.protools.ge/ka",
  locales: ["ka", "en"],
  stack: ["Next.js", "Vercel"],
  features: [
    "Catalogue organised by category and by brand",
    "Filters for availability, sale items, brand and price",
    "Cart, wishlist, customer accounts and gift vouchers",
    "Site search, store locator and WhatsApp contact",
  ],
};
