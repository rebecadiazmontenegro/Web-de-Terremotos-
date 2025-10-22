# Web de Terremotos

## 💨 Introducción

Esta web permite visualizar terremotos recientes en un mapa interactivo, mostrando información relevante de cada evento. El proyecto combina manipulación dinámica del DOM, consumo de APIs y la posibilidad de integrar Firebase para almacenamiento y gestión de datos en tiempo real.

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

## 🎯 Objetivos

| Objetivo | Definición | Estado |
|----------|------------|--------|
| Mapa 1 | Mostrar terremotos en Leaflet con popup y marcadores coloreados según magnitud | ✅ |
| Mapa 2 | Filtrar terremotos por magnitud y fechas de inicio/fin | ✅ |
| Favoritos | Guardar terremotos favoritos en Firebase Firestore desde el popup | ⬜ |
| Botones vista | Alternar entre vista de API y favoritos | ⬜ |
| Gestión favoritos | Eliminar favoritos y evitar duplicados | ⬜ |
| Autenticación | Solo usuarios autenticados pueden guardar favoritos | ⬜ |
| Privacidad | Cada usuario ve únicamente sus propios favoritos | ⬜ |
| Carga y visualización | Animación durante la carga y mostrar ambos mapas al iniciar | ⬜ |
