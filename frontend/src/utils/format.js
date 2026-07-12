const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const ordinal = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
};

export const formatDateVerbose = (slotDate) => {
  if (!slotDate) return "";

  const parts = slotDate instanceof Date
    ? [slotDate.getDate(), slotDate.getMonth() + 1, slotDate.getFullYear()]
    : slotDate.split("-").map(Number);

  const [d, m, y] = parts;
  return `${d}${ordinal(d)} ${MONTHS[m - 1]} ${y}`;
};

export const formatAddress = (addr) => {
  if (!addr) return "";
  if (typeof addr === "string") return addr;
  return Object.values(addr).filter(Boolean).join(", ");
};
