export const SITE = {
  businessName: "Mama Joy's Cosmetics and Collections",
  shortName: "Mama Joy's",
  location: "Bantima, Kumasi",
  fullAddress: "Bantima, Kumasi, Ghana",
  phone: "0244948390",
  phoneHref: "tel:+233244948390",
  whatsappHref: "https://wa.me/233244948390",
  currency: "GHS",
  deliveryFeeKumasi: 20,
  deliveryFeeOther: 35,
  categories: [
    "Skincare",
    "Makeup",
    "Hair Care",
    "Body Care",
    "Fragrance",
    "Bridal Collection",
    "Accessories",
    "Other",
  ],
};

export const formatGHS = (amount) =>
  new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(Number(amount) || 0);
