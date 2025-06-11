import * as d3 from 'd3'
import {
  Individual,
  TreeLayout,
  FamilyConnection,
  GenealogyConfig,
  DEFAULT_CONFIG
} from '../types/genealogy'

/**
 * Renderer D3.js spécialisé pour arbres généalogiques médicaux
 * Gère le rendu des symboles génétiques et connexions familiales
 */
export class D3GenealogyRenderer {
  private config: GenealogyConfig
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined> | null = null
  private mainGroup: d3.Selection<SVGGElement, unknown, null, undefined> | null = null

  constructor(config: Partial<GenealogyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Initialisation du renderer avec le SVG
   */
  initialize(svgElement: SVGSVGElement): void {
    this.svg = d3.select(svgElement)
    
    // Nettoyage du SVG existant
    this.svg.selectAll('*').remove()
    
    // Configuration du SVG pour un rendu centré
    this.svg
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('background-color', '#f8f9fa')
    
    // Création du groupe principal
    this.mainGroup = this.svg.append('g')
      .attr('class', 'genealogy-tree')
  }

  /**
   * Rendu complet de l'arbre généalogique
   */
  render(layout: TreeLayout, onIndividualClick?: (individual: Individual) => void): void {
    if (!this.mainGroup) {
      console.error('Renderer non initialisé')
      return
    }

    // Configuration du SVG avec les bonnes dimensions
    if (this.svg) {
      const canvasWidth = layout.canvasSize.width
      const canvasHeight = layout.canvasSize.height
      
      this.svg
        .attr('width', canvasWidth)
        .attr('height', canvasHeight)
        .attr('viewBox', `0 0 ${canvasWidth} ${canvasHeight}`)
    }

    // Réinitialiser la transformation du groupe principal
    this.mainGroup.attr('transform', null)

    // Rendu des connexions familiales
    this.renderFamilyConnections(layout.connections)

    // Rendu des symboles génétiques
    this.renderGeneticSymbols(layout, onIndividualClick)
  }

  /**
   * Rendu des connexions familiales
   */
  private renderFamilyConnections(connections: FamilyConnection[]): void {
    if (!this.mainGroup) return

    const connectionsGroup = this.mainGroup.selectAll('.connections-group')
      .data([null])
      .join('g')
      .attr('class', 'connections-group')

    // Sélection des lignes de connexion
    const lines = connectionsGroup.selectAll('.family-connection')
      .data(connections, (d: unknown) => (d as FamilyConnection).id)

    // Entrée des nouvelles connexions
    const linesEnter = lines.enter()
      .append('path')
      .attr('class', 'family-connection')

    // Mise à jour + Entrée
    linesEnter.merge(lines as unknown as d3.Selection<SVGPathElement, FamilyConnection, SVGGElement, unknown>)
      .attr('d', (d: FamilyConnection) => this.createConnectionPath(d))
      .attr('stroke', (d: FamilyConnection) => d.path.style.stroke)
      .attr('stroke-width', (d: FamilyConnection) => d.path.style.strokeWidth)
      .attr('stroke-dasharray', (d: FamilyConnection) => d.path.style.strokeDasharray || 'none')
      .attr('fill', 'none')

    // Sortie des anciennes connexions
    lines.exit().remove()
  }

  /**
   * Création du chemin SVG pour une connexion
   */
  private createConnectionPath(connection: FamilyConnection): string {
    const points = connection.path.points
    if (points.length < 2) return ''

    // Création d'un chemin simple ligne par ligne
    let path = `M ${points[0].x} ${points[0].y}`
    
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x} ${points[i].y}`
    }

    return path
  }

  /**
   * Rendu des symboles génétiques
   */
  private renderGeneticSymbols(
    layout: TreeLayout, 
    onIndividualClick?: (individual: Individual) => void
  ): void {
    if (!this.mainGroup) return

    // Collecte de tous les individus
    const allIndividuals: Individual[] = []
    layout.generations.forEach(generation => {
      allIndividuals.push(...generation.individuals)
    })

    const symbolsGroup = this.mainGroup.selectAll('.symbols-group')
      .data([null])
      .join('g')
      .attr('class', 'symbols-group')

    // Supprimer et recréer tous les éléments pour garantir la fraîcheur des données
    symbolsGroup.selectAll('*').remove()

    // Créer tous les groupes d'individus
    const individualGroups = symbolsGroup.selectAll('.individual-group')
      .data(allIndividuals, (d: any) => d.id)
      .enter()
      .append('g')
      .attr('class', 'individual-group')
      .attr('data-individual-id', (d: any) => d.id)
      .attr('transform', (d: any) => 
        `translate(${d.layout.position.x}, ${d.layout.position.y})`
      )

    // Configuration de tous les groupes
    individualGroups.each((d: any, i: number, nodes: any) => {
      const group = d3.select(nodes[i])
      this.setupIndividualGroup(group as any, d, onIndividualClick)
    })
  }

  /**
   * Configuration d'un groupe d'individu avec symboles médicaux
   */
  private setupIndividualGroup(
    group: d3.Selection<SVGGElement, Individual, SVGGElement, unknown>,
    individual: Individual,
    onIndividualClick?: (individual: Individual) => void
  ): void {
    const symbol = individual.layout.symbol
    const size = individual.layout.size || this.config.symbols.size

    // Ajout du symbole principal selon le genre
    if (symbol.shape === 'square') {
      // Carré pour les hommes
      group.append('rect')
        .attr('class', 'individual-symbol')
        .attr('width', size)
        .attr('height', size)
        .attr('x', -size / 2)
        .attr('y', -size / 2)
        .attr('rx', 2)
        .attr('fill', symbol.fill === 'filled' ? '#000000' : '#ffffff')
        .attr('stroke', '#000000')
        .attr('stroke-width', this.config.symbols.strokeWidth)
    } else {
      // Cercle pour les femmes
      group.append('circle')
        .attr('class', 'individual-symbol')
        .attr('r', size / 2)
        .attr('fill', symbol.fill === 'filled' ? '#000000' : '#ffffff')
        .attr('stroke', '#000000')
        .attr('stroke-width', this.config.symbols.strokeWidth)
    }

    // Trait diagonal pour les individus décédés
    if (symbol.status === 'deceased') {
      group.append('line')
        .attr('class', 'deceased-line')
        .attr('x1', -size / 2)
        .attr('y1', -size / 2)
        .attr('x2', size / 2)
        .attr('y2', size / 2)
        .attr('stroke', '#000000')
        .attr('stroke-width', 2)
    }

    // Ajout du nom sous le symbole
    group.append('text')
      .attr('class', 'individual-name')
      .attr('x', 0)
      .attr('y', size / 2 + 15)
      .attr('text-anchor', 'middle')
      .attr('font-size', '12px')
      .attr('font-family', 'Arial, sans-serif')
      .attr('fill', 'currentColor')
      .text(individual.firstName)

    // Ajout de l'âge si disponible
    if (individual.age) {
      group.append('text')
        .attr('class', 'individual-age')
        .attr('x', 0)
        .attr('y', size / 2 + 30)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .attr('font-family', 'Arial, sans-serif')
        .attr('fill', 'currentColor')
        .text(`${individual.age} ans`)
    }

    // Marqueur spécial pour le proband (cas index)
    if (individual.medicalStatus.isProband) {
      group.append('text')
        .attr('class', 'proband-marker')
        .attr('x', size / 2 + 5)
        .attr('y', -size / 2 - 5)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('fill', '#dc2626')
        .text('→')
    }

    // Gestion des interactions
    if (onIndividualClick) {
      group
        .style('cursor', 'pointer')
        .on('click', (event: MouseEvent) => {
          event.stopPropagation()
          onIndividualClick(individual)
        })
        .on('mouseover', function() {
          d3.select(this).select('.individual-symbol')
            .attr('stroke-width', 3)
            .attr('stroke', '#2563eb')
        })
        .on('mouseout', function() {
          d3.select(this).select('.individual-symbol')
            .attr('stroke-width', 2)
            .attr('stroke', '#000000')
        })
    }
  }

  /**
   * Mise à jour de la position d'un individu
   */
  updateIndividualPosition(individualId: string, newPosition: { x: number; y: number }): void {
    if (!this.mainGroup) return

    this.mainGroup.select(`[data-individual-id="${individualId}"]`)
      .transition()
      .duration(300)
      .attr('transform', `translate(${newPosition.x}, ${newPosition.y})`)
  }

  /**
   * Nettoyage du renderer
   */
  cleanup(): void {
    if (this.svg) {
      this.svg.selectAll('*').remove()
    }
    this.svg = null
    this.mainGroup = null
  }

  /**
   * Export du SVG en tant que string
   */
  exportSVG(): string {
    if (!this.svg) return ''
    
    const svgNode = this.svg.node()
    if (!svgNode) return ''
    
    const serializer = new XMLSerializer()
    return serializer.serializeToString(svgNode)
  }



  /**
   * Méthode publique pour zoomer sur l'arbre
   */
  zoomToFit(layout: TreeLayout): void {
    if (!this.svg || !this.mainGroup) return
    
    const bounds = layout.bounds
    const canvasWidth = layout.canvasSize.width
    const canvasHeight = layout.canvasSize.height
    
    // Facteur de zoom pour que l'arbre occupe 90% de l'espace disponible
    const treeWidth = bounds.maxX - bounds.minX
    const treeHeight = bounds.maxY - bounds.minY
    
    // Obtenir les dimensions réelles du container SVG
    const svgElement = this.svg.node()
    const containerWidth = svgElement?.clientWidth || canvasWidth
    const containerHeight = svgElement?.clientHeight || canvasHeight
    
    const scaleX = (containerWidth * 0.9) / treeWidth
    const scaleY = (containerHeight * 0.9) / treeHeight
    const scale = Math.min(scaleX, scaleY, 1)
    
    // Centre de l'arbre
    const treeCenterX = canvasWidth / 2
    const treeCenterY = canvasHeight / 2
    
    // Centre du container
    const containerCenterX = containerWidth / 2
    const containerCenterY = containerHeight / 2
    
    // Translation pour centrer
    const translateX = containerCenterX - treeCenterX * scale
    const translateY = containerCenterY - treeCenterY * scale
    
    // Application de la transformation avec animation
    this.mainGroup
      .transition()
      .duration(500)
      .attr('transform', `translate(${translateX}, ${translateY}) scale(${scale})`)
  }
} 