export interface Centro {
  id: string;
  nombre: string;
  tipo: "clinica" | "ong" | "publico" | "espiritual";
  direccion: string;
  ciudad: string;
  telefono: string;
  rutaOmsa?: string[];
  metro?: { linea: 1 | 2; estacion: string };
  especialidades: string[];
}

export const CENTROS: Centro[] = [
  {
    id: "c1",
    nombre: "Hospital Padre Billini",
    tipo: "publico",
    direccion: "Calle Arzobispo Portes, Zona Colonial",
    ciudad: "Santo Domingo",
    telefono: "(809) 221-8272",
    rutaOmsa: ["Ruta C-1: Independencia ↔ Centro de los Héroes"],
    metro: { linea: 1, estacion: "Casandra Damirón" },
    especialidades: ["Alcohol", "Sustancias", "Salud mental general"],
  },
  {
    id: "c2",
    nombre: "Centro de Atención a la Drogodependencia (CAD)",
    tipo: "publico",
    direccion: "Av. Tiradentes esq. Roberto Pastoriza",
    ciudad: "Santo Domingo",
    telefono: "(809) 565-3232",
    rutaOmsa: ["Ruta 24 de Abril", "Corredor Tiradentes"],
    metro: { linea: 2, estacion: "Eduardo Brito" },
    especialidades: ["Cocaína", "Crack", "Alcohol"],
  },
  {
    id: "c3",
    nombre: "Hogar Crea Dominicano",
    tipo: "ong",
    direccion: "Av. Charles de Gaulle, Sabana Perdida",
    ciudad: "Santo Domingo Norte",
    telefono: "(809) 595-1212",
    rutaOmsa: ["Corredor Charles de Gaulle"],
    metro: { linea: 1, estacion: "Mamá Tingó" },
    especialidades: ["Residencial", "Rehabilitación integral"],
  },
  {
    id: "c4",
    nombre: "Casa Abierta",
    tipo: "ong",
    direccion: "Calle Mariano Cestero #16, Villa Juana",
    ciudad: "Santo Domingo",
    telefono: "(809) 689-4448",
    rutaOmsa: ["Ruta Máximo Gómez"],
    metro: { linea: 1, estacion: "Juan Pablo Duarte" },
    especialidades: ["Adolescentes", "Prevención", "Familia"],
  },
  {
    id: "c5",
    nombre: "Centro Vida y Familia Ana Simó",
    tipo: "clinica",
    direccion: "Av. Bolívar #353, Gascue",
    ciudad: "Santo Domingo",
    telefono: "(809) 686-2222",
    rutaOmsa: ["Corredor Bolívar"],
    metro: { linea: 1, estacion: "Casandra Damirón" },
    especialidades: ["Pornografía", "Conductas", "Pareja"],
  },
  {
    id: "c6",
    nombre: "AA Distrito Nacional — Grupo Esperanza",
    tipo: "espiritual",
    direccion: "Calle El Conde #210, Zona Colonial",
    ciudad: "Santo Domingo",
    telefono: "(809) 333-1212",
    metro: { linea: 1, estacion: "Casandra Damirón" },
    especialidades: ["Alcohólicos Anónimos", "12 pasos"],
  },
  {
    id: "c7",
    nombre: "Clínica Cruz Jiminián",
    tipo: "clinica",
    direccion: "Av. Máximo Gómez esq. Hno. Miguel",
    ciudad: "Santo Domingo",
    telefono: "(809) 685-1414",
    rutaOmsa: ["Corredor Máximo Gómez"],
    metro: { linea: 1, estacion: "Hermanas Mirabal" },
    especialidades: ["Desintoxicación", "Hospitalización breve"],
  },
  {
    id: "c8",
    nombre: "CEDIMAT — Psiquiatría",
    tipo: "clinica",
    direccion: "Plaza de la Salud, Av. Ortega y Gasset",
    ciudad: "Santo Domingo",
    telefono: "(809) 565-9989",
    rutaOmsa: ["Ortega y Gasset"],
    metro: { linea: 1, estacion: "Pedro Mir" },
    especialidades: ["Trastornos duales", "Medicación"],
  },
];

export const METRO_LINEAS = {
  1: {
    color: "#E50000",
    estaciones: [
      "Mamá Tingó", "Gregorio Urbano Gilbert", "Gregorio Luperón", "José Francisco Peña Gómez",
      "Hermanas Mirabal", "Máximo Gómez", "Los Taínos", "Pedro Livio Cedeño",
      "Manuel Arturo Peña Batlle", "Juan Pablo Duarte", "Profesor Juan Bosch",
      "Casandra Damirón", "Joaquín Balaguer", "Amín Abel Hasbún", "Francisco Alberto Caamaño",
      "Pedro Mir", "Centro de los Héroes",
    ],
  },
  2: {
    color: "#0066B3",
    estaciones: [
      "María Montez", "Pedro Francisco Bonó", "Francisco Gregorio Billini",
      "Ulises Francisco Espaillat", "Pedro Mir", "Freddy Beras Goico",
      "Juan Ulises García Saleta", "Juan Pablo Duarte", "Coronel Rafael Tomás Fernández",
      "Mauricio Báez", "Ramón Cáceres", "Manuel de Jesús Galván", "Eduardo Brito",
    ],
  },
};