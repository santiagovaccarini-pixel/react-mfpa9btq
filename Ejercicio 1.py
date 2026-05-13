def reemplazar(lista, palabra, reemplazo):
    resultado = []
    for texto in lista:
        texto_nuevo = texto.replace(palabra, reemplazo)
        resultado.append(texto_nuevo)

return resultado

frases = ["El gato es bonito", "Mi gato juega", "No hay gato aquí"]

print(reemplazar(frases, "gato", "perro"))
