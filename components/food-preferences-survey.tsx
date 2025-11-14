"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Utensils, CheckCircle, ArrowRight } from "lucide-react"

interface FoodPreferences {
  favoriteCuisines: string[]
  dietaryRestrictions: string[]
  diningFrequency: string
}

interface FoodPreferencesSurveyProps {
  onComplete: (preferences: FoodPreferences) => void
  initialData?: Partial<FoodPreferences>
  showTitle?: boolean
}

const cuisineOptions = [
  { id: "italiana", label: "Italiana", emoji: "🍝" },
  { id: "mexicana", label: "Mexicana", emoji: "🌮" },
  { id: "japonesa", label: "Japonesa", emoji: "🍱" },
  { id: "china", label: "China", emoji: "🥢" },
  { id: "colombiana", label: "Colombiana", emoji: "🍛" },
  { id: "mediterranea", label: "Mediterránea", emoji: "🫒" },
  { id: "americana", label: "Americana", emoji: "🍔" },
  { id: "india", label: "India", emoji: "🍛" },
  { id: "thai", label: "Tailandesa", emoji: "🍜" },
  { id: "francesa", label: "Francesa", emoji: "🥖" },
]

const dietaryOptions = [
  { id: "vegetariano", label: "Vegetariano", description: "Sin carne" },
  { id: "vegano", label: "Vegano", description: "Sin productos animales" },
  { id: "sin-gluten", label: "Sin gluten", description: "Sin trigo o gluten" },
  { id: "sin-lactosa", label: "Sin lactosa", description: "Sin lácteos" },
  { id: "bajo-calorias", label: "Bajo en calorías", description: "Opciones light" },
  { id: "halal", label: "Halal", description: "Según normas islámicas" },
  { id: "kosher", label: "Kosher", description: "Según normas judías" },
]

const frequencyOptions = [
  { id: "diario", label: "Diariamente", description: "Como fuera casi todos los días" },
  { id: "semanal", label: "Varias veces por semana", description: "3-5 veces por semana" },
  { id: "ocasional", label: "Ocasionalmente", description: "1-2 veces por semana" },
  { id: "mensual", label: "Una vez al mes", description: "Rara vez como fuera" },
]

export function FoodPreferencesSurvey({
  onComplete,
  initialData,
  showTitle = true
}: FoodPreferencesSurveyProps) {
  const [step, setStep] = useState(1)
  const [preferences, setPreferences] = useState<FoodPreferences>({
    favoriteCuisines: initialData?.favoriteCuisines || [],
    dietaryRestrictions: initialData?.dietaryRestrictions || [],
    diningFrequency: initialData?.diningFrequency || ""
  })

  const handleCuisineChange = (cuisineId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      favoriteCuisines: checked
        ? [...prev.favoriteCuisines, cuisineId]
        : prev.favoriteCuisines.filter(id => id !== cuisineId)
    }))
  }

  const handleDietaryChange = (restrictionId: string, checked: boolean) => {
    setPreferences(prev => ({
      ...prev,
      dietaryRestrictions: checked
        ? [...prev.dietaryRestrictions, restrictionId]
        : prev.dietaryRestrictions.filter(id => id !== restrictionId)
    }))
  }

  const handleFrequencyChange = (frequency: string) => {
    setPreferences(prev => ({
      ...prev,
      diningFrequency: frequency
    }))
  }

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1)
    } else {
      onComplete(preferences)
    }
  }

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return preferences.favoriteCuisines.length > 0
      case 2:
        return true // Dietary restrictions are optional
      case 3:
        return preferences.diningFrequency !== ""
      default:
        return false
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      {showTitle && (
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-center justify-center">
            <Utensils className="w-6 h-6 text-pink-500" />
            Encuesta de Gustos Gastronómicos
          </CardTitle>
          <p className="text-center text-gray-600">
            Cuéntanos sobre tus preferencias para darte mejores recomendaciones
          </p>
        </CardHeader>
      )}

      <CardContent className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2 mb-6">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`w-3 h-3 rounded-full ${
                stepNum <= step ? "bg-pink-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Favorite Cuisines */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">¿Qué tipos de comida te gustan?</h3>
              <p className="text-sm text-gray-600">Selecciona todas las que te interesen</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {cuisineOptions.map((cuisine) => (
                <label
                  key={cuisine.id}
                  className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.favoriteCuisines.includes(cuisine.id)
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={preferences.favoriteCuisines.includes(cuisine.id)}
                    onCheckedChange={(checked) => handleCuisineChange(cuisine.id, checked as boolean)}
                  />
                  <span className="text-sm">
                    {cuisine.emoji} {cuisine.label}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Dietary Restrictions */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">¿Tienes alguna restricción alimentaria?</h3>
              <p className="text-sm text-gray-600">Opcional - nos ayuda a filtrar mejor las opciones</p>
            </div>

            <div className="space-y-3">
              {dietaryOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    preferences.dietaryRestrictions.includes(option.id)
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Checkbox
                    checked={preferences.dietaryRestrictions.includes(option.id)}
                    onCheckedChange={(checked) => handleDietaryChange(option.id, checked as boolean)}
                  />
                  <div>
                    <span className="font-medium text-sm">{option.label}</span>
                    <p className="text-xs text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="text-center text-sm text-gray-500">
              Si no tienes restricciones, puedes continuar sin seleccionar nada
            </div>
          </div>
        )}

        {/* Step 3: Dining Frequency */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-2">¿Con qué frecuencia comes fuera de casa?</h3>
              <p className="text-sm text-gray-600">Esto nos ayuda a entender tus hábitos</p>
            </div>

            <RadioGroup
              value={preferences.diningFrequency}
              onValueChange={handleFrequencyChange}
              className="space-y-3"
            >
              {frequencyOptions.map((option) => (
                <label
                  key={option.id}
                  className={`flex items-center space-x-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                    preferences.diningFrequency === option.id
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <RadioGroupItem value={option.id} />
                  <div>
                    <span className="font-medium">{option.label}</span>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </label>
              ))}
            </RadioGroup>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
          >
            Anterior
          </Button>

          <Button
            onClick={nextStep}
            disabled={!canProceed()}
            className="bg-pink-500 hover:bg-pink-600"
          >
            {step === 3 ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Progress Text */}
        <div className="text-center text-sm text-gray-500">
          Paso {step} de 3
        </div>
      </CardContent>
    </Card>
  )
}