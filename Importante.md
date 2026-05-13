"""
EJERCICIO 1 — Buscar y Reemplazar en una Lista
###############################################

Definí una función llamada `buscar_reemplazar(lista, palabra, reemplazo)` que
reciba:

- `lista`: una lista de strings (frases).
- `palabra`: la palabra a buscar dentro de cada string.
- `reemplazo`: la palabra que la sustituye.

La función debe devolver una **nueva lista** donde, en cada string, todas las
ocurrencias de `palabra` estén reemplazadas por `reemplazo`. La lista original
no se modifica.

Ejemplos:

    frases1 = ["El gato es bonito", "Mi gato juega", "No hay gato aquí"]
    resultado1 = buscar_reemplazar(frases1, "gato", "perro")
    print(resultado1)
    # ["El perro es bonito", "Mi perro juega", "No hay perro aquí"]

    frases2 = ["Hola mundo", "mundo cruel"]
    resultado2 = buscar_reemplazar(frases2, "mundo", "Python")
    print(resultado2)
    # ["Hola Python", "Python cruel"]

Ayuda: el método `str.replace(viejo, nuevo)` devuelve una copia del string
con los reemplazos hechos.

"""
