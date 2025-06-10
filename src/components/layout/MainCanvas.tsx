import { useRef, useEffect, useState } from 'react'
import { Navbar } from './Navbar'

export function MainCanvas() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const animationRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    // Gestion du zoom avec la molette
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      
      const scaleFactor = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.max(0.1, Math.min(5, transform.scale * scaleFactor))
      
      setTransform(prev => ({
        ...prev,
        scale: newScale
      }))
    }

    // Gestion du drag optimisée
    const handleMouseDown = (e: MouseEvent) => {
      e.preventDefault()
      setIsDragging(true)
      setDragStart({ x: e.clientX - transform.x, y: e.clientY - transform.y })
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      
      // Utiliser requestAnimationFrame pour la fluidité
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

    // Event listeners
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
  }, [transform, isDragging, dragStart])

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
            ref={svgRef}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            {/* Groupe principal avec transformations */}
            <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
              {/* Éléments de test pour l'arbre généalogique */}
              
              {/* Grille de référence */}
              <defs>
                <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                  <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
                </pattern>
              </defs>
              <rect width="2000" height="2000" fill="url(#grid)" x="-1000" y="-1000" />
              
              {/* Croix centrale pour marquer le point (0,0) */}
              <g id="center-cross">
                <line x1="-20" y1="0" x2="20" y2="0" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <line x1="0" y1="-20" x2="0" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.6"/>
                <circle cx="0" cy="0" r="3" fill="currentColor" opacity="0.8"/>
              </g>
              
              {/* Exemples d'individus - Génération 1 (Grands-parents) */}
              <g id="generation-1">
                {/* Grand-père paternel */}
                <rect x="100" y="100" width="40" height="40" fill="none" stroke="#2563eb" strokeWidth="2" rx="4"/>
                <text x="120" y="155" textAnchor="middle" fontSize="12" fill="currentColor">GP1</text>
                
                {/* Grand-mère paternelle */}
                <circle cx="200" cy="120" r="20" fill="none" stroke="#2563eb" strokeWidth="2"/>
                <text x="200" y="155" textAnchor="middle" fontSize="12" fill="currentColor">GM1</text>
                
                {/* Ligne de mariage */}
                <line x1="140" y1="120" x2="180" y2="120" stroke="#2563eb" strokeWidth="2"/>
                
                {/* Grand-père maternel */}
                <rect x="400" y="100" width="40" height="40" fill="none" stroke="#7c3aed" strokeWidth="2" rx="4"/>
                <text x="420" y="155" textAnchor="middle" fontSize="12" fill="currentColor">GP2</text>
                
                {/* Grand-mère maternelle */}
                <circle cx="500" cy="120" r="20" fill="none" stroke="#7c3aed" strokeWidth="2"/>
                <text x="500" y="155" textAnchor="middle" fontSize="12" fill="currentColor">GM2</text>
                
                {/* Ligne de mariage */}
                <line x1="440" y1="120" x2="480" y2="120" stroke="#7c3aed" strokeWidth="2"/>
              </g>
              
              {/* Génération 2 (Parents) */}
              <g id="generation-2">
                {/* Père */}
                <rect x="200" y="250" width="40" height="40" fill="#2563eb" stroke="#2563eb" strokeWidth="2" rx="4"/>
                <text x="220" y="305" textAnchor="middle" fontSize="12" fill="currentColor">Père</text>
                
                {/* Mère */}
                <circle cx="320" cy="270" r="20" fill="#7c3aed" stroke="#7c3aed" strokeWidth="2"/>
                <text x="320" y="305" textAnchor="middle" fontSize="12" fill="currentColor">Mère</text>
                
                {/* Ligne de mariage */}
                <line x1="240" y1="270" x2="300" y2="270" stroke="#059669" strokeWidth="2"/>
                
                {/* Connexions vers parents */}
                <line x1="160" y1="140" x2="160" y2="200" stroke="#666" strokeWidth="1"/>
                <line x1="160" y1="200" x2="220" y2="200" stroke="#666" strokeWidth="1"/>
                <line x1="220" y1="200" x2="220" y2="250" stroke="#666" strokeWidth="1"/>
                
                <line x1="470" y1="140" x2="470" y2="200" stroke="#666" strokeWidth="1"/>
                <line x1="470" y1="200" x2="320" y2="200" stroke="#666" strokeWidth="1"/>
                <line x1="320" y1="200" x2="320" y2="250" stroke="#666" strokeWidth="1"/>
              </g>
              
              {/* Génération 3 (Enfants) */}
              <g id="generation-3">
                {/* Enfant 1 */}
                <rect x="180" y="400" width="35" height="35" fill="none" stroke="#059669" strokeWidth="2" rx="4"/>
                <text x="197.5" y="450" textAnchor="middle" fontSize="12" fill="currentColor">E1</text>
                
                {/* Enfant 2 */}
                <circle cx="270" cy="417.5" r="17.5" fill="none" stroke="#059669" strokeWidth="2"/>
                <text x="270" y="450" textAnchor="middle" fontSize="12" fill="currentColor">E2</text>
                
                {/* Enfant 3 */}
                <rect x="320" y="400" width="35" height="35" fill="none" stroke="#059669" strokeWidth="2" rx="4"/>
                <text x="337.5" y="450" textAnchor="middle" fontSize="12" fill="currentColor">E3</text>
                
                {/* Connexions vers parents */}
                <line x1="270" y1="290" x2="270" y2="350" stroke="#666" strokeWidth="1"/>
                <line x1="180" y1="350" x2="360" y2="350" stroke="#666" strokeWidth="1"/>
                <line x1="197.5" y1="350" x2="197.5" y2="400" stroke="#666" strokeWidth="1"/>
                <line x1="270" y1="350" x2="270" y2="400" stroke="#666" strokeWidth="1"/>
                <line x1="337.5" y1="350" x2="337.5" y2="400" stroke="#666" strokeWidth="1"/>
              </g>
              

            </g>
          </svg>
        </div>
        
        {/* Informations de position et zoom - fixe en bas à droite */}
        <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm border border-border/30 rounded-lg p-3 text-xs text-muted-foreground min-w-[140px]">
          <div className="space-y-1">
            <div>Zoom: {transform.scale.toFixed(2)}x</div>
            <div>X: {transform.x.toFixed(0)}</div>
            <div>Y: {transform.y.toFixed(0)}</div>
          </div>
        </div>

        {/* Instructions d'usage */}
        <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm border border-border/30 rounded-lg p-3 text-xs text-muted-foreground">
          <div>• Molette : Zoom/Dézoom</div>
          <div>• Cliquer-glisser : Déplacer la vue</div>
        </div>
      </div>
    </div>
  )
} 