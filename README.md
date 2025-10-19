# Web de Terremotos

## 💨 Introducción

## 📂 Requisitos para este proyecto

- Manipulación dinámica del DOM
- Manejo de ES6
- Asincronía
- Sin frameworks ni librerias externas en la medida de lo posible
- Gestión del proyecto en Github desde el principio. Uso de ramas.
- Código limpio, buenas prácticas
- Diseño responsive, mobile first, semántica HTML5

**Opcional**
- Otras APIs, Local Storage, Firebase, PWA...
- En general, cualquier extra será bien recibido para que investiguéis por vuestra cuenta, siempre y cuando tenga sentido

## ⏳ Fases del proyecto
### 1. Dibujar en un mapa utilizando Leaflet las coordenadas de posiciones donde hay terremot

**Tareas:**

- Petición HTTP para obtener los terremotos disponibles en la API
- Dibujar los marcadores de cada terremoto en el mapa
- Añadir popup en cada marcador con los siguientes datos:
  - Título
  - Fecha del evento
  - Ubicación
  - Código
  - Magnitud con el tipo de medida
- Personalizar iconos por color para los marcadores según la magnitud del terremoto (colores entre 0-7)
