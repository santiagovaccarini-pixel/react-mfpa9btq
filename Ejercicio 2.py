def validar_email(email):
    if email.count("@") != 1:
        return False

    if " " in email:
        return False
    if email[0] == "@" or email[0] == "." or email[-1] == "@" or email[-1] == ".":
        return False
    partes = email.split("@")
    usuario = partes[0]
    dominio_completo = partes[1]

    if usuario == "":
        return False

    if "." not in dominio_completo:
        return False

    partes_dominio = dominio_completo.split(".")

    dominio = partes_dominio[0]
    extension = partes_dominio[-1]

    if dominio == "":
        return False

    if len(extension) < 2:
        return False

    return True
