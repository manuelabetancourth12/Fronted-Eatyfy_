'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

const INFOBIP_BASE_URL = process.env.NEXT_PUBLIC_INFOBIP_BASE_URL
const INFOBIP_API_KEY = process.env.NEXT_PUBLIC_INFOBIP_API_KEY

const hasValidApiKey = INFOBIP_API_KEY && INFOBIP_API_KEY !== 'your_infobip_api_key_here'

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: '¡Hola! Soy el asistente de EatyFy. ¿En qué puedo ayudarte hoy? Puedo recomendarte restaurantes, responder preguntas sobre la app o ayudarte con tu presupuesto.',
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    // Check if API key is configured
    if (!hasValidApiKey) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Lo siento, el chatbot no está configurado aún. Necesito credenciales de Infobip para funcionar. Por favor, configura las variables de entorno.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
      setIsLoading(false)
      return
    }

    try {
      // Using a simple response system until Infobip API is properly configured
      // For now, provide helpful responses about EatyFy
      const userInput = input.toLowerCase()

      let response = ''

      if (userInput.includes('pasto') || userInput.includes('restaurante')) {
        response = '¡Excelente! En Pasto tienes muchas opciones deliciosas. Te recomiendo probar La Cabaña, Sulerna o La Finca Paisa - todos con precios accesibles. ¿Te gustaría que te ayude a buscar restaurantes específicos por tipo de comida o presupuesto?'
      } else if (userInput.includes('presupuesto') || userInput.includes('precio')) {
        response = '¡Claro! EatyFy te ayuda a encontrar restaurantes que se ajusten a tu presupuesto. Puedes filtrar por rangos de precio desde $25.000 hasta $100.000 por persona. ¿Cuál es tu presupuesto aproximado?'
      } else if (userInput.includes('hola') || userInput.includes('buenos')) {
        response = '¡Hola! Soy EatyBot, tu asistente en EatyFy. Estoy aquí para ayudarte a descubrir los mejores restaurantes en Colombia. ¿En qué ciudad estás o qué tipo de comida te gustaría probar?'
      } else if (userInput.includes('mapa') || userInput.includes('ubicacion')) {
        response = '¡Genial! EatyFy tiene mapas interactivos con OpenStreetMap para que encuentres fácilmente los restaurantes. Cada restaurante muestra su ubicación exacta para que no te pierdas.'
      } else {
        response = '¡Estoy aquí para ayudarte! Puedo recomendarte restaurantes por ciudad, ayudarte con presupuestos, explicarte cómo funciona la app, o responder cualquier pregunta sobre EatyFy. ¿Qué te gustaría saber?'
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, assistantMessage])

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
    } catch (error) {
      console.error('Error calling Infobip:', error)
      let errorMessageContent = 'Lo siento, hubo un error al procesar tu mensaje.'

      if (error instanceof Error) {
        console.error('Error details:', error.message)
        if (error.message.includes('401') || error.message.includes('403')) {
          errorMessageContent = 'Error de autenticación con Infobip. Verifica que las credenciales sean correctas.'
        } else if (error.message.includes('429')) {
          errorMessageContent = 'Límite de uso alcanzado. Intenta más tarde.'
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          errorMessageContent = 'Error de conexión. Verifica tu conexión a internet.'
        }
      }

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: errorMessageContent + ' Por favor, intenta de nuevo.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 p-0 bg-orange-500 hover:bg-orange-600 shadow-lg"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 h-96 shadow-xl border-2 flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 flex-shrink-0">
        <CardTitle className="text-sm font-medium">EatyBot</CardTitle>
        <Button
          onClick={() => setIsOpen(false)}
          variant="ghost"
          size="icon"
          className="h-6 w-6"
        >
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 min-h-0">
        <div className="flex-1 overflow-y-auto space-y-2 mb-2 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-orange-100 ml-4'
                  : 'bg-gray-100 mr-4'
              }`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="bg-gray-100 mr-4 p-2 rounded-lg text-sm">
              EatyBot está escribiendo...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <div className="flex space-x-2 flex-shrink-0">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}