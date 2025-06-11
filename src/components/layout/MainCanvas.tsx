import { useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { ZoomIn, TreePine } from 'lucide-react'
import { TreeLayout } from '../../types/genealogy'

interface MainCanvasProps {
  svgRef: React.RefObject<SVGSVGElement | null>
  layout: TreeLayout | null
  zoomToFit: () => void
}

export function MainCanvas({ svgRef, layout, zoomToFit }: MainCanvasProps) {
  const handleZoomToFit = useCallback(() => {
    zoomToFit()
  }, [zoomToFit])

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
      <div className="flex-1 relative overflow-hidden">
        <svg
          ref={svgRef}
          className="w-full h-full"
          style={{
            minHeight: '600px',
            background: 'linear-gradient(to right, #f1f5f9 1px, transparent 1px), linear-gradient(to bottom, #f1f5f9 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        
        {/* Indicateur de coordonnées en bas à droite */}
        {layout && (
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground border shadow-sm">
            <div>Canvas: {layout.canvasSize.width}x{layout.canvasSize.height}</div>
            <div>Centre: ({layout.canvasSize.width/2}, {layout.canvasSize.height/2})</div>
          </div>
        )}
      </div>
    </div>
  )
} 