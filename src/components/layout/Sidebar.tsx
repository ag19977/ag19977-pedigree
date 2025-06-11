import { useCallback } from 'react'
import { Footer } from './Footer'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  User,
  TreePine,
  Download,
  Upload,
  RefreshCw,
  Trees,
} from 'lucide-react'
import { Gender } from '@/types/genealogy'
import useGenealogyStore from '@/stores/genealogy-store'

interface AppSidebarProps {
  onExportSVG?: () => void
  onImport?: (file: File) => void
}

export function AppSidebar({ 
  onExportSVG, 
  onImport
}: AppSidebarProps) {
  const { 
    getSelectedIndividual, 
    updateIndividualField,
    updateIndividualMedicalStatus,
    resetToSampleData,
    isLoading,
    error
  } = useGenealogyStore()

  const selectedIndividual = getSelectedIndividual()

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && onImport) {
      onImport(file)
    }
  }

  const handleFieldChange = useCallback((field: string, value: any) => {
    if (!selectedIndividual) return
    updateIndividualField(selectedIndividual.id, field as any, value)
  }, [selectedIndividual, updateIndividualField])

  const handleMedicalFieldChange = useCallback((field: string, value: any) => {
    if (!selectedIndividual) return
    updateIndividualMedicalStatus(selectedIndividual.id, field as any, value)
  }, [selectedIndividual, updateIndividualMedicalStatus])

  return (
    <div className="w-1/5 min-w-[280px] max-w-[320px] h-screen flex flex-col border-r border-border/30 bg-background/50">
      {/* Header */}
      <div className="p-6 border-b border-border/30">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Trees className="h-5 w-5" />
            Arbre Généalogique
            {isLoading && <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Mise à jour...</span>}
          </h2>
          <p className="text-sm text-muted-foreground">
            Consultation génétique médicale
          </p>
          {error && (
            <p className="text-xs text-red-500 bg-red-50 p-2 rounded">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 overflow-y-auto">
        <Accordion 
          type="multiple" 
          defaultValue={["individual"]}
          className="px-4"
        >
          {/* Section Individu */}
          <AccordionItem value="individual" className="border-b border-border/30">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="font-medium">Individu</span>
                {selectedIndividual && (
                  <Badge variant="secondary" className="ml-auto">
                    Sélectionné
                  </Badge>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              {selectedIndividual ? (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      {selectedIndividual.gender === 'male' ? '□' : '○'} 
                      {selectedIndividual.firstName}
                      {selectedIndividual.medicalStatus.isProband && (
                        <Badge variant="destructive" className="text-xs">Cas index</Badge>
                      )}
                    </CardTitle>
                    <CardDescription>
                      Génération {(selectedIndividual.layout.generation || 0) + 1}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Informations de base */}
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Prénom</Label>
                          <Input
                            value={selectedIndividual.firstName || ''}
                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                            placeholder="Prénom"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Nom</Label>
                          <Input
                            value={selectedIndividual.lastName || ''}
                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                            placeholder="Nom de famille"
                            className="h-8"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Âge</Label>
                          <Input
                            type="number"
                            value={selectedIndividual.age || ''}
                            onChange={(e) => handleFieldChange('age', parseInt(e.target.value) || 0)}
                            placeholder="Âge"
                            className="h-8"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs text-muted-foreground">Genre</Label>
                          <Select 
                            value={selectedIndividual.gender}
                            onValueChange={(value: Gender) => handleFieldChange('gender', value)}
                          >
                            <SelectTrigger className="h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Masculin</SelectItem>
                              <SelectItem value="female">Féminin</SelectItem>
                              <SelectItem value="unknown">Inconnu</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    {/* Statuts médicaux */}
                    <div className="space-y-4">
                      <Label className="text-sm font-medium">Statuts médicaux</Label>
                      
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Vivant</Label>
                          <Switch
                            checked={selectedIndividual.medicalStatus.lifeStatus === 'alive'}
                            onCheckedChange={(checked) => handleMedicalFieldChange('lifeStatus', checked ? 'alive' : 'deceased')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Affecté</Label>
                          <Switch
                            checked={selectedIndividual.medicalStatus.healthStatus === 'affected'}
                            onCheckedChange={(checked) => handleMedicalFieldChange('healthStatus', checked ? 'affected' : 'healthy')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label className="text-sm">Cas index</Label>
                          <Switch
                            checked={selectedIndividual.medicalStatus.isProband || false}
                            onCheckedChange={(checked) => handleMedicalFieldChange('isProband', checked)}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center text-sm text-muted-foreground py-10">
                  <p>Sélectionnez un individu sur l'arbre pour voir ses détails.</p>
                </div>
              )}
            </AccordionContent>
          </AccordionItem>

          {/* Section Outils */}
          <AccordionItem value="tools" className="border-b-0">
            <AccordionTrigger className="hover:no-underline py-4">
              <div className="flex items-center gap-2">
                <TreePine className="h-4 w-4" />
                <span className="font-medium">Outils</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-6">
              <div className="space-y-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium">✅ Mise à jour automatique</p>
                  <p className="text-xs text-green-600">Les modifications sont appliquées instantanément</p>
                </div>
                
                <Button variant="outline" className="w-full justify-start gap-2" onClick={onExportSVG}>
                  <Download className="h-4 w-4" />
                  Exporter en SVG
                </Button>
                
                <Button variant="outline" className="w-full justify-start gap-2" onClick={resetToSampleData}>
                  <RefreshCw className="h-4 w-4" />
                  Réinitialiser les données
                </Button>
                
                <div className="relative">
                  <Button variant="outline" className="w-full justify-start gap-2">
                    <Upload className="h-4 w-4" />
                    Importer un fichier
                  </Button>
                  <Input 
                    type="file" 
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    onChange={handleFileImport}
                    accept=".json, .ged"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <Footer />
    </div>
  )
} 