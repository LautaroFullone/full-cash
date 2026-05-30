interface ChartLegendItemProps {
   nombre: string
   color: string
}

export const ChartLegendItem: React.FC<ChartLegendItemProps> = ({ nombre, color }) => (
   <div className="flex items-center gap-1.5">
      <div
         className="w-2.5 h-2.5 rounded-full shrink-0"
         style={{ backgroundColor: color }}
      />
      <span className="text-xs text-text-secondary">{nombre}</span>
   </div>
)
