# Documentación del Proyecto: Aplicación de Educación Financiera

## 1. Entidades Principales
- **Usuarios:** Información sobre los usuarios que interactúan con la aplicación.
- **Módulos:** Contenido educativo que se presenta a los usuarios.
- **Lecciones:** Subdivisiones dentro de los módulos que contienen información específica.
- **Preguntas:** Preguntas que forman parte de los cuestionarios o evaluaciones.
- **Resultados:** Datos relacionados con el rendimiento del usuario en las lecciones y cuestionarios.

## 2. Captura de Datos
- **Registro de Usuario:** Información básica como nombre, correo electrónico y contraseña.
- **Respuestas a Cuestionarios:** Las respuestas proporcionadas por el usuario a las preguntas.
- **Puntajes de Juegos:** Resultados obtenidos en actividades interactivas.
- **Tiempos:** Duración de las sesiones de aprendizaje o tiempo dedicado a completar lecciones.
- **Datos de Progreso:** Información sobre el progreso del usuario en los módulos y lecciones.

## 3. Datos de Lectura
- **Progreso Acumulado:** Información sobre qué módulos y lecciones ha completado el usuario.
- **Contenido de las Lecciones:** Texto, imágenes y otros recursos que se muestran al usuario.
- **Historial de Resultados:** Resultados anteriores de cuestionarios y juegos, que pueden ser utilizados para mostrar tendencias o mejoras.

## 4. Interfaces TypeScript
### Interfaces Definidas:
```typescript
interface Module {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  color: string;
  bgColor: string;
  level: number;
  maxLevel: number;
  progress: number;
  locked: boolean;
  status: 'locked' | 'in-progress' | 'completed';
}

interface User {
  id: string;
  email: string;
  name: string;
  progress: Record<string, number>; // Progreso en módulos
}

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

interface Result {
  userId: string;
  moduleId: string;
  score: number;
  timestamp: Date;
}
```

---
Esta documentación proporciona una visión clara de las entidades y datos que la aplicación maneja, lo que facilitará el diseño de la estructura óptima de colecciones y documentos en Firebase Firestore.
