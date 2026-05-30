import { cn } from '@/utils/cn'

interface MonthCellProps {
   label: string
   selected: boolean
   onClick: () => void
}

export const MonthCell: React.FC<MonthCellProps> = ({ label, selected, onClick }) => (
   <button
      type="button"
      onClick={onClick}
      className={cn(
         'h-9 rounded-sm border text-[13px] font-body cursor-pointer transition-colors duration-150 active:scale-[0.96]',
         selected
            ? 'bg-accent text-[#003a34] border-transparent font-bold'
            : 'border-border-strong text-text-secondary bg-transparent hover:bg-white/6 hover:text-white'
      )}
   >
      {label}
   </button>
)
