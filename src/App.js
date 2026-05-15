import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import jugadores from "./jugadores";
import "./style.css";

const ListaJugadores = () => (
  <datalist id="lista-jugadores">
    {jugadores
      .filter((jugador) => jugador !== "")
      .map((jugador, index) => (
        <option key={index} value={jugador} />
      ))}
  </datalist>
);

const InputJugador = ({ value, onChange }) => (
  <input
    className="input-jugador"
    list="lista-jugadores"
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
    placeholder="Escribir o elegir"
  />
);

export default function App() {
  const crearCambiosVacios = () =>
    Array.from({ length: 5 }, () => ({
      sale: "",
      entra: "",
      hora: "",
    }));

  const crearFormacionVacia = () => ({
    titulares: Array.from({ length: 10 }, () => ""),
    convocados: Array.from({ length: 12 }, () => ""),
  });

  const crearRegistroVacio = () => ({
    fecha: new Date().toISOString().slice(0, 10),
    rival: "",
    resultado: "",
    inicioPT: "",
    finalPT: "",
    inicioVarPT: "",
    finalVarPT: "",
    varsPT: [{ inicio: "", final: "" }],
varPTActivo: 0,
    inicioHidratacionPT: "",
    finalHidratacionPT: "",
    inicioST: "",
    finalST: "",
    inicioVarST: "",
    finalVarST: "",
    varsST: [{ inicio: "", final: "" }],
varSTActivo: 0,
    inicioHidratacionST: "",
    finalHidratacionST: "",
    cambios: crearCambiosVacios(),
    formacion: crearFormacionVacia(),
  });

  const obtenerRegistroInicial = () => {
    const registroVacio = crearRegistroVacio();

    try {
      const datosGuardados = localStorage.getItem("registro_actual_partido");

      if (!datosGuardados) return registroVacio;

      const registroRecuperado = JSON.parse(datosGuardados);

      return {
        ...registroVacio,
        ...registroRecuperado,
        cambios:
          registroRecuperado.cambios && registroRecuperado.cambios.length > 0
            ? registroRecuperado.cambios
            : registroVacio.cambios,
            varsPT:
  registroRecuperado.varsPT && registroRecuperado.varsPT.length > 0
    ? registroRecuperado.varsPT
    : registroVacio.varsPT,
varPTActivo: registroRecuperado.varPTActivo || 0,
varsST:
  registroRecuperado.varsST && registroRecuperado.varsST.length > 0
    ? registroRecuperado.varsST
    : registroVacio.varsST,
varSTActivo: registroRecuperado.varSTActivo || 0,
        formacion: {
          titulares:
            registroRecuperado.formacion?.titulares?.length > 0
              ? registroRecuperado.formacion.titulares
              : registroVacio.formacion.titulares,
          convocados:
            registroRecuperado.formacion?.convocados?.length > 0
              ? registroRecuperado.formacion.convocados
              : registroVacio.formacion.convocados,
        },
      };
    } catch (error) {
      return registroVacio;
    }
  };

  const [registro, setRegistro] = useState(obtenerRegistroInicial);
  const [guardados, setGuardados] = useState([]);
  const [mostrarApp, setMostrarApp] = useState(false);
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [pantalla, setPantalla] = useState("principal");
  const [busquedaRegistros, setBusquedaRegistros] = useState("");
  const [ordenRegistros, setOrdenRegistros] = useState("reciente");
  const [mostrarFormacionPartido, setMostrarFormacionPartido] = useState(false);
  const [mensajeGuardado, setMensajeGuardado] = useState("");

  const formacionInicial = registro.formacion || crearFormacionVacia();
  const hayFormacionInicial =
    (formacionInicial.titulares || []).some((j) => String(j || "").trim()) ||
    (formacionInicial.convocados || []).some((j) => String(j || "").trim());

  const [pantallaFormacion, setPantallaFormacion] = useState(
    hayFormacionInicial ? "lista" : "inicio"
  );

  const [fechaFormacion, setFechaFormacion] = useState(
    registro.fecha || new Date().toISOString().slice(0, 10)
  );

  const [formacionTemporal, setFormacionTemporal] = useState(
    registro.formacion || crearFormacionVacia()
  );

  const [mensajeFormacion, setMensajeFormacion] = useState("");

  const posicionScrollPendiente = useRef(null);

  const imagenIntro =
    "https://i.postimg.cc/yx7VpRqZ/Chat-GPT-Image-25-abr-2026-12-20-35.png";

  useEffect(() => {
    const datos = localStorage.getItem("registro_partidos_tiempos");

    if (datos) {
      try {
        setGuardados(JSON.parse(datos));
      } catch (error) {
        console.error("Error leyendo registros guardados", error);
      }
    }

    const timerIntro = setTimeout(() => {
      setMostrarApp(true);
    }, 1800);

    return () => clearTimeout(timerIntro);
  }, []);

  useEffect(() => {
    localStorage.setItem("registro_partidos_tiempos", JSON.stringify(guardados));
    localStorage.setItem("backup_registros_partidos", JSON.stringify(guardados));
  }, [guardados]);

  useEffect(() => {
    localStorage.setItem("registro_actual_partido", JSON.stringify(registro));
  }, [registro]);

  useLayoutEffect(() => {
    if (posicionScrollPendiente.current !== null) {
      window.scrollTo(0, posicionScrollPendiente.current);
      posicionScrollPendiente.current = null;
    }
  });

  const normalizarTexto = (valor) =>
    String(valor ?? "")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const limpiarLista = (lista) =>
    (lista || []).map((j) => String(j || "").trim()).filter(Boolean);

  const jugadoresQueEntraron = (cambios) =>
    limpiarLista((cambios || []).map((cambio) => cambio.entra));

  const calcularNoIngresaron = (formacion, cambios) => {
    const convocados = limpiarLista(formacion?.convocados || []);
    const entraron = jugadoresQueEntraron(cambios).map(normalizarTexto);

    return convocados.filter(
      (jugador) => !entraron.includes(normalizarTexto(jugador))
    );
  };

  const noIngresaronActuales = useMemo(
    () => calcularNoIngresaron(registro.formacion, registro.cambios),
    [registro.formacion, registro.cambios]
  );

  const textoRegistroParaBusqueda = (item) => {
    const cambios = item.cambios || [];
    const titulares = item.formacion?.titulares || [];
    const convocados = item.formacion?.convocados || [];
    const noIngresaron = calcularNoIngresaron(item.formacion, item.cambios);

    return [
      item.fecha,
      item.rival,
      item.resultado,
      item.inicioPT,
      item.finalPT,
      item.tiempoPT,
      item.inicioVarPT,
      item.finalVarPT,
      item.tiempoVarPT,
      item.inicioHidratacionPT,
      item.finalHidratacionPT,
      item.tiempoHidratacionPT,
      item.inicioST,
      item.finalST,
      item.tiempoST,
      item.inicioVarST,
      item.finalVarST,
      item.tiempoVarST,
      item.inicioHidratacionST,
      item.finalHidratacionST,
      item.tiempoHidratacionST,
      ...titulares,
      ...convocados,
      ...noIngresaron,
      ...cambios.flatMap((cambio) => [
        cambio.sale,
        cambio.entra,
        cambio.hora,
      ]),
    ].join(" ");
  };

  const registrosVisibles = useMemo(() => {
    const textoBuscado = normalizarTexto(busquedaRegistros);

    return guardados
      .map((item, index) => ({ item, index }))
      .filter(({ item }) => {
        if (!textoBuscado) return true;

        const textoRegistro = normalizarTexto(textoRegistroParaBusqueda(item));
        return textoRegistro.includes(textoBuscado);
      })
      .sort((a, b) => {
        if (ordenRegistros === "reciente") return a.index - b.index;
        return b.index - a.index;
      });
  }, [guardados, busquedaRegistros, ordenRegistros]);

  const actualizar = (campo, valor) => {
    setRegistro((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const actualizarCambio = (index, campo, valor) => {
    setRegistro((prev) => {
      const cambiosActualizados = [...prev.cambios];
  
      cambiosActualizados[index] = {
        ...cambiosActualizados[index],
        [campo]: valor,
      };
  
      return {
        ...prev,
        cambios: cambiosActualizados,
      };
    });
  };
  
  const agregarVar = (tipo) => {
    setRegistro((prev) => {
      const claveVars = tipo === "PT" ? "varsPT" : "varsST";
      const claveActivo = tipo === "PT" ? "varPTActivo" : "varSTActivo";
  
      const varsActuales = [...prev[claveVars]];
  
      if (varsActuales.length >= 3) return prev;
  
      varsActuales.push({
        inicio: "",
        final: "",
      });
  
      return {
        ...prev,
        [claveVars]: varsActuales,
        [claveActivo]: varsActuales.length - 1,
      };
    });
  };
  
  const cambiarVarActivo = (tipo, index) => {
    setRegistro((prev) => ({
      ...prev,
      [tipo === "PT" ? "varPTActivo" : "varSTActivo"]: index,
    }));
  };
  
  const actualizarVar = (tipo, campo, valor) => {
    setRegistro((prev) => {
      const claveVars = tipo === "PT" ? "varsPT" : "varsST";
      const claveActivo = tipo === "PT" ? "varPTActivo" : "varSTActivo";
  
      const varsActuales = [...prev[claveVars]];
      const activo = prev[claveActivo];
  
      varsActuales[activo] = {
        ...varsActuales[activo],
        [campo]: valor,
      };
  
      return {
        ...prev,
        [claveVars]: varsActuales,
      };
    });
  };
  
  const ponerAhoraVar = (tipo, campo) => {
    actualizarVar(tipo, campo, horaActual());
  };

  const actualizarFormacion = (nuevaFormacion) => {
    setRegistro((prev) => ({
      ...prev,
      fecha: fechaFormacion || prev.fecha,
      formacion: nuevaFormacion,
    }));
  };

  const horaActual = () => {
    const ahora = new Date();
    return ahora.toTimeString().slice(0, 8);
  };

  const quitarFoco = () => {
    if (document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
  };

  const mantenerPosicion = (accion) => {
    posicionScrollPendiente.current = window.scrollY;
    accion();
  };

  const ponerAhora = (campo) => {
    quitarFoco();

    mantenerPosicion(() => {
      actualizar(campo, horaActual());
    });

    setTimeout(quitarFoco, 0);
  };

  const ponerHoraCambio = (index) => {
    quitarFoco();

    mantenerPosicion(() => {
      actualizarCambio(index, "hora", horaActual());
    });

    setTimeout(quitarFoco, 0);
  };

  const ponerHoraEntreTiempo = (index) => {
    quitarFoco();

    if (!registro.inicioST) {
      alert("Primero cargá Inicio ST.");
      return;
    }

    mantenerPosicion(() => {
      actualizarCambio(index, "hora", registro.inicioST);
    });

    setTimeout(quitarFoco, 0);
  };

  const manejarEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.target.blur();
    }
  };

  const segundosDesdeHora = (hora) => {
    if (!hora) return null;

    const partes = hora.split(":").map(Number);
    const horas = partes[0] || 0;
    const minutos = partes[1] || 0;
    const segundos = partes[2] || 0;

    return horas * 3600 + minutos * 60 + segundos;
  };

  const segundosEntre = (inicio, final) => {
    if (!inicio || !final) return "";

    const totalInicio = segundosDesdeHora(inicio);
    let totalFinal = segundosDesdeHora(final);

    if (totalInicio === null || totalFinal === null) return "";

    if (totalFinal < totalInicio) {
      totalFinal += 24 * 3600;
    }

    return totalFinal - totalInicio;
  };

  const formatearDuracion = (totalSegundos) => {
    if (
      totalSegundos === "" ||
      totalSegundos === null ||
      totalSegundos === undefined
    ) {
      return "";
    }

    const horas = Math.floor(totalSegundos / 3600);
    const minutos = Math.floor((totalSegundos % 3600) / 60);
    const segundos = totalSegundos % 60;

    const mm = String(minutos).padStart(2, "0");
    const ss = String(segundos).padStart(2, "0");

    if (horas > 0) {
      const hh = String(horas).padStart(2, "0");
      return `${hh}:${mm}:${ss}`;
    }

    return `${mm}:${ss}`;
  };

  const calcularTiemposRegistro = (item) => ({
    tiempoPT: formatearDuracion(segundosEntre(item.inicioPT, item.finalPT)),
    tiempoVarPT: formatearDuracion(
      segundosEntre(item.inicioVarPT, item.finalVarPT)
    ),
    tiempoHidratacionPT: formatearDuracion(
      segundosEntre(item.inicioHidratacionPT, item.finalHidratacionPT)
    ),
    tiempoST: formatearDuracion(segundosEntre(item.inicioST, item.finalST)),
    tiempoVarST: formatearDuracion(
      segundosEntre(item.inicioVarST, item.finalVarST)
    ),
    tiempoHidratacionST: formatearDuracion(
      segundosEntre(item.inicioHidratacionST, item.finalHidratacionST)
    ),
  });

  const resumen = useMemo(() => {
    return {
      tiempoPT: segundosEntre(registro.inicioPT, registro.finalPT),
      tiempoVarPT: segundosEntre(registro.inicioVarPT, registro.finalVarPT),
      tiempoHidratacionPT: segundosEntre(
        registro.inicioHidratacionPT,
        registro.finalHidratacionPT
      ),
      tiempoST: segundosEntre(registro.inicioST, registro.finalST),
      tiempoVarST: segundosEntre(registro.inicioVarST, registro.finalVarST),
      tiempoHidratacionST: segundosEntre(
        registro.inicioHidratacionST,
        registro.finalHidratacionST
      ),
    };
  }, [registro]);

  const guardarRegistro = () => {
    const nuevoRegistro = {
      ...registro,
      ...calcularTiemposRegistro(registro),
      varsPT: registro.varsPT || [{ inicio: "", final: "" }],
      varsST: registro.varsST || [{ inicio: "", final: "" }],
      noIngresaron: calcularNoIngresaron(registro.formacion, registro.cambios),
      guardadoEn: new Date().toISOString(),
    };
  
    setGuardados((prev) => [nuevoRegistro, ...prev]);
  
    setMensajeGuardado("Registro guardado con éxito");
  
    setTimeout(() => {
      setMensajeGuardado("");
    }, 2500);
  };
  const limpiarCarga = () => {
    const nuevoRegistro = crearRegistroVacio();

    setRegistro(nuevoRegistro);
    setFormacionTemporal(nuevoRegistro.formacion);
    setFechaFormacion(nuevoRegistro.fecha);
    setPantallaFormacion("lista");
    setMostrarFormacionPartido(false);

    localStorage.setItem("registro_actual_partido", JSON.stringify(nuevoRegistro));
  };

  const volverAPantallaFormacion = () => {
    setFormacionTemporal(registro.formacion || crearFormacionVacia());
    setFechaFormacion(registro.fecha || new Date().toISOString().slice(0, 10));
    setPantallaFormacion("inicio");
    setMostrarFormacionPartido(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const borrarHistorial = () => {
    const confirmar = window.confirm(
      "¿Seguro que querés borrar todos los registros? Esta acción no se puede deshacer."
    );

    if (!confirmar) return;

    setGuardados([]);
    localStorage.removeItem("registro_partidos_tiempos");
    setRegistroSeleccionado(null);
  };

  const eliminarRegistro = (indexAEliminar) => {
    const confirmar = window.confirm("¿Querés eliminar este registro?");

    if (!confirmar) return;

    setGuardados((prev) => prev.filter((_, index) => index !== indexAEliminar));
  };

  const actualizarRegistroGuardado = (indexAEditar, registroEditado) => {
    const registroConTiempos = {
      ...registroEditado,
      ...calcularTiemposRegistro(registroEditado),
      noIngresaron: calcularNoIngresaron(
        registroEditado.formacion,
        registroEditado.cambios
      ),
      editadoEn: new Date().toISOString(),
    };

    setGuardados((prev) =>
      prev.map((item, index) =>
        index === indexAEditar ? registroConTiempos : item
      )
    );

    setRegistroSeleccionado({
      item: registroConTiempos,
      index: indexAEditar,
    });
  };

  const importarFormacionSimulada = () => {
    setMensajeFormacion("");

    const formacionSimulada = {
      titulares: [
        "HULK",
        "SCARPA",
        "ALAN FRANCO",
        "CUELLO",
        "BERNARD",
        "MAYCON",
        "LYANCO",
        "ALONSO",
        "NATANAEL",
        "RENAN LODI",
      ],
      convocados: [
        "DUDU",
        "IGOR GOMES",
        "RUBENS",
        "ALEXSANDER",
        "T PEREZ",
        "V HUGO",
        "M ISEPPE",
        "VICTOR",
        "PATRICK",
        "REINIER",
        "RUAN",
        "KAUA PASCINI",
      ],
    };

    setFormacionTemporal(formacionSimulada);
    setPantallaFormacion("revision");
  };

  const abrirCargaManual = () => {
    setMensajeFormacion("");
    setPantallaFormacion("manual");
  };

  const continuarConFormacion = () => {
    actualizarFormacion(formacionTemporal);
    setPantallaFormacion("lista");
  };

  const actualizarTitularTemporal = (index, valor) => {
    setFormacionTemporal((prev) => {
      const nuevosTitulares = [...prev.titulares];
      nuevosTitulares[index] = valor;

      return {
        ...prev,
        titulares: nuevosTitulares,
      };
    });
  };

  const actualizarConvocadoTemporal = (index, valor) => {
    setFormacionTemporal((prev) => {
      const nuevosConvocados = [...prev.convocados];
      nuevosConvocados[index] = valor;

      return {
        ...prev,
        convocados: nuevosConvocados,
      };
    });
  };

  const agregarConvocadoTemporal = () => {
    setFormacionTemporal((prev) => ({
      ...prev,
      convocados: [...prev.convocados, ""],
    }));
  };

  const modificarFormacionActual = () => {
    setFormacionTemporal(registro.formacion || crearFormacionVacia());
    setFechaFormacion(registro.fecha || new Date().toISOString().slice(0, 10));
    setPantallaFormacion("manual");
    setMostrarFormacionPartido(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const CampoHora = ({ label, campo }) => (
    <div className="campo-hora">
      <label>{label}</label>

      <div className="fila-hora">
        <input
          type="time"
          step="1"
          value={registro[campo]}
          onChange={(e) => actualizar(campo, e.target.value)}
        />

        <button
          type="button"
          className="boton-ahora"
          onClick={() => ponerAhora(campo)}
          onMouseDown={(e) => e.preventDefault()}
          onTouchStart={quitarFoco}
        >
          Ahora
        </button>
      </div>
    </div>
  );

  const BloqueEvento = ({ titulo, inicioCampo, finalCampo, duracion }) => (
    <div className="bloque-evento">
      <div className="titulo-evento">
        <h3>{titulo}</h3>
        <span>{duracion || "-"}</span>
      </div>

      <CampoHora label="Inicio" campo={inicioCampo} />
      <CampoHora label="Final" campo={finalCampo} />
    </div>
  );

  const ListaSimple = ({ titulo, lista, vacio = "Sin datos cargados" }) => {
    const datos = limpiarLista(lista);

    return (
      <div className="lista-formacion">
        <h3>{titulo}</h3>

        {datos.length === 0 ? (
          <p>{vacio}</p>
        ) : (
          datos.map((jugador, index) => (
            <div className="item-formacion" key={`${jugador}-${index}`}>
              {index + 1}. {jugador}
            </div>
          ))
        )}
      </div>
    );
  };

  const FormularioFormacion = ({ modo }) => (
    <div className="app">
      <ListaJugadores />

      <div className="contenedor">
        <header className="encabezado">
          <h1>
            {modo === "revision" ? "Formación encontrada" : "Cargar formación"}
          </h1>
          <p>
            Revisá los 10 titulares de campo y la lista interna de convocados.
          </p>
        </header>

        <section className="tarjeta">
          <label>Fecha del partido</label>
          <input
            type="date"
            value={fechaFormacion}
            onChange={(e) => setFechaFormacion(e.target.value)}
          />

          {mensajeFormacion && (
            <div className="aviso-formacion">{mensajeFormacion}</div>
          )}

          {modo === "revision" ? (
            <>
              <ListaSimple
                titulo="10 titulares de campo"
                lista={formacionTemporal.titulares}
              />

              <ListaSimple
                titulo="Convocados no titulares"
                lista={formacionTemporal.convocados}
              />

              <div className="acciones-dobles">
                <button
                  type="button"
                  className="boton-principal"
                  onClick={continuarConFormacion}
                >
                  Continuar
                </button>

                <button
                  type="button"
                  className="boton-secundario"
                  onClick={abrirCargaManual}
                >
                  Cargar manual
                </button>
              </div>
            </>
          ) : (
            <>
              <h2>10 titulares de campo</h2>

              {formacionTemporal.titulares.map((jugador, index) => (
                <div className="campo-formacion" key={`titular-${index}`}>
                  <label>Titular {index + 1}</label>
                  <InputJugador
                    value={jugador}
                    onChange={(valor) => actualizarTitularTemporal(index, valor)}
                  />
                </div>
              ))}

              <h2>Convocados no titulares</h2>

              {formacionTemporal.convocados.map((jugador, index) => (
                <div className="campo-formacion" key={`convocado-${index}`}>
                  <label>Convocado {index + 1}</label>
                  <InputJugador
                    value={jugador}
                    onChange={(valor) =>
                      actualizarConvocadoTemporal(index, valor)
                    }
                  />
                </div>
              ))}

              <button
                type="button"
                className="boton-agregar-jugador"
                onClick={agregarConvocadoTemporal}
              >
                + Agregar jugador
              </button>

              <div className="acciones-dobles">
                <button
                  type="button"
                  className="boton-secundario"
                  onClick={() => setPantallaFormacion("inicio")}
                >
                  ←  Volver
                </button>

                <button
                  type="button"
                  className="boton-principal"
                  onClick={continuarConFormacion}
                >
                  Guardar formación
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );

  const PantallaInicioFormacion = () => (
    <div className="app">
      <ListaJugadores />

      <div className="contenedor">
        <header className="encabezado">
          <h1>Formación del partido</h1>
          <p>Elegí la fecha e importá o cargá los datos manualmente.</p>
        </header>
        <button
  type="button"
  className="boton-registros-inicio"
  onClick={() => setPantallaFormacion("registros")}
>
  Ingresar a Registros
</button>
        <section className="tarjeta">
          <label>Fecha del partido</label>
          <input
            type="date"
            value={fechaFormacion}
            onChange={(e) => setFechaFormacion(e.target.value)}
          />

          {mensajeFormacion && (
            <div className="aviso-formacion">{mensajeFormacion}</div>
          )}

          <button
            type="button"
            className="boton-principal boton-formacion-grande"
            onClick={importarFormacionSimulada}
          >
            Importar formación automática
          </button>

          <button
            type="button"
            className="boton-secundario boton-formacion-grande"
            onClick={abrirCargaManual}
          >
            Cargar manual
          </button>

          <p className="texto-ayuda-formacion">
            Por ahora el botón automático usa datos simulados. Después lo
            conectamos a una API real usando esta fecha.
          </p>

          {hayFormacionInicial && (
            <button
              type="button"
              className="boton-secundario boton-formacion-grande"
              onClick={() => setPantallaFormacion("lista")}
            >
              Volver al partido
            </button>
          )}
        </section>
      </div>
    </div>
  );

  const DatoDetalle = ({ label, valor }) => (
    <div className="dato-detalle">
      <span>{label}</span>
      <strong>{valor || "-"}</strong>
    </div>
  );

  const CampoDetalleEditable = ({ label, type = "text", value, onChange }) => (
    <div className="campo-detalle-editable">
      <label>{label}</label>
      <input
        type={type}
        step={type === "time" ? "1" : undefined}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={manejarEnter}
      />
    </div>
  );

  const DetalleRegistro = ({ item, index }) => {
    const [editando, setEditando] = useState(false);
    const [editado, setEditado] = useState({
      ...item,
      cambios: item.cambios || crearCambiosVacios(),
      formacion: item.formacion || crearFormacionVacia(),
    });

    const tiemposEditados = calcularTiemposRegistro(editado);
    const cambios = editado.cambios || crearCambiosVacios();
    const noIngresaronDetalle = calcularNoIngresaron(
      editado.formacion,
      editado.cambios
    );

    const actualizarEditado = (campo, valor) => {
      setEditado((prev) => ({
        ...prev,
        [campo]: valor,
      }));
    };

    const actualizarCambioEditado = (cambioIndex, campo, valor) => {
      setEditado((prev) => {
        const nuevosCambios = [...(prev.cambios || crearCambiosVacios())];

        nuevosCambios[cambioIndex] = {
          ...nuevosCambios[cambioIndex],
          [campo]: valor,
        };

        return {
          ...prev,
          cambios: nuevosCambios,
        };
      });
    };

    const ponerHoraEntreTiempoEditado = (cambioIndex) => {
      if (!editado.inicioST) {
        alert("Primero cargá Inicio ST.");
        return;
      }

      actualizarCambioEditado(cambioIndex, "hora", editado.inicioST);
    };

    const cancelarEdicion = () => {
      setEditado({
        ...item,
        cambios: item.cambios || crearCambiosVacios(),
        formacion: item.formacion || crearFormacionVacia(),
      });
      setEditando(false);
    };

    const guardarCambiosEdicion = () => {
      actualizarRegistroGuardado(index, editado);
      setEditando(false);
    };

    return (
      <div className="app">
        <ListaJugadores />

        <div className="contenedor">
        {mensajeGuardado && (
  <div className="mensaje-guardado">
    <span>✓</span>
    {mensajeGuardado}
  </div>
)}
          <header className="encabezado">
            <h1>{editando ? "Editar registro" : "Detalle registro"}</h1>
            <p>
              {editado.fecha} · Atlético Mineiro vs{" "}
              {editado.rival || "Sin rival"}
              {editado.resultado ? ` · ${editado.resultado}` : ""}
            </p>
          </header>

          <section className="tarjeta">
            <h2>Datos del partido</h2>

            {editando ? (
              <>
                <CampoDetalleEditable
                  label="Fecha"
                  type="date"
                  value={editado.fecha}
                  onChange={(valor) => actualizarEditado("fecha", valor)}
                />

                <CampoDetalleEditable
                  label="Rival"
                  value={editado.rival}
                  onChange={(valor) => actualizarEditado("rival", valor)}
                />

                <CampoDetalleEditable
                  label="Resultado"
                  value={editado.resultado}
                  onChange={(valor) => actualizarEditado("resultado", valor)}
                />
              </>
            ) : (
              <>
                <DatoDetalle label="Fecha" valor={editado.fecha} />
                <DatoDetalle label="Rival" valor={editado.rival} />
                <DatoDetalle label="Resultado" valor={editado.resultado} />
              </>
            )}
          </section>

          <section className="tarjeta">
            <h2>Formación</h2>
            <ListaSimple
              titulo="10 titulares de campo"
              lista={editado.formacion?.titulares || []}
            />
            <ListaSimple titulo="No ingresaron" lista={noIngresaronDetalle} />
          </section>

          <section className="tarjeta">
            <h2>Primer tiempo</h2>

            {editando ? (
              <>
                <CampoDetalleEditable
                  label="Inicio PT"
                  type="time"
                  value={editado.inicioPT}
                  onChange={(valor) => actualizarEditado("inicioPT", valor)}
                />
                <CampoDetalleEditable
                  label="Final PT"
                  type="time"
                  value={editado.finalPT}
                  onChange={(valor) => actualizarEditado("finalPT", valor)}
                />
                <DatoDetalle
                  label="Tiempo PT"
                  valor={tiemposEditados.tiempoPT}
                />

                <CampoDetalleEditable
                  label="Inicio VAR PT"
                  type="time"
                  value={editado.inicioVarPT}
                  onChange={(valor) => actualizarEditado("inicioVarPT", valor)}
                />
                <CampoDetalleEditable
                  label="Final VAR PT"
                  type="time"
                  value={editado.finalVarPT}
                  onChange={(valor) => actualizarEditado("finalVarPT", valor)}
                />
                <DatoDetalle
                  label="Tiempo VAR PT"
                  valor={tiemposEditados.tiempoVarPT}
                />

                <CampoDetalleEditable
                  label="Inicio Hidratación PT"
                  type="time"
                  value={editado.inicioHidratacionPT}
                  onChange={(valor) =>
                    actualizarEditado("inicioHidratacionPT", valor)
                  }
                />
                <CampoDetalleEditable
                  label="Final Hidratación PT"
                  type="time"
                  value={editado.finalHidratacionPT}
                  onChange={(valor) =>
                    actualizarEditado("finalHidratacionPT", valor)
                  }
                />
                <DatoDetalle
                  label="Tiempo Hidratación PT"
                  valor={tiemposEditados.tiempoHidratacionPT}
                />
              </>
            ) : (
              <>
                <DatoDetalle label="Inicio PT" valor={editado.inicioPT} />
                <DatoDetalle label="Final PT" valor={editado.finalPT} />
                <DatoDetalle label="Tiempo PT" valor={editado.tiempoPT} />

                {(editado.varsPT || [{ inicio: editado.inicioVarPT, final: editado.finalVarPT }])
  .filter((v) => v.inicio || v.final)
  .map((v, i) => (
    <div className="var-detalle" key={`var-pt-${i}`}>
      <div className="var-detalle-header">
        <span>VAR PT {i + 1}</span>

        <span className="var-detalle-tempo">
          {formatearDuracion(segundosEntre(v.inicio, v.final))}
        </span>
      </div>

      <div className="var-detalle-info">
        <span>Inicio: {v.inicio || "--:--"}</span>
        <span>Final: {v.final || "--:--"}</span>
      </div>
    </div>
  ))}

                <DatoDetalle
                  label="Inicio Hidratación PT"
                  valor={editado.inicioHidratacionPT}
                />
                <DatoDetalle
                  label="Final Hidratación PT"
                  valor={editado.finalHidratacionPT}
                />
                <DatoDetalle
                  label="Tiempo Hidratación PT"
                  valor={editado.tiempoHidratacionPT}
                />
              </>
            )}
          </section>

          <section className="tarjeta">
            <h2>Segundo tiempo</h2>

            {editando ? (
              <>
                <CampoDetalleEditable
                  label="Inicio ST"
                  type="time"
                  value={editado.inicioST}
                  onChange={(valor) => actualizarEditado("inicioST", valor)}
                />
                <CampoDetalleEditable
                  label="Final ST"
                  type="time"
                  value={editado.finalST}
                  onChange={(valor) => actualizarEditado("finalST", valor)}
                />
                <DatoDetalle
                  label="Tiempo ST"
                  valor={tiemposEditados.tiempoST}
                />

                <CampoDetalleEditable
                  label="Inicio VAR ST"
                  type="time"
                  value={editado.inicioVarST}
                  onChange={(valor) => actualizarEditado("inicioVarST", valor)}
                />
                <CampoDetalleEditable
                  label="Final VAR ST"
                  type="time"
                  value={editado.finalVarST}
                  onChange={(valor) => actualizarEditado("finalVarST", valor)}
                />
                <DatoDetalle
                  label="Tiempo VAR ST"
                  valor={tiemposEditados.tiempoVarST}
                />

                <CampoDetalleEditable
                  label="Inicio Hidratación ST"
                  type="time"
                  value={editado.inicioHidratacionST}
                  onChange={(valor) =>
                    actualizarEditado("inicioHidratacionST", valor)
                  }
                />
                <CampoDetalleEditable
                  label="Final Hidratación ST"
                  type="time"
                  value={editado.finalHidratacionST}
                  onChange={(valor) =>
                    actualizarEditado("finalHidratacionST", valor)
                  }
                />
                <DatoDetalle
                  label="Tiempo Hidratación ST"
                  valor={tiemposEditados.tiempoHidratacionST}
                />
              </>
            ) : (
              <>
                <DatoDetalle label="Inicio ST" valor={editado.inicioST} />
                <DatoDetalle label="Final ST" valor={editado.finalST} />
                <DatoDetalle label="Tiempo ST" valor={editado.tiempoST} />

                {(editado.varsST || [{ inicio: editado.inicioVarST, final: editado.finalVarST }])
  .filter((v) => v.inicio || v.final)
  .map((v, i) => (
    <div className="var-detalle" key={`var-st-${i}`}>
      <div className="var-detalle-header">
        <span>VAR ST {i + 1}</span>

        <span className="var-detalle-tempo">
          {formatearDuracion(segundosEntre(v.inicio, v.final))}
        </span>
      </div>

      <div className="var-detalle-info">
        <span>Inicio: {v.inicio || "--:--"}</span>
        <span>Final: {v.final || "--:--"}</span>
      </div>
    </div>
  ))}

                <DatoDetalle
                  label="Inicio Hidratación ST"
                  valor={editado.inicioHidratacionST}
                />
                <DatoDetalle
                  label="Final Hidratación ST"
                  valor={editado.finalHidratacionST}
                />
                <DatoDetalle
                  label="Tiempo Hidratación ST"
                  valor={editado.tiempoHidratacionST}
                />
              </>
            )}
          </section>

          <section className="tarjeta">
            <h2>Cambios</h2>

            <div className="tabla-detalle-cambios">
              <div className="fila-detalle-cambio encabezado-detalle-cambios">
                <div>Cambio</div>
                <div>Sale</div>
                <div>Entra</div>
                <div>Hora</div>
              </div>

              {cambios.map((cambio, cambioIndex) => (
                <div className="fila-detalle-cambio" key={cambioIndex}>
                  <div>{cambioIndex + 1}</div>

                  <div>
                    {editando ? (
                      <InputJugador
                        value={cambio.sale}
                        onChange={(valor) =>
                          actualizarCambioEditado(cambioIndex, "sale", valor)
                        }
                      />
                    ) : (
                      cambio.sale || "-"
                    )}
                  </div>

                  <div>
                    {editando ? (
                      <InputJugador
                        value={cambio.entra}
                        onChange={(valor) =>
                          actualizarCambioEditado(cambioIndex, "entra", valor)
                        }
                      />
                    ) : (
                      cambio.entra || "-"
                    )}
                  </div>

                  <div>
                    {editando ? (
                      <div className="celda-hora-detalle-editable">
                        <input
                          className="input-hora-cambio-detalle"
                          type="time"
                          step="1"
                          value={cambio.hora || ""}
                          onChange={(e) =>
                            actualizarCambioEditado(
                              cambioIndex,
                              "hora",
                              e.target.value
                            )
                          }
                        />

                        <button
                          type="button"
                          className="boton-entretiempo-detalle"
                          onClick={() =>
                            ponerHoraEntreTiempoEditado(cambioIndex)
                          }
                        >
                          ET
                        </button>
                      </div>
                    ) : (
                      cambio.hora || "-"
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {editando ? (
            <div className="acciones-dobles">
              <button
                type="button"
                className="boton-secundario"
                onClick={cancelarEdicion}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="boton-principal"
                onClick={guardarCambiosEdicion}
              >
                Guardar cambios
              </button>
            </div>
          ) : (
            <div className="acciones-dobles">
              <button
                type="button"
                className="boton-secundario"
                onClick={() => setRegistroSeleccionado(null)}
              >
                 ← Volver
              </button>

              <button
                type="button"
                className="boton-principal"
                onClick={() => setEditando(true)}
              >
                Editar registro
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!mostrarApp) {
    return (
      <div className="intro-pantalla">
        <div className="intro-con-imagen">
          <img
            className="intro-poster intro-poster-animado"
            src={imagenIntro}
            alt="Atletico Mineiro"
          />
        </div>
      </div>
    );
  }

  if (pantallaFormacion === "inicio") {
    return PantallaInicioFormacion();
  }

  if (pantallaFormacion === "revision") {
    return FormularioFormacion({ modo: "revision" });
  }

  if (pantallaFormacion === "manual") {
    return FormularioFormacion({ modo: "manual" });
  }
  if (pantallaFormacion === "registros") {
    return (
      <div className="app">
        <div className="contenedor">
          <button
            type="button"
            className="boton-volver-formacion"
            onClick={() => setPantallaFormacion("inicio")}
          >
            ← Volver
          </button>
  
          <header className="encabezado">
            <h1>Registros Guardados</h1>
            <p>Buscá y revisá partidos cargados.</p>
          </header>
  
          {guardados.length > 0 && (
  <section className="tarjeta">
    <h2>Buscar registros</h2>

    <div className="buscador-registros">
      <input
        value={busquedaRegistros}
        onChange={(e) => setBusquedaRegistros(e.target.value)}
        onKeyDown={manejarEnter}
        placeholder="Buscar por rival, resultado, fecha, jugador..."
      />

      <select
        value={ordenRegistros}
        onChange={(e) => setOrdenRegistros(e.target.value)}
      >
        <option value="reciente">Más reciente primero</option>
        <option value="antiguo">Más antiguo primero</option>
      </select>
    </div>
  </section>
)}

<section className="tarjeta">
  <div className="historial-titulo">
    <h2>Registros Guardados</h2>

    {guardados.length > 0 && (
      <button type="button" onClick={borrarHistorial}>
        Borrar historial
      </button>
    )}
  </div>

  {guardados.length === 0 ? (
    <div className="sin-resultados">
      No hay registros guardados todavía.
    </div>
  ) : (
    <>
      <p className="contador-registros">
        Mostrando {registrosVisibles.length} de {guardados.length} registros
      </p>

      {registrosVisibles.length === 0 && (
        <div className="sin-resultados">
          No se encontraron registros con esa búsqueda.
        </div>
      )}

      {registrosVisibles.map(({ item, index }) => (
        <div className="registro-guardado" key={index}>
          <strong>
            {item.fecha} · Atlético Mineiro vs {item.rival || "Sin rival"}
            {item.resultado ? ` · ${item.resultado}` : ""}
          </strong>

          <p>
            PT: {item.inicioPT || "-"} a {item.finalPT || "-"} ·{" "}
            {item.tiempoPT || "-"}
          </p>

          <p>
            ST: {item.inicioST || "-"} a {item.finalST || "-"} ·{" "}
            {item.tiempoST || "-"}
          </p>

          <div className="acciones-registro">
            <button
              type="button"
              className="boton-detalle"
              onClick={() => setRegistroSeleccionado({ item, index })}
            >
              Ver detalle
            </button>

            <button
              type="button"
              className="boton-eliminar-registro"
              onClick={() => eliminarRegistro(index)}
            >
              Eliminar
            </button>
          </div>
        </div>
      ))}
    </>
  )}
</section>
        </div>
      </div>
    );
  }
  if (registroSeleccionado !== null) {
    return (
      <DetalleRegistro
        item={registroSeleccionado.item}
        index={registroSeleccionado.index}
      />
    );
  }

  return (
    <div className="app">
      <ListaJugadores />

      <div className="contenedor">
        <div className="barra-superior">
          <button
            type="button"
            className="boton-volver-formacion"
            onClick={volverAPantallaFormacion}
          >
             ← Volver
          </button>
        </div>
        <header className="encabezado">
          <h1>Registro Partido</h1>
          <p>Atlético Mineiro · PT, ST, VAR e hidratación</p>
        </header>

        <section className="tarjeta">
          <label>Fecha</label>
          <input
            type="date"
            value={registro.fecha}
            onChange={(e) => actualizar("fecha", e.target.value)}
          />

          <label>Rival</label>
          <input
            value={registro.rival}
            onChange={(e) => actualizar("rival", e.target.value)}
            onKeyDown={manejarEnter}
            placeholder="Ej: Santos"
          />

          <label>Resultado</label>
          <input
            value={registro.resultado}
            onChange={(e) => actualizar("resultado", e.target.value)}
            onKeyDown={manejarEnter}
            placeholder="Ej: 2-1"
          />
        </section>

        <section className="tarjeta">
          <h2>Primer tiempo</h2>

          <BloqueEvento
            titulo="PT"
            inicioCampo="inicioPT"
            finalCampo="finalPT"
            duracion={formatearDuracion(resumen.tiempoPT)}
          />
<div className="bloque-evento">
  <div className="vars-header">
    {registro.varsPT.map((v, index) => (
      <button
        key={index}
        type="button"
        className={`var-chip ${
          registro.varPTActivo === index ? "activo" : ""
        }`}
        onClick={() => cambiarVarActivo("PT", index)}
      >
        {formatearDuracion(
  segundosEntre(v.inicio, v.final)
) || `VAR ${index + 1}`}
      </button>
    ))}
  </div>
  <div className="campo-hora">
    <label>Inicio</label>
    <div className="fila-hora">
      <input
        type="time"
        step="1"
        value={
          registro.varsPT[registro.varPTActivo]?.inicio || ""
        }
        onChange={(e) =>
          actualizarVar("PT", "inicio", e.target.value)
        }
      />

      <button
        type="button"
        className="boton-ahora"
        onClick={() =>
          actualizarVar("PT", "inicio", horaActual())
        }
      >
        Ahora
      </button>
    </div>
  </div>
  <div className="campo-hora">
    <label>Final</label>

    <div className="fila-hora">
      <input
        type="time"
        step="1"
        value={
          registro.varsPT[registro.varPTActivo]?.final || ""
        }
        onChange={(e) =>
          actualizarVar("PT", "final", e.target.value)
        }
      />

      <button
        type="button"
        className="boton-ahora"
        onClick={() =>
          actualizarVar("PT", "final", horaActual())
        }
      >
        Ahora
      </button>
    </div>
    {registro.varsPT.length < 3 && (
  <button
    type="button"
    className="boton-agregar-var"
    onClick={() => agregarVar("PT")}
  >
    Agregar +
  </button>
)}
  </div>
</div>

          <BloqueEvento
            titulo="Hidratación PT"
            inicioCampo="inicioHidratacionPT"
            finalCampo="finalHidratacionPT"
            duracion={formatearDuracion(resumen.tiempoHidratacionPT)}
          />
        </section>

        <section className="tarjeta">
          <h2>Segundo tiempo</h2>

          <BloqueEvento
            titulo="ST"
            inicioCampo="inicioST"
            finalCampo="finalST"
            duracion={formatearDuracion(resumen.tiempoST)}
          />

<div className="bloque-evento">
  <div className="vars-header">
    {registro.varsST.map((v, index) => (
      <button
        key={index}
        type="button"
        className={`var-chip ${
          registro.varSTActivo === index ? "activo" : ""
        }`}
        onClick={() => cambiarVarActivo("ST", index)}
      >
        {formatearDuracion(segundosEntre(v.inicio, v.final)) ||
          `VAR ${index + 1}`}
      </button>
    ))}
  </div>

  <div className="campo-hora">
    <label>Inicio</label>

    <div className="fila-hora">
      <input
        type="time"
        step="1"
        value={registro.varsST[registro.varSTActivo]?.inicio || ""}
        onChange={(e) => actualizarVar("ST", "inicio", e.target.value)}
      />

      <button
        type="button"
        className="boton-ahora"
        onClick={() => ponerAhoraVar("ST", "inicio")}
      >
        Ahora
      </button>
    </div>
  </div>

  <div className="campo-hora">
    <label>Final</label>

    <div className="fila-hora">
      <input
        type="time"
        step="1"
        value={registro.varsST[registro.varSTActivo]?.final || ""}
        onChange={(e) => actualizarVar("ST", "final", e.target.value)}
      />

      <button
        type="button"
        className="boton-ahora"
        onClick={() => ponerAhoraVar("ST", "final")}
      >
        Ahora
      </button>
    </div>
  </div>

  {registro.varsST.length < 3 && (
    <button
      type="button"
      className="boton-agregar-var"
      onClick={() => agregarVar("ST")}
    >
      Agregar +
    </button>
  )}
</div>

          <BloqueEvento
            titulo="Hidratación ST"
            inicioCampo="inicioHidratacionST"
            finalCampo="finalHidratacionST"
            duracion={formatearDuracion(resumen.tiempoHidratacionST)}
          />
        </section>

        <section className="tarjeta">
          <h2>Cambios</h2>

          <div className="tabla-cambios">
            <div className="fila-cambio encabezado-cambios">
              <div>Sale</div>
              <div>Entra</div>
              <div>Hora</div>
            </div>

            {registro.cambios.map((cambio, index) => (
              <div className="fila-cambio" key={index}>
                <div>
                  <InputJugador
                    value={cambio.sale}
                    onChange={(valor) => actualizarCambio(index, "sale", valor)}
                  />
                </div>

                <div>
                  <InputJugador
                    value={cambio.entra}
                    onChange={(valor) => actualizarCambio(index, "entra", valor)}
                  />
                </div>

                <div className="celda-hora-cambio">
                  <input
                    className="input-hora-cambio"
                    type="time"
                    step="1"
                    value={cambio.hora || ""}
                    onChange={(e) =>
                      actualizarCambio(index, "hora", e.target.value)
                    }
                  />

                  <button
                    type="button"
                    onClick={() => ponerHoraCambio(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={quitarFoco}
                  >
                    Cambio {index + 1}
                  </button>

                  <button
                    type="button"
                    className="boton-entretiempo"
                    onClick={() => ponerHoraEntreTiempo(index)}
                    onMouseDown={(e) => e.preventDefault()}
                    onTouchStart={quitarFoco}
                  >
                    Entre Tiempo
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="tarjeta">
          <div className="historial-titulo">
            <h2>Formación cargada</h2>

            <button
              type="button"
              onClick={() => setMostrarFormacionPartido((prev) => !prev)}
            >
              {mostrarFormacionPartido ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {mostrarFormacionPartido && (
            <>
              <ListaSimple
                titulo="10 titulares de campo"
                lista={registro.formacion?.titulares || []}
              />

              <ListaSimple titulo="No ingresaron" lista={noIngresaronActuales} />

              <button
                type="button"
                className="boton-modificar-formacion"
                onClick={modificarFormacionActual}
              >
                Modificar formación
              </button>
            </>
          )}
        </section>

        <div className="acciones-dobles">
          <button
            type="button"
            className="boton-secundario"
            onClick={limpiarCarga}
          >
            Limpiar
          </button>

          <button
            type="button"
            className="boton-principal"
            onClick={guardarRegistro}
          >
            Guardar
          </button>
        </div>

        <section className="tarjeta">
  <button
    type="button"
    className="boton-ir-registros"
    onClick={() => setPantallaFormacion("registros")}
  >
    Ir a Registros
  </button>
</section>
      </div>
    </div>
  );
}