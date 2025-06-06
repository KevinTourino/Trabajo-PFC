# Qlickteck - Películas

Qlickteck - Películas es una aplicación web desarrollada para ofrecer a los usuarios una forma sencilla, dinámica e interactiva de gestionar su colección personal de películas.

La plataforma permite agregar títulos, descripciones, enlaces para visualización o adquisición, y completa automáticamente los metadatos mediante integración con la API OMDb. Además, incorpora un asistente virtual especializado en temas relacionados con el cine, basado en el modelo de lenguaje GPT-3.5 (vía OpenRouter/OpenAI), que permite mantener conversaciones naturales y obtener recomendaciones personalizadas.

También se incluyen juegos interactivos temáticos orientados a fomentar el entretenimiento del usuario, así como un sistema de contacto a través de Formspree para enviar comentarios y sugerencias.

## Tecnologías Implementadas

- **HTML, CSS y JavaScript**: Tecnologías base para el desarrollo del front-end.
- **OMDb API**: Proveedor de metadatos cinematográficos.
- **GPT-3.5 vía OpenRouter/OpenAI**: Motor de inteligencia artificial para interacción conversacional.
- **Formspree**: Servicio de recepción de mensajes de contacto.
- **IndexedDB**: Base de datos local para almacenamiento persistente en el navegador.

## Requisitos previos

> Es necesario descomprimir manualmente el archivo JavaScript correspondiente al asistente de inteligencia artificial (`ia.js`), ya que por defecto se encuentra comprimido. El funcionamiento del asistente depende de este paso.

## Público Objetivo

La aplicación está orientada a personas aficionadas al cine que deseen mantener organizada su colección. Gracias a su diseño intuitivo y accesible, no requiere conocimientos técnicos y puede utilizarse directamente desde cualquier navegador moderno.

## Alcance de Implementación

El sistema ha evolucionado desde una implementación inicial basada en una única página con almacenamiento local básico (`localStorage`), hasta una arquitectura más avanzada:

- Migración a **IndexedDB** para una gestión más eficiente de los datos.
- Soporte para múltiples vistas o ventanas.

## Mejoras a Implementadar y Planificadas

### Mejoras a implementadas:

- Sistema de filtrado por género cinematográfico.
- Importación y exportación de base de datos en formato JSON.
- Gestión de múltiples colecciones (por ejemplo, "Favoritas", "Pendientes", "Vistas en 2024").
- Modo oscuro y personalización visual (colores, tipografía, disposición de elementos).
- Interfaz adaptable y accesible, compatible con distintos dispositivos (PC, móviles, tablets).

### Mejoras previstas:

- Sistema de estadísticas personalizadas:
  - Número de películas por género.
  - Promedio de duración.
  - Distribución por años y otros indicadores relevantes.

## Contacto y Sugerencias

El sistema incluye un formulario de contacto basado en **Formspree** que permite enviar comentarios y sugerencias directamente desde la interfaz.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulte el archivo `LICENSE` para obtener más información.
