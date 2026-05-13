def calcular_promedio_numerico(lista):
    suma = 0
    cantidad = 0

    for elemento in lista:
        if isinstance(elemento, (int, float)) and not isinstance(elemento, bool):
            suma = suma + elemento
            cantidad = cantidad + 1

    if cantidad == 0:
        return 0

    promedio = suma / cantidad
    return promedio


print(calcular_promedio_numerico([10, 20, "hola", 30]))
print(calcular_promedio_numerico([1.5, 2.5, "x", 4]))
print(calcular_promedio_numerico(["a", "b", True, None]))
print(calcular_promedio_numerico([]))
