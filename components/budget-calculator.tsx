"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { fetchMenuItems } from "@/lib/api-client"
import { Calculator, DollarSign, Utensils } from "lucide-react"

interface MenuItem {
  id: number
  name: string
  description?: string
  price: number
  category?: string
}

interface BudgetCalculatorProps {
  restaurantId: string
  restaurantName: string
}

export function BudgetCalculator({ restaurantId, restaurantName }: BudgetCalculatorProps) {
  const [budget, setBudget] = useState("")
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [affordableItems, setAffordableItems] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(false)
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    loadMenuItems()
  }, [restaurantId])

  const loadMenuItems = async () => {
    try {
      const items = await fetchMenuItems(parseInt(restaurantId))
      setMenuItems(items)
    } catch (error) {
      console.error("Error loading menu items:", error)
    }
  }

  const calculateAffordableItems = () => {
    const budgetAmount = parseFloat(budget)
    if (isNaN(budgetAmount) || budgetAmount <= 0) return

    setLoading(true)

    // Sort items by price ascending
    const sortedItems = [...menuItems].sort((a, b) => a.price - b.price)
    const affordable: MenuItem[] = []
    let currentTotal = 0

    for (const item of sortedItems) {
      if (currentTotal + item.price <= budgetAmount) {
        affordable.push(item)
        currentTotal += item.price
      } else {
        break
      }
    }

    setAffordableItems(affordable)
    setTotalCost(currentTotal)
    setLoading(false)
  }

  const clearCalculation = () => {
    setAffordableItems([])
    setTotalCost(0)
    setBudget("")
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          Calculadora de Presupuesto - {restaurantName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Budget Input */}
        <div className="space-y-2">
          <Label htmlFor="budget" className="text-gray-700 font-medium">
            Tu presupuesto para comer (COP)
          </Label>
          <div className="flex gap-2">
            <Input
              id="budget"
              type="number"
              placeholder="50000"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="flex-1"
              min="0"
            />
            <Button
              onClick={calculateAffordableItems}
              disabled={!budget || loading}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {loading ? "Calculando..." : "Calcular"}
            </Button>
            <Button
              onClick={clearCalculation}
              variant="outline"
              disabled={loading}
            >
              Limpiar
            </Button>
          </div>
        </div>

        {/* Results */}
        {affordableItems.length > 0 && (
          <div className="space-y-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-green-800">¡Puedes pedir {affordableItems.length} plato(s)!</h3>
                  <p className="text-sm text-green-600">
                    Total estimado: ${totalCost.toLocaleString()} COP
                  </p>
                  <p className="text-sm text-green-600">
                    Presupuesto restante: ${(parseFloat(budget) - totalCost).toLocaleString()} COP
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-medium text-gray-900">Platos recomendados:</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {affordableItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Utensils className="w-4 h-4 text-gray-500" />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        {item.description && (
                          <p className="text-sm text-gray-600">{item.description}</p>
                        )}
                        {item.category && (
                          <p className="text-xs text-gray-500">{item.category}</p>
                        )}
                      </div>
                    </div>
                    <span className="font-semibold text-pink-600">
                      ${item.price.toLocaleString()} COP
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {budget && affordableItems.length === 0 && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800">
              Con ${parseFloat(budget).toLocaleString()} COP no puedes pedir ningún plato individual.
              Considera aumentar tu presupuesto o buscar otro restaurante.
            </p>
          </div>
        )}

        {menuItems.length === 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800">
              Este restaurante aún no tiene menú configurado. Contacta al restaurante para más información.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}