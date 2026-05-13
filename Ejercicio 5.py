numeros = [4, 7, 2, 9, 1, 5, 8, 3, 6]

print("Lista original:", numeros)

mayor = numeros[0]
menor = numeros[0]

for numero in numeros:
    if numero > mayor:
        mayor = numero

    if numero < menor:
        menor = numero

print("Número más alto:", mayor)
print("Número más bajo:", menor)


ordenados = numeros[:]

for i in range(len(ordenados)):
    for j in range(len(ordenados) - 1):

        if ordenados[j] > ordenados[j + 1]:

            aux = ordenados[j]
            ordenados[j] = ordenados[j + 1]
            ordenados[j + 1] = aux

print("Lista ordenada:", ordenados)


mayores_5 = []

for numero in numeros:
    if numero > 5:
        mayores_5.append(numero)

print("Números mayores a 5:", mayores_5)
