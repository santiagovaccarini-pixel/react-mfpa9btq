# Propuestas de mejora para la app

## 1) Calidad de código y mantenibilidad
- **Dividir `App.js` en componentes y hooks**: hoy concentra lógica de UI, persistencia, filtros, cálculos y exportación en un solo archivo, lo que dificulta testear y evolucionar.
- **Extraer helpers puros** (`normalizarTexto`, `limpiarLista`, cálculos de convocados/no ingresados) a un módulo utilitario para reuso y pruebas unitarias.
- **Corregir detalles de formato e inconsistencias** (indentación irregular en algunos campos de `registro`, duplicación de reglas CSS de `button:active`) para facilitar lectura y evitar deuda técnica.

## 2) Experiencia de usuario (UX)
- **Validación previa al guardado**: obligar campos mínimos (`fecha`, `rival`, `resultado`) y mostrar errores en línea.
- **Feedback uniforme**: ya existe `mensajeGuardado`, pero conviene un sistema de notificaciones consistente para guardar, eliminar, exportar y errores.
- **Mejoras de accesibilidad**: revisar contraste, navegación por teclado y etiquetas ARIA en botones de acción rápida (por ejemplo, “Ahora”).

## 3) Datos y persistencia
- **Versionado de estructura en localStorage**: agregar `schemaVersion` para migrar datos viejos cuando cambie el modelo del registro.
- **Resguardo/exportación real**: además del backup en localStorage, permitir exportar/importar JSON desde archivo para no perder historial al cambiar de dispositivo.
- **Desduplicación de jugadores**: normalizar nombres al guardar para evitar variantes por mayúsculas, acentos o espacios.

## 4) Rendimiento
- **Memoización y segmentación**: separar pantallas grandes en componentes memoizados para reducir renders completos.
- **Carga diferida** de secciones pesadas de historial/listados cuando no se usan.
- **Evitar trabajo repetido en búsquedas** precomputando índices normalizados de texto para los registros guardados.

## 5) Testing y robustez
- **Tests unitarios** para funciones de cálculo de tiempos y no ingresados.
- **Tests de integración** para flujos críticos: crear partido, editar, guardar, recuperar, eliminar y exportar.
- **Manejo explícito de errores** en parseo de localStorage con mensajes para usuario (además del `console.error`).

## 6) Estándares del proyecto
- **Fijar versión de `react-scripts`** en lugar de `latest` para builds reproducibles.
- **Agregar linters/formatters** (ESLint + Prettier) y scripts de validación en CI.
- **Mejorar README** con instalación, scripts, estructura, roadmap y capturas.

## Plan sugerido por etapas
1. **Etapa 1 (rápida)**: lint/prettier + limpieza de CSS + validaciones mínimas.
2. **Etapa 2**: modularización de `App.js` y tests unitarios de utilidades.
3. **Etapa 3**: import/export JSON, schema version y mejoras de accesibilidad.
4. **Etapa 4**: optimizaciones de rendimiento y pruebas E2E.
