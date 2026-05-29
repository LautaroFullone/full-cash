import { useEffect, useRef, useState } from 'react'

interface UseSwipeToCloseOptions {
   onClose: () => void
   isOpen: boolean
   threshold?: number
   velocityThreshold?: number
}

export const useSwipeToClose = ({
   onClose,
   isOpen,
   threshold = 100,
   velocityThreshold = 0.5,
}: UseSwipeToCloseOptions) => {
   const [dragY, setDragY] = useState(0)
   const [isDragging, setIsDragging] = useState(false)
   const startYRef = useRef(0)
   const startTimeRef = useRef(0)

   useEffect(() => {
      if (!isOpen) {
         setDragY(0)
         setIsDragging(false)
      }
   }, [isOpen])

   const handleTouchStart = (e: React.TouchEvent) => {
      startYRef.current = e.touches[0].clientY
      startTimeRef.current = Date.now()
      setIsDragging(true)
   }

   const handleTouchMove = (e: React.TouchEvent) => {
      if (!isDragging) return
      const delta = e.touches[0].clientY - startYRef.current
      if (delta > 0) setDragY(delta)
   }

   const handleTouchEnd = () => {
      if (!isDragging) return
      const elapsed = Date.now() - startTimeRef.current
      const velocity = elapsed > 0 ? dragY / elapsed : 0
      if (dragY > threshold || velocity > velocityThreshold) {
         onClose()
      } else {
         setDragY(0)
      }
      setIsDragging(false)
   }

   return {
      dragHandlers: {
         onTouchStart: handleTouchStart,
         onTouchMove: handleTouchMove,
         onTouchEnd: handleTouchEnd,
         onTouchCancel: handleTouchEnd,
      },
      sheetStyle: {
         transform: dragY > 0 ? `translateY(${dragY}px)` : undefined,
         transition: isDragging ? 'none' : 'transform 0.25s cubic-bezier(0.2, 0, 0, 1)',
      },
      isDragging,
   }
}
