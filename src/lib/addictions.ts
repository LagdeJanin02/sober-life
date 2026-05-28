export type AddictionCategory =
  | "sustancias"
  | "conductuales"
  | "alimentarias"
  | "digitales"
  | "emocionales";

export interface Addiction {
  id: string;
  name: string;
  emoji: string;
  category: AddictionCategory;
  info: string;
  causes: string[];
  symptoms: string[];
  solutions: string[];
}

const make = (
  id: string,
  name: string,
  emoji: string,
  category: AddictionCategory,
  info: string,
): Addiction => ({
  id,
  name,
  emoji,
  category,
  info,
  causes: [
    "Estrés crónico no gestionado",
    "Factores genéticos y familiares",
    "Búsqueda de recompensa rápida en el cerebro",
    "Entorno social y disponibilidad",
  ],
  symptoms: [
    "Necesidad creciente para sentir el mismo efecto",
    "Pérdida de control sobre el consumo o conducta",
    "Irritabilidad y ansiedad al intentar parar",
    "Impacto negativo en trabajo, familia o salud",
  ],
  solutions: [
    "Identificar y evitar los detonantes diarios",
    "Sustituir el hábito por una actividad saludable",
    "Acompañamiento profesional (psicólogo o psiquiatra)",
    "Apoyo de comunidad y grupos de superación",
    "Registrar el progreso día a día y celebrar logros",
  ],
});

export const ADDICTIONS: Addiction[] = [
  // Sustancias (1-25)
  make("alcohol", "Alcohol", "🍷", "sustancias", "Consumo excesivo de bebidas alcohólicas que altera la salud física y mental."),
  make("tabaco", "Tabaco", "🚬", "sustancias", "Dependencia a la nicotina por consumo de cigarrillos."),
  make("vapeo", "Vapeo", "💨", "sustancias", "Uso compulsivo de cigarrillos electrónicos con nicotina o saborizantes."),
  make("cannabis", "Cannabis / Marihuana", "🌿", "sustancias", "Consumo problemático de THC que afecta motivación y memoria."),
  make("cocaina", "Cocaína", "❄️", "sustancias", "Estimulante altamente adictivo con alto riesgo cardiovascular."),
  make("heroina", "Heroína", "💉", "sustancias", "Opioide con dependencia física y mental severa."),
  make("metanfetamina", "Metanfetamina", "⚡", "sustancias", "Estimulante sintético con daño neurológico acelerado."),
  make("crack", "Crack", "🪨", "sustancias", "Forma fumable de la cocaína, altamente adictiva."),
  make("extasis", "Éxtasis (MDMA)", "💊", "sustancias", "Droga de fiesta con riesgo de daño cerebral."),
  make("lsd", "LSD", "🌀", "sustancias", "Alucinógeno con uso problemático recreativo."),
  make("hongos", "Hongos psilocibios", "🍄", "sustancias", "Alucinógeno natural con dependencia psicológica."),
  make("ketamina", "Ketamina", "🧪", "sustancias", "Anestésico disociativo con uso recreativo creciente."),
  make("benzodiacepinas", "Benzodiacepinas", "💤", "sustancias", "Tranquilizantes recetados con alto poder adictivo."),
  make("opioides_rx", "Opioides recetados", "🩺", "sustancias", "Analgésicos como oxicodona con riesgo de dependencia."),
  make("inhalantes", "Inhalantes", "🧴", "sustancias", "Solventes y aerosoles con daño neuronal grave."),
  make("ghb", "GHB", "🥤", "sustancias", "Depresor del sistema nervioso usado en fiestas."),
  make("popper", "Poppers", "🟡", "sustancias", "Nitritos inhalables con uso recreativo."),
  make("anabolicos", "Esteroides anabólicos", "💪", "sustancias", "Uso no médico para musculatura con efectos hormonales."),
  make("cafeina", "Cafeína", "☕", "sustancias", "Consumo excesivo de café, té o energizantes."),
  make("energizantes", "Bebidas energéticas", "🥫", "sustancias", "Alto consumo de bebidas con cafeína y taurina."),
  make("nicotina_bolsa", "Bolsas de nicotina", "🧂", "sustancias", "Nicotina oral sin tabaco, adicción silenciosa."),
  make("chimo", "Chimó / tabaco mascado", "🟫", "sustancias", "Tabaco sin humo con riesgo bucal."),
  make("kratom", "Kratom", "🍃", "sustancias", "Planta con efectos opioides leves y dependencia."),
  make("salvia", "Salvia divinorum", "🌱", "sustancias", "Alucinógeno potente de uso recreativo."),
  make("crystal", "Crystal", "🔷", "sustancias", "Variante cristalina de la metanfetamina."),

  // Conductuales (26-55)
  make("videojuegos", "Videojuegos", "🎮", "conductuales", "Juego excesivo que desplaza obligaciones y sueño."),
  make("apuestas", "Apuestas / Casinos", "🎰", "conductuales", "Ludopatía con pérdidas económicas y emocionales."),
  make("apuestas_online", "Apuestas deportivas online", "📲", "conductuales", "Apuestas digitales 24/7 con alta accesibilidad."),
  make("cripto_trading", "Trading compulsivo", "📈", "conductuales", "Operar mercados de forma impulsiva buscando dopamina."),
  make("compras", "Compras compulsivas", "🛍️", "conductuales", "Compras impulsivas para regular emociones."),
  make("trabajo", "Trabajo (workaholism)", "💼", "conductuales", "Adicción al trabajo con descuido personal."),
  make("ejercicio", "Ejercicio extremo", "🏋️", "conductuales", "Entrenar de forma compulsiva ignorando lesiones."),
  make("sexo", "Sexo compulsivo", "❤️", "conductuales", "Comportamiento sexual fuera de control."),
  make("pornografia", "Pornografía", "🔞", "conductuales", "Consumo compulsivo de contenido sexual digital."),
  make("masturbacion", "Masturbación compulsiva", "✋", "conductuales", "Práctica que interfiere con la vida diaria."),
  make("relaciones", "Codependencia afectiva", "💞", "conductuales", "Necesidad enfermiza de pareja o aprobación."),
  make("mentira", "Mitomanía", "🗣️", "conductuales", "Mentir compulsivamente sin motivo claro."),
  make("robar", "Cleptomanía", "🕵️", "conductuales", "Impulso irresistible de robar."),
  make("piromania", "Piromanía", "🔥", "conductuales", "Fascinación compulsiva con el fuego."),
  make("tricotilomania", "Tricotilomanía", "💇", "conductuales", "Arrancarse el cabello de forma compulsiva."),
  make("dermatilomania", "Dermatilomanía", "🩹", "conductuales", "Rascarse o pellizcarse la piel sin parar."),
  make("onicofagia", "Comerse las uñas", "💅", "conductuales", "Onicofagia crónica por ansiedad."),
  make("procrastinacion", "Procrastinación", "⏳", "conductuales", "Postergar tareas como adicción a la evasión."),
  make("perfeccionismo", "Perfeccionismo tóxico", "🎯", "conductuales", "Exigencia extrema que paraliza."),
  make("control", "Control obsesivo", "🔒", "conductuales", "Necesidad de controlarlo todo y a todos."),
  make("acumulacion", "Acumulación (Síndrome de Diógenes)", "📦", "conductuales", "Acumular objetos compulsivamente."),
  make("limpieza", "Limpieza compulsiva", "🧽", "conductuales", "Rituales de higiene excesivos."),
  make("conducir", "Conducción temeraria", "🏎️", "conductuales", "Buscar adrenalina al volante."),
  make("riesgo", "Búsqueda de riesgo extremo", "🪂", "conductuales", "Necesidad constante de adrenalina."),
  make("tatuajes", "Tatuajes compulsivos", "🖋️", "conductuales", "Tatuarse impulsivamente para regular ansiedad."),
  make("cirugias", "Cirugías estéticas", "💉", "conductuales", "Operarse repetidamente buscando perfección."),
  make("religiosidad", "Religiosidad obsesiva", "🛐", "conductuales", "Rituales religiosos que generan angustia."),
  make("autoayuda", "Autoayuda compulsiva", "📚", "conductuales", "Saltar de método en método sin aplicar."),
  make("noticias", "Doomscrolling de noticias", "📰", "conductuales", "Leer noticias negativas sin parar."),
  make("citas_apps", "Apps de citas", "💘", "conductuales", "Swipe compulsivo en Tinder/Bumble."),

  // Alimentarias (56-70)
  make("azucar", "Azúcar", "🍬", "alimentarias", "Consumo excesivo de azúcares añadidos."),
  make("comida", "Comida (atracones)", "🍔", "alimentarias", "Episodios recurrentes de ingesta descontrolada."),
  make("chocolate", "Chocolate", "🍫", "alimentarias", "Antojos compulsivos de cacao y azúcar."),
  make("comida_rapida", "Comida rápida", "🍟", "alimentarias", "Dependencia a fast food por dopamina."),
  make("sal", "Sal / snacks salados", "🥨", "alimentarias", "Consumo elevado de snacks ultraprocesados."),
  make("refrescos", "Refrescos azucarados", "🥤", "alimentarias", "Bebidas con alto contenido de azúcar."),
  make("carbohidratos", "Carbohidratos refinados", "🍞", "alimentarias", "Pan, pasta y harinas en exceso."),
  make("lacteos", "Lácteos en exceso", "🥛", "alimentarias", "Consumo excesivo de productos lácteos."),
  make("helado", "Helado", "🍦", "alimentarias", "Consumo nocturno compulsivo de helado."),
  make("postres", "Postres / repostería", "🧁", "alimentarias", "Antojos diarios de dulces."),
  make("anorexia", "Restricción alimentaria", "🥗", "alimentarias", "Conducta restrictiva con peso peligroso."),
  make("bulimia", "Atracón-purga", "🚽", "alimentarias", "Ciclo de atracón seguido de purga."),
  make("ortorexia", "Ortorexia", "🥦", "alimentarias", "Obsesión con comer 'limpio' al extremo."),
  make("cafe_postre", "Combos café-postre", "☕", "alimentarias", "Ritual diario de café con dulce."),
  make("salsas", "Salsas y aderezos", "🍅", "alimentarias", "Uso excesivo de salsas con sodio y azúcar."),

  // Digitales (71-90)
  make("redes", "Redes sociales", "📱", "digitales", "Uso compulsivo de Instagram, TikTok, X, etc."),
  make("tiktok", "TikTok", "🎵", "digitales", "Scroll infinito de videos cortos."),
  make("instagram", "Instagram", "📸", "digitales", "Comparación social y scroll compulsivo."),
  make("youtube", "YouTube", "▶️", "digitales", "Maratones de video que desplazan el sueño."),
  make("netflix", "Streaming / series", "🎬", "digitales", "Binge-watching que sustituye otras actividades."),
  make("whatsapp", "Mensajería instantánea", "💬", "digitales", "Revisar el chat compulsivamente."),
  make("email", "Email compulsivo", "📧", "digitales", "Revisar bandeja cada pocos minutos."),
  make("celular", "Uso del celular (nomofobia)", "📵", "digitales", "Ansiedad sin el teléfono cerca."),
  make("internet", "Internet en general", "🌐", "digitales", "Navegación sin propósito durante horas."),
  make("memes", "Memes / humor digital", "😂", "digitales", "Consumo infinito de contenido humorístico."),
  make("foros", "Foros y Reddit", "👥", "digitales", "Lectura compulsiva de hilos y debates."),
  make("gaming_movil", "Gaming móvil (gacha)", "📲", "digitales", "Juegos con loot boxes y microtransacciones."),
  make("twitch", "Twitch / streamers", "🎥", "digitales", "Ver streams en vivo horas seguidas."),
  make("podcasts", "Podcasts en exceso", "🎧", "digitales", "Consumo pasivo constante de audio."),
  make("ia_chatbots", "Chatbots de IA", "🤖", "digitales", "Dependencia emocional a asistentes IA."),
  make("notificaciones", "Notificaciones", "🔔", "digitales", "Reacción pavloviana a cada beep."),
  make("selfies", "Selfies / autoimagen", "🤳", "digitales", "Obsesión con la propia imagen en redes."),
  make("influencers", "Seguir influencers", "⭐", "digitales", "Vida emocional ligada a creadores."),
  make("ecommerce", "Compras online", "📦", "digitales", "Pedidos diarios en Amazon, Shein, etc."),
  make("fomo", "FOMO digital", "👀", "digitales", "Miedo constante a perderse algo online."),

  // Emocionales (91-100)
  make("drama", "Drama emocional", "🎭", "emocionales", "Buscar conflicto para sentirse vivo."),
  make("preocupacion", "Preocupación crónica", "😰", "emocionales", "Rumiar problemas sin resolverlos."),
  make("victimismo", "Victimismo", "😢", "emocionales", "Identidad construida desde el sufrimiento."),
  make("ira", "Ira / explosiones", "😡", "emocionales", "Episodios de rabia desproporcionada."),
  make("celos", "Celos obsesivos", "💚", "emocionales", "Vigilancia constante de la pareja."),
  make("aprobacion", "Búsqueda de aprobación", "🙏", "emocionales", "Necesidad de gustar a todos."),
  make("autocompasion", "Autocompasión rumiante", "🌧️", "emocionales", "Reciclar la propia desgracia."),
  make("comparacion", "Comparación social", "⚖️", "emocionales", "Medirse contra los demás todo el día."),
  make("autoexigencia", "Autoexigencia tóxica", "📐", "emocionales", "Nunca sentirse suficiente."),
  make("queja", "Queja crónica", "🗯️", "emocionales", "Quejarse como modo de relación."),
];

export const TOP_5_ADDICTIONS = [
  "alcohol",
  "tabaco",
  "vapeo",
  "videojuegos",
  "redes",
];

export const CATEGORY_LABELS: Record<AddictionCategory, string> = {
  sustancias: "Sustancias",
  conductuales: "Conductuales",
  alimentarias: "Alimentarias",
  digitales: "Digitales",
  emocionales: "Emocionales",
};

export function getAddiction(id: string): Addiction | undefined {
  const base = ADDICTIONS.find((a) => a.id === id);
  if (!base) return undefined;
  const o = OVERRIDES[id];
  return o ? { ...base, ...o } : base;
}