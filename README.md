# Eatyfy - Come rico sin salirte del presupuesto

Una aplicación web moderna para descubrir restaurantes en Colombia que se ajustan a tu presupuesto.

## Características

- 🗺️ **Mapas interactivos**: Visualiza restaurantes reales usando OpenStreetMap y Leaflet
- 📍 **Ciudades de Colombia**: Explora restaurantes en múltiples ciudades colombianas
- 💰 **Filtros de presupuesto**: Encuentra opciones que se ajusten a tu presupuesto
- 👤 **Perfiles de usuario**: Gestiona tu información y preferencias
- 🔔 **Notificaciones**: Recibe alertas sobre promociones y recomendaciones
- 🎁 **Promociones**: Descubre ofertas exclusivas en restaurantes

## Tecnologías utilizadas

- **Framework**: React.js con Next.js 16
- **Lenguaje**: JavaScript (ES6+) / TypeScript
- **Estilos**: Tailwind CSS v4
- **Mapas**: Leaflet + OpenStreetMap
- **Datos de restaurantes**: Overpass API (OpenStreetMap)
- **Enrutamiento**: React Router (App Router de Next.js)

## Estructura del proyecto

\`\`\`
├── app/
│   ├── page.tsx                 # Página de inicio
│   ├── login/                   # Página de inicio de sesión
│   ├── register/                # Página de registro
│   ├── restaurants/             # Lista de restaurantes
│   │   └── [id]/               # Detalle de restaurante
│   ├── profile/                # Perfil de usuario
│   └── not-found.tsx           # Página 404
├── components/
│   ├── navbar.tsx              # Barra de navegación
│   ├── footer.tsx              # Pie de página
│   ├── map-view.tsx            # Componente de mapa
│   ├── restaurant-card.tsx     # Tarjeta de restaurante
│   ├── restaurant-list.tsx     # Lista de restaurantes
│   ├── notifications-panel.tsx # Panel de notificaciones
│   └── promotions-list.tsx     # Lista de promociones
└── lib/
    ├── api-client.ts           # Cliente API
    └── colombian-cities.ts     # Datos de ciudades

\`\`\`

## API y Backend

Actualmente, la aplicación usa datos mock y la Overpass API para obtener restaurantes reales. Está preparada para conectarse a un backend de Spring Boot que exponga una API REST con JSON.

Todos los servicios en `lib/api-client.ts` tienen comentarios `// TODO: connect to Spring Boot backend here` donde se debe implementar la conexión real.

## Configuración de mapas

La aplicación utiliza:
- **OpenStreetMap**: Mapa base (gratuito, sin API key)
- **Leaflet**: Librería de mapas interactivos
- **Overpass API**: Consulta de restaurantes reales en OpenStreetMap

Para mejorar los resultados de restaurantes, ajusta la consulta de Overpass en `lib/api-client.ts`.

## Ciudades disponibles

- Bogotá
- Medellín
- Cali
- Barranquilla
- Cartagena
- Bucaramanga
- Pasto
- Pereira
- Manizales
- Cúcuta
- Santa Marta
- Ibagué
- Villavicencio

## Próximas características

- [ ] Integración completa con backend Spring Boot
- [ ] Geolocalización mejorada para búsqueda cercana
- [ ] Sistema de reseñas y calificaciones
- [ ] Favoritos de usuario
- [ ] Recomendaciones personalizadas con IA
- [ ] Filtros avanzados (tipo de cocina, horarios, etc.)

## Licencia

© 2025 Eatyfy - Todos los derechos reservados
