import { useRef, useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import { TreeLayout } from '../../types/genealogy'

interface MainCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>
  layout: TreeLayout | null
  zoomToFit: () => void
}

export function MainCanvas({ svgRef, layout, zoomToFit }: MainCanvasProps) {
  const containerRef = useRef<SVGSVGElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const svg = containerRef.current
    if (!svg) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
      setTransform(prev => ({
        ...prev,
        scale: Math.max(0.1, Math.min(5, prev.scale * scaleFactor))
      }))
    }

    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setTransform(prev => {
        const newDragStart = { x: e.clientX - prev.x, y: e.clientY - prev.y }
        setDragStart(newDragStart)
        return prev
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      
      animationRef.current = requestAnimationFrame(() => {
        setTransform(prev => ({
          ...prev,
          x: e.clientX - dragStart.x,
          y: e.clientY - dragStart.y
        }))
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }

    svg.addEventListener('wheel', handleWheel, { passive: false })
    svg.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      svg.removeEventListener('wheel', handleWheel)
      svg.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isDragging, dragStart])

  return (
    <div className="flex-1 h-screen p-6">
      <div className="h-full bg-card border border-border shadow-sm rounded-lg relative overflow-hidden">
        {/* Quadrillage de fond */}
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px',
          }}
        />
        
        {/* Navbar flottante */}
        <div className="absolute top-3 left-6 right-6 z-20">
          <Navbar />
        </div>
        
        {/* SVG Canvas principal */}
        <div className="relative z-10 h-full">
          <svg
            ref={containerRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Grille de référence */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="2000" height="2000" fill="url(#grid)" x="-1000" y="-1000" />
              
              {/* SVG généré par D3.js pour l'arbre généalogique */}
              <svg
                ref={svgRef}
                x="50"
                y="50"
                width="1000"
                height="600"
                style={{ overflow: 'visible' }}
              />
            </g>
          </svg>
        </div>
        
        {/* Coordonnées et zoom - bas droite */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border/30 rounded-lg p-3 text-xs text-muted-foreground">
          <div className="space-y-1">
            <div>Zoom: {transform.scale.toFixed(2)}x</div>
            <div>X: {transform.x.toFixed(0)}</div>
            <div>Y: {transform.y.toFixed(0)}</div>
          </div>
        </div>

        {/* Instructions - bas gauche */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border/30 rounded-lg p-3 text-xs text-muted-foreground">
          <div>• Molette : Zoom/Dézoom</div>
          <div>• Cliquer-glisser : Déplacer la vue</div>
          <div>• Clic sur individu : Sélection</div>
        </div>

        {/* Bouton zoom ajusté */}
        <div className="absolute top-20 right-4">
          <button
            onClick={zoomToFit}
            className="px-3 py-2 text-xs bg-background/90 backdrop-blur-sm border border-border/30 rounded-lg hover:bg-background text-foreground"
          >
            Zoom ajusté
          </button>
        </div>
      </div>
    </div>
  )
} 