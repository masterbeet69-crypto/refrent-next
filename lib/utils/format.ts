export function formatPrice(amount: number, currency = 'FCFA'): string {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' ' + currency;
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'medium' }).format(new Date(iso));
}
