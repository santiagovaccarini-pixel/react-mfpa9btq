# Parcial 01

## 📬 Entrega

El parcial debe entregarse por mail a
[juan.pablo.sosa@istea.com.ar](mailto:juan.pablo.sosa@istea.com.ar) con el
asunto:

> **CDProgr1 | Parcial 01 | MIERCOLES | Apellido, Nombre**

📅 **Fecha límite:** miércoles 13 de mayo de 2026, 21:00 hs.

A medida que vaya corrigiendo cargo las notas en la intranet. Si querés una
devolución personalizada, pedímela.

> ⚠️ **Importante:** deben estar presentes para rendir el examen y avisarme
> cuando me envían el mail. Si no avisan que enviaron, no se tiene en cuenta.
> No corten la conexión hasta que confirme que el mail llegó.

Para consultas durante el examen abro un Meet aparte (link en el chat) para no
interrumpir a quienes están resolviendo.

---

## ✅ Recomendaciones

(Ver también el archivo [`Importante.md`](Importante.md))

- Leé **muy bien** el enunciado de cada ejercicio antes de empezar.
- Hacé un pseudocódigo o un diagrama de flujo para pensar la solución antes de
  escribir código.
- Pensá el **algoritmo** antes de tirar líneas.
- Dividí en **funciones pequeñas**, cada una con una sola responsabilidad, y
  llamálas desde el archivo principal.
- Resolvé primero que **funcione**; después refactorizá para que quede
  prolijo.
- En esa refactorización, evaluá si hace falta **validar la entrada del
  usuario**.
- La parte teórica (si la hubiera) podés escribirla como comentario o hacer
  que se imprima en pantalla al ejecutar el script.

---

## 📝 Ejercicios

### Ejercicio 1 — Buscar y Reemplazar en una Lista
Definí `buscar_reemplazar(lista, palabra, reemplazo)` que reciba una lista de
strings y devuelva una **nueva lista** donde todas las ocurrencias de `palabra`
estén reemplazadas por `reemplazo`.

### Ejercicio 2 — Validar Email
Definí `validar_email(email)` que retorne `True` si el email cumple **todas**
las reglas de formato indicadas en el archivo, o `False` en caso contrario.

### Ejercicio 3 — Promedio de Valores Numéricos
Definí `calcular_promedio_numerico(lista)` que calcule el promedio de los
elementos numéricos de una lista, **ignorando** los que no lo sean. Si no hay
números, devolver `0`.

### Ejercicio 4 — Juego de Adivinanza de Palabras
Definí `jugar_adivinanza(palabra_secreta)` que implemente un juego tipo
ahorcado **sin dibujo**: el usuario ingresa letras de a una, se muestra el
progreso con guiones bajos y el juego termina al adivinar la palabra o tras
**5 errores** acumulados.

### Ejercicio 5 — Análisis de una Lista de Números
Dada una lista de enteros, mostrar la lista original, su valor **máximo** y
**mínimo**, la lista **ordenada** de menor a mayor y los números **mayores
a 5**. **Sin usar** `sorted()`, `max()` ni `min()`: hay que recorrer la lista
con bucles.

---

## 🎯 Puntaje

| Ejercicio | Puntos |
|:---------:|:------:|
| 1 | 20% |
| 2 | 20% |
| 3 | 20% |
| 4 | 20% |
| 5 | 20% |

**Aprobación con nota 4 = 60% bien hecho del examen.**

---

¡Suerte! 🍀
