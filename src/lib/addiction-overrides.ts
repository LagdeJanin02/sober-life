import type { Addiction } from "./addictions";

/** Fichas técnicas únicas para adicciones top — sobreescriben los textos genéricos. */
export const OVERRIDES: Record<string, Partial<Pick<Addiction, "info" | "causes" | "symptoms" | "solutions">>> = {
  alcohol: {
    info: "Trastorno por uso de alcohol: dependencia física y psicológica al etanol, depresor del sistema nervioso central que altera juicio, memoria e hígado.",
    causes: [
      "Normalización cultural del consumo en fiestas y reuniones",
      "Historia familiar de alcoholismo (componente genético)",
      "Auto-medicación de ansiedad social o duelo",
      "Baja tolerancia al malestar emocional",
    ],
    symptoms: [
      "Temblores matutinos y sudoración al no beber",
      "Lagunas mentales (blackouts) tras consumo",
      "Tolerancia: cada vez se necesita más para emborracharse",
      "Mentiras sobre cuánto se bebe realmente",
    ],
    solutions: [
      "Desintoxicación supervisada (riesgo de delirium tremens)",
      "Grupos de 12 pasos (AA) o SMART Recovery",
      "Identificar los detonantes sociales: viernes, estrés laboral",
      "Plan B para reuniones: bebidas sin alcohol preparadas",
    ],
  },
  tabaco: {
    info: "Dependencia a la nicotina. El cigarrillo entrega nicotina al cerebro en 7 segundos, creando uno de los circuitos de recompensa más rápidos que existen.",
    causes: [
      "Inicio en adolescencia por presión de grupo",
      "Asociación cigarrillo-café, cigarrillo-conducción",
      "Manejo de ansiedad y pausas en el trabajo",
      "Imitación de figuras familiares fumadoras",
    ],
    symptoms: [
      "Tos crónica matutina y flemas",
      "Irritabilidad extrema en las primeras 72 horas sin nicotina",
      "Ansiedad oral: ganas de tener algo en la boca",
      "Manchas amarillas en dedos y dientes",
    ],
    solutions: [
      "Terapia de reemplazo (parches, chicles, sprays)",
      "Identificar el 'cigarrillo gatillo' del día y romperlo primero",
      "Ejercicio aeróbico: reduce el craving en 5 minutos",
      "Recompensar con el dinero ahorrado semana a semana",
    ],
  },
  vapeo: {
    info: "Dependencia a cigarrillos electrónicos. Una sola cápsula puede equivaler a 20 cigarrillos en nicotina, con sabores que enmascaran el daño pulmonar (EVALI).",
    causes: [
      "Marketing dirigido a jóvenes con sabores frutales",
      "Falsa percepción de 'es solo vapor inofensivo'",
      "Sustitución del cigarrillo tradicional sin dejar la nicotina",
      "Diseño portátil que permite uso constante todo el día",
    ],
    symptoms: [
      "Vapeo en cama, en el baño, durante reuniones",
      "Tos seca y sensación de quemazón en garganta",
      "Ansiedad si la batería se descarga",
      "Aumento del ritmo cardíaco en reposo",
    ],
    solutions: [
      "Bajar gradualmente la concentración de nicotina (mg/ml)",
      "Reemplazar la gestualidad oral con chicle sin azúcar",
      "Eliminar el dispositivo de los lugares de trabajo y dormitorio",
      "Reportar síntomas pulmonares a un neumólogo",
    ],
  },
  videojuegos: {
    info: "Trastorno por uso de videojuegos (CIE-11). El cerebro recibe dopamina por logros virtuales y desplaza recompensas reales como estudio, sueño y socialización.",
    causes: [
      "Escape de la realidad por bullying, estrés o aburrimiento",
      "Diseño persuasivo: loot boxes, eventos limitados, ranking",
      "Identidad construida dentro del juego (clan, gremio)",
      "Falta de hobbies offline alternativos",
    ],
    symptoms: [
      "Jugar 6+ horas seguidas sin notar el tiempo",
      "Insomnio por sesiones nocturnas",
      "Irritabilidad cuando se interrumpe la partida",
      "Bajón académico o laboral notable",
    ],
    solutions: [
      "Límites duros: temporizador del router o app de control",
      "Reemplazar con deportes físicos de equipo",
      "Reuniones presenciales con la comunidad del juego (mover offline)",
      "Eliminar microtransacciones de la tarjeta",
    ],
  },
  redes: {
    info: "Uso problemático de redes sociales. Cada notificación libera dopamina por anticipación, generando el mismo circuito que las máquinas tragamonedas.",
    causes: [
      "Algoritmos diseñados para maximizar tiempo en pantalla",
      "Comparación constante con vidas filtradas de otros",
      "Necesidad de validación vía likes y comentarios",
      "FOMO: miedo a perderse lo que pasa en el grupo",
    ],
    symptoms: [
      "Revisar el teléfono apenas abrir los ojos",
      "Phantom vibration: sentir notificaciones que no existen",
      "Ansiedad si una publicación tiene pocos likes",
      "Scroll inconsciente durante conversaciones reales",
    ],
    solutions: [
      "Quitar las apps del dock principal, esconderlas en carpetas",
      "Modo escala de grises: reduce la atracción visual",
      "Dejar el teléfono fuera del dormitorio",
      "Sustituir los 5 primeros minutos del día por respiración",
    ],
  },
  pornografia: {
    info: "Uso compulsivo de contenido sexual digital. Sobrestimula el sistema dopaminérgico al ofrecer novedad infinita, generando tolerancia y disfunciones sexuales reales.",
    causes: [
      "Acceso gratuito ilimitado desde la pubertad",
      "Refugio ante soledad o rechazo afectivo",
      "Curiosidad escalada a contenido más extremo",
      "Privacidad total: nadie ve lo que consumes",
    ],
    symptoms: [
      "Disfunción eréctil con pareja real",
      "Pérdida de interés en relaciones afectivas",
      "Vergüenza y aislamiento post-uso",
      "Necesidad de contenido cada vez más fuerte",
    ],
    solutions: [
      "Filtros de contenido + responsable de rendición de cuentas",
      "Reboot: período de abstinencia (NoFap) de 60-90 días",
      "Terapia sexual y reconexión con intimidad real",
      "Identificar los desencadenantes emocionales reales",
    ],
  },
  apuestas: {
    info: "Ludopatía o trastorno de juego patológico. El cerebro responde más a la posibilidad de ganar que a la ganancia misma — el 'casi-ganar' es la trampa principal.",
    causes: [
      "Refuerzo intermitente (la recompensa más adictiva conocida)",
      "Ilusión de control sobre el azar",
      "Necesidad de recuperar pérdidas (efecto chasing)",
      "Disponibilidad 24/7 en apps móviles",
    ],
    symptoms: [
      "Apostar más dinero del planeado",
      "Mentir a la familia sobre pérdidas",
      "Pedir prestado para seguir jugando",
      "Sensación de vacío fuera del juego",
    ],
    solutions: [
      "Autoexclusión voluntaria en plataformas y casinos",
      "Control total del dinero por un tercero de confianza",
      "Grupo de Jugadores Anónimos",
      "Bloqueadores de apps de apuestas en el celular",
    ],
  },
  cafeina: {
    info: "Dependencia a la cafeína. Bloquea los receptores de adenosina y aumenta dopamina y cortisol; al suspender, aparece migraña por vasodilatación rebote.",
    causes: [
      "Cultura del rendimiento y multitarea",
      "Compensar mala calidad de sueño",
      "Ritual social: café con colegas",
      "Disponibilidad masiva de energéticas",
    ],
    symptoms: [
      "Migraña intensa al saltarse el café diario",
      "Taquicardia y temblor fino en manos",
      "Ansiedad y dificultad para dormir",
      "Necesidad de aumentar la dosis cada mes",
    ],
    solutions: [
      "Reducir 25% por semana en lugar de cortar de golpe",
      "Hidratación abundante: muchos síntomas son por sed",
      "Té verde como puente: menos cafeína, más L-teanina",
      "Higiene del sueño: dormir bien elimina la necesidad",
    ],
  },
  compras: {
    info: "Oniomanía o compra compulsiva. El acto de comprar libera dopamina; la culpa post-compra alimenta el ciclo y suele acompañar a depresión.",
    causes: [
      "Regulación emocional vía consumo ('retail therapy')",
      "Publicidad personalizada y 1-click checkout",
      "Identidad vinculada a marcas y estatus",
      "Soledad y necesidad de novedad",
    ],
    symptoms: [
      "Compras con tarjeta sin recordar haberlas hecho",
      "Paquetes sin abrir acumulándose en casa",
      "Deuda creciente y mentiras a la pareja",
      "Euforia breve seguida de culpa intensa",
    ],
    solutions: [
      "Regla de 72 horas antes de comprar lo no esencial",
      "Eliminar tarjetas guardadas en navegadores y apps",
      "Cancelar suscripciones de email promocional",
      "Hobby creativo que produzca, no que consuma",
    ],
  },
  cocaina: {
    info: "Trastorno por uso de cocaína. Estimulante que multiplica la dopamina sináptica al bloquear su recaptación; el bajón posterior empuja a re-dosificar.",
    causes: [
      "Búsqueda de euforia en entornos de fiesta y riesgo",
      "Industria laboral con jornadas extremas (finanzas, hospitality)",
      "Cultura aspiracional asociada a estatus y poder",
      "Co-uso con alcohol que reduce la percepción de daño",
    ],
    symptoms: [
      "Dilatación pupilar marcada y congestión nasal crónica",
      "Insomnio de varios días seguidos con energía artificial",
      "Paranoia, irritabilidad y agresividad post-consumo",
      "Dolor torácico y arritmias cardíacas",
    ],
    solutions: [
      "Internamiento o hospital de día durante el bajón inicial",
      "Cortar contactos del círculo de consumo (números, lugares)",
      "Manejo médico de comorbilidades cardíacas",
      "Terapia de prevención de recaídas con foco en entornos sociales",
    ],
  },
  marihuana: {
    info: "Trastorno por uso de cannabis. El THC modula los receptores CB1 cerebrales; el uso diario en jóvenes está vinculado a déficit de memoria y trastornos psicóticos.",
    causes: [
      "Percepción social de 'droga blanda inofensiva'",
      "Auto-medicación de insomnio y ansiedad",
      "Ritual social: porro al final del día",
      "Acceso legalizado o decomercializado en aumento",
    ],
    symptoms: [
      "Pérdida de memoria a corto plazo y dificultad de concentración",
      "Apatía sostenida y abandono de proyectos (síndrome amotivacional)",
      "Tos crónica y bronquitis recurrente",
      "Crisis de ansiedad o paranoia con cepas altas en THC",
    ],
    solutions: [
      "Eliminar parafernalia (pipas, papel) de la vista",
      "Sustituir el ritual nocturno por té relajante o ejercicio suave",
      "Pedir analítica médica a los 30 días para mostrar mejoría",
      "Terapia cognitivo-conductual breve enfocada en cannabis",
    ],
  },
  heroina: {
    info: "Dependencia a opiáceos ilegales. La heroína atraviesa la barrera hematoencefálica en segundos, generando una de las dependencias físicas más severas conocidas.",
    causes: [
      "Escalada desde analgésicos opioides recetados",
      "Trauma severo no tratado (combate, abuso)",
      "Entornos de marginación y exclusión social",
      "Anestesia química frente al dolor emocional",
    ],
    symptoms: [
      "Calambres musculares intensos y dolor óseo",
      "Náuseas, vómitos y diarrea explosiva al retirar",
      "Sudoración profusa, piloerección (piel de gallina)",
      "Rinorrea, lagrimeo y bostezos compulsivos",
    ],
    solutions: [
      "Tratamiento sustitutivo con metadona o buprenorfina",
      "Naloxona disponible en casa por riesgo de sobredosis",
      "Programa de reducción de daños con jeringas estériles",
      "Vivienda y empleo asistido durante los primeros 6 meses",
    ],
  },
  comida: {
    info: "Trastorno por atracón. Episodios de ingesta rápida y descontrolada de grandes cantidades, sin conducta compensatoria, acompañados de vergüenza intensa.",
    causes: [
      "Restricción dietética extrema que dispara rebote",
      "Regulación emocional mediante azúcar y grasas (comfort food)",
      "Historia de dietas yo-yo desde la infancia",
      "Imagen corporal distorsionada y baja autoestima",
    ],
    symptoms: [
      "Comer hasta sentir malestar físico doloroso",
      "Esconder envoltorios y comer a escondidas",
      "Atracones nocturnos en soledad",
      "Culpa y disforia post-atracón que dura horas",
    ],
    solutions: [
      "Comer 5 veces al día con horarios fijos (no restringir)",
      "Identificar emoción detonante antes de abrir el refrigerador",
      "Terapia con nutricionista no-dietista + psicólogo",
      "Eliminar balanzas y espejos provocadores durante 90 días",
    ],
  },
  trabajo: {
    info: "Workaholism. Adicción al trabajo donde la productividad y el rendimiento se vuelven el único marcador de autovaloración, desplazando salud y vínculos.",
    causes: [
      "Identidad construida sobre logros profesionales",
      "Miedo al vacío y a la introspección",
      "Cultura empresarial que premia el burnout",
      "Validación parental condicionada al éxito",
    ],
    symptoms: [
      "Revisar el correo en vacaciones, comidas y cama",
      "Imposibilidad de desconectar fines de semana",
      "Hipertensión, gastritis y problemas de espalda",
      "Distanciamiento de pareja e hijos sin notarlo",
    ],
    solutions: [
      "Apagado total de notificaciones laborales después de las 7 pm",
      "Agenda obligatoria de ocio no-productivo (sin metas)",
      "Terapia de identidad: '¿quién eres si no trabajas?'",
      "Vacaciones reales mínimo de 10 días seguidos al año",
    ],
  },
  benzodiacepinas: {
    info: "Dependencia a tranquilizantes (clonazepam, alprazolam, diazepam). Potencian el GABA cerebral; al retirarlas el sistema rebota y puede causar convulsiones mortales.",
    causes: [
      "Prescripción prolongada sin reevaluación médica",
      "Auto-medicación para crisis de pánico",
      "Acceso fácil en farmacias de la región",
      "Combinación con alcohol u opiáceos para potenciar efecto",
    ],
    symptoms: [
      "Tolerancia progresiva: la misma dosis ya no calma",
      "Insomnio severo y pesadillas al saltarse una toma",
      "Temblores, sudoración y crisis de pánico de rebote",
      "Riesgo de convulsiones si se corta de golpe",
    ],
    solutions: [
      "Reducción gradual supervisada (10% cada 2 semanas)",
      "Conversión a diazepam de vida media larga para retiro suave",
      "TCC para pánico que reemplace la función química",
      "Nunca suspender abruptamente sin acompañamiento médico",
    ],
  },
};