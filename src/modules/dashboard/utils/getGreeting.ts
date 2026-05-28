export const getGreeting = () => {
   const hour = new Date().getHours()
   if (hour < 12) return 'Buen día'
   if (hour < 20) return 'Buenas tardes'
   return 'Buenas noches'
}
