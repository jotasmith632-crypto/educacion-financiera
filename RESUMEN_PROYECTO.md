# Resumen del Proyecto: Aplicación de Educación Financiera

## 🚀 ¿De qué trata la aplicación?
Es una aplicación web progresiva (PWA) diseñada para enseñar educación financiera a niños y adolescentes a través de la gamificación. Los usuarios aprenden conceptos clave sobre el manejo del dinero, el ahorro, y la inversión mediante retos interactivos, simuladores y casos de la vida real. A medida que avanzan, ganan "puntos de sabiduría", desbloquean niveles, personalizan su avatar y aspiran a clasificar a unas "Olimpiadas Financieras".

## ✅ Estado Actual del Proyecto (Lo que se tiene hasta el momento)

El sistema base de la aplicación está completamente funcional, con el Módulo 1 terminado al 100%, un sistema de autenticación sólido y persistencia de datos en la nube.

### 1. Sistema Base y Arquitectura
* **Tecnologías:** React, TypeScript, Tailwind CSS, Framer Motion (animaciones) y Firebase.
* **Autenticación:** Sistema de Login y Registro funcional con Firebase Auth (correo/contraseña y soporte preparado para Google).
* **Persistencia de Datos (Firebase Firestore):** 
    * Los usuarios se guardan en la base de datos al registrarse.
    * El progreso (puntos totales) y la configuración del avatar se sincronizan y guardan automáticamente.
    * Sistema de "logs" (colección resultados) preparado para registrar el rendimiento individual en cada módulo/nivel, ideal para análisis de datos en la tesis.
* **Personalización:** Pantalla interactiva donde el usuario puede crear y guardar su avatar (cara, tono de piel, cabello y accesorios).

### 2. Módulo 1: "Ahorro e Inversión Inteligente" (Completado)
Este es el núcleo actual de la app. Está dividido en un mapa interactivo con 7 niveles progresivos:

* **Nivel 1: Mi Meta Financiera (10 pantallas interactivas):**
    * Enseña la diferencia entre metas a corto y largo plazo.
    * Explica que una meta necesita un monto, un tiempo y un plan de ahorro.
    * Incluye el "Caso Valeria" donde el estudiante toma decisiones por un personaje.
    * Termina con un formulario para que el usuario construya su propia meta real.
* **Nivel 2: Gastos Hormiga:**
    * Simulador interactivo donde el usuario selecciona pequeños gastos diarios (snacks, juegos) y descubre cuánto dinero "invisible" pierde a la semana, mes y año.
* **Nivel 3: Plan de Ahorro:**
    * Enseña la regla experta de presupuesto 50/30/20 (Necesidades, Deseos, Ahorro).
    * Incluye un simulador donde el usuario debe repartir un presupuesto usando barras deslizables.
* **Nivel 4: Ahorro vs. Inversión:**
    * Explica la diferencia entre guardar dinero (seguridad) y ponerlo a trabajar (crecimiento/riesgo).
    * Gráfico animado que compara cómo crece el dinero solo ahorrando vs. invirtiendo con interés compuesto a través de los años.
* **Nivel 5: El Banco y sus Opciones:**
    * Explica qué son las tasas de interés.
    * Comparativa interactiva entre una "Cuenta de Ahorros" libre y un "Depósito a Plazo Fijo".
* **Nivel 6: Mini Bolsa de Valores:**
    * Juego/Simulador de 5 días donde el usuario tiene S/ 100 y debe decidir cuándo comprar y vender acciones basándose en la volatilidad gráfica.
* **Nivel 7: Decisión Final (Examen):**
    * Evaluación final con 3 casos prácticos.
    * Entrega del certificado virtual "Experto en Ahorro" y trofeo final del módulo.

### 🚧 Siguientes Pasos (Futuro Desarrollo)
1. **Dashboard de Padres (ParentsScreen):** Conectar la interfaz visual existente con Firebase para que los padres puedan ver en tiempo real en qué nivel está su hijo, cuántos puntos tiene y qué metas se ha propuesto.
2. **Módulos Siguientes:** Desarrollar el contenido para el Módulo 2 (ej. Emprendimiento) y el Módulo 3 (ej. Consumo Responsable).
3. **Lógica de las Olimpiadas:** Activar la funcionalidad que bloquea/desbloquea la "Olimpiada Financiera" (un evento o examen mayor) solo cuando el usuario alcanza un puntaje específico o termina ciertos módulos.
4. **Sistema de Recompensas/Tienda:** Una funcionalidad futura donde los puntos ganados puedan canjearse por accesorios exclusivos para el avatar o elementos visuales en la app.

## ⚙️ Funcionamiento General (Flujo del Usuario)
1. **Onboarding:** El usuario nuevo ve 3 pantallas animadas que explican el propósito de la app.
2. **Registro/Login:** Crea su cuenta o inicia sesión.
3. **Home (Dashboard):** Ve su progreso general, su avatar, sus puntos y un mapa de los módulos.
4. **Navegación:** Entra al "Módulo 1", ve un mapa con 7 candados/niveles.
5. **Juego/Aprendizaje:** Entra a un nivel, consume la teoría en formato de "píldoras" (pantallas cortas), realiza la actividad interactiva y recibe una retroalimentación.
6. **Recompensa:** Al terminar el nivel caen confetis, recibe puntos y vuelve al mapa para avanzar al siguiente. Todo se guarda automáticamente en la nube.
