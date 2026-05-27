export const formatCurrency = (amount: number): string =>
   new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
   }).format(amount)

export const formatCurrencyShort = (amount: number): string => {
   const abs = Math.abs(amount)
   if (abs >= 10_000_000) {
      const millions = amount / 1_000_000
      const str = millions % 1 === 0 ? millions.toString() : millions.toFixed(1)
      return `$${str}M`
   }
   return formatCurrency(amount)
}
