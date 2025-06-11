import { useCallback, useRef, useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { ZoomIn, TreePine } from 'lucide-react'
import { TreeLayout } from '../../types/genealogy'

interface MainCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>
  layout: TreeLayout | null
  zoomToFit: () => void
}

export function MainCanvas({ svgRef, layout, zoomToFit }: MainCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Gestion du zoom avec la molette
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      const rect = container.getBoundingClientRect()
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor))
      
      // Zoom centré sur le centre de la vue
      const scaleChange = newScale / transform.scale
      const newX = centerX - (centerX - transform.x) * scaleChange
      const newY = centerY - (centerY - transform.y) * scaleChange
      
      setTransform({
        x: newX,
        y: newY,
        scale: newScale
      })
    }

    container.addEventListener('wheel', handleWheel, { passive: false })
    return () => container.removeEventListener('wheel', handleWheel)
  }, [transform])

  // Gestion du drag (pan)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setDragStart({ 
      x: e.clientX - transform.x, 
      y: e.clientY - transform.y 
    })
  }, [transform])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return
    
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }))
  }, [isDragging, dragStart])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleZoomToFit = useCallback(() => {
    // Réinitialiser la transformation locale puis appeler le zoom intelligent
    setTransform({ x: 0, y: 0, scale: 1 })
    setTimeout(() => zoomToFit(), 100)
  }, [zoomToFit])

  const handleResetView = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 })
  }, [])

  return (
    <div className="flex-1 h-screen flex flex-col bg-gray-50">
      {/* Header du canvas */}
      <div className="p-4 border-b border-border/30 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
            <TreePine className="h-5 w-5" />
            Arbre Généalogique
          </h1>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleResetView}
              className="flex items-center gap-2"
            >
              Vue normale
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleZoomToFit}
              className="flex items-center gap-2"
            >
              <ZoomIn className="h-4 w-4" />
              Zoom ajusté
            </Button>
          </div>
        </div>
      </div>

      {/* Zone de canvas SVG */}
      <div 
        ref={containerRef}
        className="flex-1 relative overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
      >
        <div 
          style={{
            transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
            transformOrigin: '0 0',
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          <svg
            ref={svgRef}
            style={{
              width: layout?.canvasSize.width || 1200,
              height: layout?.canvasSize.height || 800,
              background: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
        </div>
        
        {/* Indicateur de coordonnées et zoom */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border shadow-sm">
          <div>Zoom: {transform.scale.toFixed(2)}x</div>
          <div>X: {Math.round(transform.x)}</div>
          <div>Y: {Math.round(transform.y)}</div>
          {layout && (
            <div className="border-t pt-1 mt-1">
              <div>Canvas: {layout.canvasSize.width}x{layout.canvasSize.height}</div>
              <div>Centre: ({layout.canvasSize.width/2}, {layout.canvasSize.height/2})</div>
            </div>
          )}
        </div>

        {/* Instructions en bas à gauche */}
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border shadow-sm">
          <div>• Molette : Zoom/Dézoom</div>
          <div>• Cliquer-glisser : Déplacer la vue</div>
          <div>• Clic sur individu : Sélection</div>
        </div>
      </div>
    </div>
  )
} 