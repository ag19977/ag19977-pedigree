// Unused import will be needed for future D3 features
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import * as d3 from 'd3'
import {
  Individual,
  Couple,
  Generation,
  TreeLayout,
  FamilyConnection,
  GenealogyConfig,
  DEFAULT_CONFIG,
  GeneticSymbol,
  ValidationResult
} from '../types/genealogy'

/**
 * Moteur généalogique centralisé pour les arbres généalogiques médicaux
 * Gère toute la logique de calcul des positions et de rendu D3.js
 */
export class GenealogyEngine {
  private config: GenealogyConfig
  private individuals: Map<string, Individual> = new Map()
  private couples: Map<string, Couple> = new Map()

  constructor(config: Partial<GenealogyConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Méthode principale : calcul complet du layout
   */
  calculateTreeLayout(
    individuals: Individual[],
    relationships: { couples: Couple[] } = { couples: [] }
  ): TreeLayout {
    // Mise à jour des maps internes
    this.updateInternalMaps(individuals, relationships.couples)

    // Phase 1: Organisation par générations
    const generations = this.organizeByGenerations()

    // Phase 2: Calcul séquentiel des positions (relatif à l'origine)
    const positionedGenerations = this.calculateSequentialLayout(generations)

    // Phase 3: Calcul des limites avant centrage
    const preliminaryBounds = this.calculateCanvasBounds(positionedGenerations)
    
    // Phase 4: Centrage de l'arbre
    const centeredGenerations = this.centerTree(positionedGenerations, preliminaryBounds)

    // Phase 5: Calcul des connexions familiales après centrage
    const connections = this.calculateFamilyConnections(centeredGenerations)

    // Phase 6: Recalcul des limites finales
    const finalBounds = this.calculateCanvasBounds(centeredGenerations)

    return {
      generations: centeredGenerations,
      connections,
      canvasSize: {
        width: finalBounds.maxX - finalBounds.minX + this.config.canvas.padding * 2,
        height: finalBounds.maxY - finalBounds.minY + this.config.canvas.padding * 2
      },
      bounds: finalBounds
    }
  }

  /**
   * Phase 1: Organisation par générations
   */
  private organizeByGenerations(): Generation[] {
    const generationMap = new Map<number, Individual[]>()
    const couplesByGeneration = new Map<number, Couple[]>()

    // Calcul du niveau générationnel pour chaque individu
    for (const individual of this.individuals.values()) {
      const generation = this.calculateGenerationLevel(individual)
      individual.layout.generation = generation

      if (!generationMap.has(generation)) {
        generationMap.set(generation, [])
        couplesByGeneration.set(generation, [])
      }
      generationMap.get(generation)!.push(individual)
    }

    // Ajout des couples à leurs générations
    for (const couple of this.couples.values()) {
      const individual1 = this.individuals.get(couple.individual1Id)
      if (individual1) {
        const generation = individual1.layout.generation
        couple.layout.generation = generation
        couplesByGeneration.get(generation)?.push(couple)
      }
    }

    // Création des objets Generation
    const generations: Generation[] = []
    const sortedLevels = Array.from(generationMap.keys()).sort((a, b) => a - b)

    for (const level of sortedLevels) {
      generations.push({
        level,
        individuals: generationMap.get(level) || [],
        couples: couplesByGeneration.get(level) || [],
        layout: {
          yPosition: 0, // Sera calculé dans la phase 2
          totalWidth: 0,
          spacing: {
            betweenIndividuals: this.config.symbols.spacing,
            betweenCouples: this.config.generations.horizontalSpacing
          }
        }
      })
    }

    return generations
  }

  /**
   * Calcul du niveau générationnel d'un individu
   */
  private calculateGenerationLevel(individual: Individual): number {
    // Si l'individu n'a pas de parents, il est à la génération 0
    if (individual.relationships.parentIds.length === 0) {
      return 0
    }

    // Sinon, génération = max(génération des parents) + 1
    let maxParentGeneration = -1
    for (const parentId of individual.relationships.parentIds) {
      const parent = this.individuals.get(parentId)
      if (parent) {
        const parentGeneration = this.calculateGenerationLevel(parent)
        maxParentGeneration = Math.max(maxParentGeneration, parentGeneration)
      }
    }

    return maxParentGeneration + 1
  }

  /**
   * Phase 2: Calcul séquentiel des positions
   */
  private calculateSequentialLayout(generations: Generation[]): Generation[] {
    let currentY = 0 // Commencer à 0 au lieu du padding

    for (const generation of generations) {
      // Position Y fixe pour toute la génération
      generation.layout.yPosition = currentY

      // Calcul des positions X pour individus et couples
      this.positionIndividualsInGeneration(generation)

      // Calcul largeur totale de la génération
      generation.layout.totalWidth = this.calculateGenerationWidth(generation)

      // Préparation de la génération suivante
      currentY += this.config.generations.verticalSpacing
    }

    return generations
  }

  /**
   * Positionnement des individus dans une génération
   */
  private positionIndividualsInGeneration(generation: Generation): void {
    let currentX = 0 // Commencer à 0 au lieu du padding

    // Traitement des couples d'abord
    for (const couple of generation.couples) {
      const individual1 = this.individuals.get(couple.individual1Id)
      const individual2 = this.individuals.get(couple.individual2Id)

      if (individual1 && individual2) {
        // Position du premier individu
        individual1.layout.position = {
          x: currentX,
          y: generation.layout.yPosition
        }

        // Position du second individu (avec ligne de mariage)
        individual2.layout.position = {
          x: currentX + this.config.connections.marriageLineLength,
          y: generation.layout.yPosition
        }

        // Configuration du couple
        couple.layout.centerPosition = {
          x: currentX + this.config.connections.marriageLineLength / 2,
          y: generation.layout.yPosition
        }

        couple.layout.connectionLine = {
          start: {
            x: individual1.layout.position.x + this.config.symbols.size / 2,
            y: individual1.layout.position.y
          },
          end: {
            x: individual2.layout.position.x - this.config.symbols.size / 2,
            y: individual2.layout.position.y
          }
        }

        // Calcul du point de descente pour les enfants si applicable
        if (couple.childrenIds.length > 0) {
          couple.layout.childrenConnection = {
            dropPoint: {
              x: couple.layout.centerPosition.x,
              y: generation.layout.yPosition + this.config.connections.childConnectionOffset
            },
            bridgeWidth: couple.childrenIds.length > 1 ? 
              (couple.childrenIds.length - 1) * this.config.symbols.spacing : 0
          }
        }

        currentX += this.config.connections.marriageLineLength + 
                   this.config.symbols.spacing + 
                   this.config.generations.horizontalSpacing
      }
    }

    // Traitement des individus seuls (sans conjoint dans cette génération)
    const coupledIndividualIds = new Set<string>()
    generation.couples.forEach(couple => {
      coupledIndividualIds.add(couple.individual1Id)
      coupledIndividualIds.add(couple.individual2Id)
    })

    for (const individual of generation.individuals) {
      if (!coupledIndividualIds.has(individual.id)) {
        individual.layout.position = {
          x: currentX,
          y: generation.layout.yPosition
        }
        currentX += this.config.symbols.size + this.config.symbols.spacing
      }
    }
  }

  /**
   * Calcul de la largeur totale d'une génération
   */
  private calculateGenerationWidth(generation: Generation): number {
    let maxX = 0
    for (const individual of generation.individuals) {
      maxX = Math.max(maxX, individual.layout.position.x + this.config.symbols.size)
    }
    return maxX
  }

  /**
   * Phase 3: Calcul des connexions familiales
   */
  private calculateFamilyConnections(generations: Generation[]): FamilyConnection[] {
    const connections: FamilyConnection[] = []

    // Connexions de mariage
    for (const generation of generations) {
      for (const couple of generation.couples) {
        connections.push({
          id: `marriage-${couple.id}`,
          type: 'marriage',
          fromId: couple.individual1Id,
          toId: couple.individual2Id,
          path: {
            points: [couple.layout.connectionLine.start, couple.layout.connectionLine.end],
            style: {
              stroke: '#000000',
              strokeWidth: this.config.connections.strokeWidth
            }
          }
        })
      }
    }

    // Connexions parent-enfant
    for (const generation of generations) {
      for (const couple of generation.couples) {
        if (couple.childrenIds.length > 0) {
          connections.push(...this.createParentChildConnections(couple, generations))
        }
      }
    }

    return connections
  }

  /**
   * Création des connexions parent-enfant
   */
  private createParentChildConnections(couple: Couple, _generations: Generation[]): FamilyConnection[] {
    const connections: FamilyConnection[] = []
    const children = couple.childrenIds.map(id => this.individuals.get(id)).filter(Boolean) as Individual[]

    if (children.length === 0) return connections

    const parentDropPoint = couple.layout.childrenConnection?.dropPoint
    if (!parentDropPoint) return connections

    if (children.length === 1) {
      // Connexion directe pour enfant unique
      const child = children[0]
      connections.push({
        id: `parent-child-${couple.id}-${child.id}`,
        type: 'parent_child',
        fromId: couple.id,
        toId: child.id,
        path: {
          points: [
            parentDropPoint,
            { x: child.layout.position.x + this.config.symbols.size / 2, y: child.layout.position.y }
          ],
          style: {
            stroke: '#000000',
            strokeWidth: this.config.connections.strokeWidth
          }
        }
      })
    } else {
      // Barre de fratrie pour plusieurs enfants
      const sortedChildren = children.sort((a, b) => a.layout.position.x - b.layout.position.x)
      const firstChild = sortedChildren[0]
      const lastChild = sortedChildren[sortedChildren.length - 1]
      
      const bridgeY = parentDropPoint.y + this.config.connections.childConnectionOffset
      const bridgeStart = { x: firstChild.layout.position.x + this.config.symbols.size / 2, y: bridgeY }
      const bridgeEnd = { x: lastChild.layout.position.x + this.config.symbols.size / 2, y: bridgeY }

      // Ligne verticale depuis parents vers barre fratrie
      connections.push({
        id: `parent-bridge-${couple.id}`,
        type: 'parent_child',
        fromId: couple.id,
        toId: couple.childrenIds,
        path: {
          points: [parentDropPoint, { x: parentDropPoint.x, y: bridgeY }],
          style: {
            stroke: '#000000',
            strokeWidth: this.config.connections.strokeWidth
          }
        }
      })

      // Barre horizontale de fratrie
      connections.push({
        id: `sibling-bridge-${couple.id}`,
        type: 'sibling_bridge',
        fromId: couple.id,
        toId: couple.childrenIds,
        path: {
          points: [bridgeStart, bridgeEnd],
          style: {
            stroke: '#000000',
            strokeWidth: this.config.connections.strokeWidth
          }
        }
      })

      // Connexions verticales vers chaque enfant
      for (const child of children) {
        connections.push({
          id: `bridge-child-${couple.id}-${child.id}`,
          type: 'parent_child',
          fromId: couple.id,
          toId: child.id,
          path: {
            points: [
              { x: child.layout.position.x + this.config.symbols.size / 2, y: bridgeY },
              { x: child.layout.position.x + this.config.symbols.size / 2, y: child.layout.position.y }
            ],
            style: {
              stroke: '#000000',
              strokeWidth: this.config.connections.strokeWidth
            }
          }
        })
      }
    }

    return connections
  }

  /**
   * Calcul des limites du canvas
   */
  private calculateCanvasBounds(generations: Generation[]): {
    minX: number; maxX: number; minY: number; maxY: number
  } {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity

    for (const generation of generations) {
      for (const individual of generation.individuals) {
        const pos = individual.layout.position
        minX = Math.min(minX, pos.x)
        maxX = Math.max(maxX, pos.x + this.config.symbols.size)
        minY = Math.min(minY, pos.y)
        maxY = Math.max(maxY, pos.y + this.config.symbols.size)
      }
    }

    return { minX, maxX, minY, maxY }
  }

  /**
   * Mise à jour des maps internes
   */
  private updateInternalMaps(individuals: Individual[], couples: Couple[]): void {
    this.individuals.clear()
    this.couples.clear()

    individuals.forEach(individual => {
      this.individuals.set(individual.id, individual)
    })

    couples.forEach(couple => {
      this.couples.set(couple.id, couple)
    })
  }

  /**
   * Validation de la cohérence génétique
   */
  validateGeneticConsistency(individuals: Individual[]): ValidationResult {
    const errors: string[] = []
    const warnings: string[] = []

    for (const individual of individuals) {
      // Validation des parents (maximum 2)
      if (individual.relationships.parentIds.length > 2) {
        errors.push(`Individu ${individual.firstName} a plus de 2 parents`)
      }

      // Validation du genre pour les symboles
      if (individual.gender === 'unknown') {
        warnings.push(`Genre non spécifié pour ${individual.firstName}`)
      }

      // Validation du statut médical
      if (individual.medicalStatus.healthStatus === 'unknown') {
        warnings.push(`Statut médical non spécifié pour ${individual.firstName}`)
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    }
  }

  /**
   * Génération du symbole génétique selon les standards médicaux
   */
  generateGeneticSymbol(individual: Individual): GeneticSymbol {
    return {
      shape: individual.gender === 'male' ? 'square' : 'circle',
      fill: individual.medicalStatus.healthStatus === 'affected' ? 'filled' : 'empty',
      status: individual.medicalStatus.lifeStatus
    }
  }

  /**
   * Centrage de l'arbre dans le canvas
   */
  private centerTree(generations: Generation[], bounds: {
    minX: number; maxX: number; minY: number; maxY: number
  }): Generation[] {
    // Dimensions de l'arbre
    const treeWidth = bounds.maxX - bounds.minX
    const treeHeight = bounds.maxY - bounds.minY
    
    // Dimensions souhaitées du canvas avec padding
    const canvasWidth = treeWidth + this.config.canvas.padding * 2
    const canvasHeight = treeHeight + this.config.canvas.padding * 2
    
    // Calcul des offsets pour centrer parfaitement
    const offsetX = (canvasWidth - treeWidth) / 2 - bounds.minX
    const offsetY = (canvasHeight - treeHeight) / 2 - bounds.minY

    // Application de l'offset à tous les éléments
    for (const generation of generations) {
      // Mise à jour position Y de la génération
      generation.layout.yPosition += offsetY
      
      // Mise à jour positions des individus
      for (const individual of generation.individuals) {
        individual.layout.position.x += offsetX
        individual.layout.position.y += offsetY
      }
      
      // Mise à jour positions des couples
      for (const couple of generation.couples) {
        if (couple.layout.centerPosition) {
          couple.layout.centerPosition.x += offsetX
          couple.layout.centerPosition.y += offsetY
        }
        
        if (couple.layout.connectionLine) {
          couple.layout.connectionLine.start.x += offsetX
          couple.layout.connectionLine.start.y += offsetY
          couple.layout.connectionLine.end.x += offsetX
          couple.layout.connectionLine.end.y += offsetY
        }
        
        if (couple.layout.childrenConnection?.dropPoint) {
          couple.layout.childrenConnection.dropPoint.x += offsetX
          couple.layout.childrenConnection.dropPoint.y += offsetY
        }
      }
    }

    return generations
  }
} 