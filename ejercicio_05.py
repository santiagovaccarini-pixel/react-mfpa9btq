"""
EJERCICIO 4 — Juego de Adivinanza de Palabras
###############################################

Definí una función llamada `jugar_adivinanza(palabra_secreta)` que implemente
un juego tipo ahorcado, **sin dibujo**.

Reglas:

- El usuario ingresa **una sola letra por turno**.
- Llevá un registro de las letras ya intentadas.
- Después de cada intento, mostrá el **progreso de la palabra** con guiones
  bajos para las letras todavía no adivinadas.
- El juego termina cuando:
  - El usuario adivina la palabra completa → mostrar mensaje de victoria.
  - El usuario acumula **5 errores** → mostrar mensaje de derrota y la
    palabra secreta.

Ejemplo de ejecución (palabra secreta = `"python"`):

    Palabra: _ _ _ _ _ _
    Ingresá una letra: p
    ¡Bien! Letra encontrada.
    Palabra: p _ _ _ _ _
    Ingresá una letra: a
    Letra incorrecta. Errores: 1/5
    ...

Opcional (no es obligatorio): si te animás, separá las funciones auxiliares
en un módulo aparte (por ejemplo, `juego.py`) e importalas en este archivo.

"""
