export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ru-RU").format(price) + " \u20BD";
}

export function formatPriceShort(price: number): string {
  if (price >= 1_000_000) {
    return (price / 1_000_000).toFixed(1).replace(".0", "") + " млн \u20BD";
  }
  return formatPrice(price);
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
