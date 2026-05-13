def jugar_adivinanza(palabra_secreta):

    letras_intentadas = []
    errores = 0

    while errores < 5:

        progreso = ""

        for letra in palabra_secreta:
            if letra in letras_intentadas:
                progreso = progreso + letra + " "
            else:
                progreso = progreso + "_ "

        print("Palabra:", progreso)

        if "_" not in progreso:
            print("¡Ganaste! Adivinaste la palabra.")
            return

        intento = input("Ingresá una letra: ")

        if intento in letras_intentadas:
            print("Ya intentaste esa letra.")
        else:
            letras_intentadas.append(intento)

            if intento in palabra_secreta:
                print("¡Bien! Letra encontrada.")
            else:
                errores = errores + 1
                print("Letra incorrecta. Errores:", errores, "/5")

    print("Perdiste. La palabra era:", palabra_secreta)


jugar_adivinanza("python")
