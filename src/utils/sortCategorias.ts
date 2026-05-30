/** Ordena categorías alfabéticamente, dejando las predefinidas ("Otros gastos" /
 *  "Otros ingresos") siempre al final de la lista. */
export const sortCategorias = <T extends { nombre: string; isDefault?: boolean }>(
   categorias: T[]
) => {
   return [...categorias].sort((a, b) => {
      if (!!a.isDefault !== !!b.isDefault) return a.isDefault ? 1 : -1
      return a.nombre.localeCompare(b.nombre, 'es')
   })
}
