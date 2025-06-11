import { useRef, useEffect } from 'react'
import useGenealogyStore from '../stores/genealogy-store'


export function useGenealogyCanvas() {
  const svgRef = useRef<SVGSVGElement>(null)
  const { 
    initializeEngine, 
    exportSVG, 
    zoomToFit, 
    cleanup,
    layout,
    validation,
    isLoading,
    error
  } = useGenealogyStore()


  useEffect(() => {
    if (svgRef.current) {
      initializeEngine(svgRef.current)
    }


    return () => {
      cleanup()
    }
  }, [initializeEngine, cleanup])

  return {
    svgRef,
    layout,
    validation,
    isLoading,
    error,
    exportSVG,
    zoomToFit
  }
} 