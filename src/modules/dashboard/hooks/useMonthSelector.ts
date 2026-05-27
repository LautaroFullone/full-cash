import { useState } from 'react'

export function useMonthSelector() {
   const now = new Date()
   const [mes, setMes] = useState(now.getMonth() + 1)
   const [anio, setAnio] = useState(now.getFullYear())

   const goToPrevMonth = () => {
      if (mes === 1) {
         setMes(12)
         setAnio(anio - 1)
      } else setMes(mes - 1)
   }

   const goToNextMonth = () => {
      if (mes === 12) {
         setMes(1)
         setAnio(anio + 1)
      } else setMes(mes + 1)
   }

   const goToMonth = (newMes: number, newAnio: number) => {
      setMes(newMes)
      setAnio(newAnio)
   }

   const monthName = new Date(anio, mes - 1).toLocaleDateString('es-AR', {
      month: 'long',
   })

   return { mes, anio, monthName, goToPrevMonth, goToNextMonth, goToMonth }
}
