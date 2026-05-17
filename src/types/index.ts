// ── Tipos compartidos para Full Cash ──

export type TipoMovimiento = 'INGRESO' | 'EGRESO';

// Categorías default — el usuario puede crear más
export const CATEGORIAS_INGRESO_DEFAULT = [
  'Sueldo',
  'Emprendimiento',
  'Bono',
  'Negocio',
  'Deudas cobradas',
  'Otros ingresos',
] as const;

export const CATEGORIAS_EGRESO_DEFAULT = [
  'Vivienda',
  'Comida',
  'Servicios',
  'Entretenimiento',
  'Transporte',
  'Salud',
  'Educación',
  'Ropa',
  'Deudas',
  'Mascotas',
  'Otros gastos',
] as const;

export interface Categoria {
  id: string;
  nombre: string;
  tipo: TipoMovimiento;
  icono: string; // emoji character
  createdAt: string;
}

export interface Plataforma {
  id: string;
  nombre: string;
  createdAt: string;
}

export interface Movimiento {
  id: string;
  createdAt: string;
  concepto: string;
  monto: number;
  tipo: TipoMovimiento;
  categoriaId: string;
  categoria?: Categoria;
  plataformaId?: string | null;
  plataforma?: Plataforma | null;
  fecha: string;
}

export interface Configuracion {
  id: string;
  porcentajeAhorro: number;
}

export interface ResumenMensual {
  totalIngresos: number;
  totalEgresos: number;
  saldo: number;
  distribucionCategorias: {
    categoriaId: string;
    categoriaNombre: string;
    total: number;
    porcentaje: number;
  }[];
}

export interface MovimientoFormData {
  concepto: string;
  monto: number;
  tipo: TipoMovimiento;
  categoriaId: string;
  plataformaId?: string;
  fecha: string;
}

// Colores para el gráfico donut por categoría
export const CATEGORY_COLORS = [
  '#e5ffa6', // accent
  '#006e8b', // secondary
  '#ff4b5a', // danger
  '#ffc63f', // warning
  '#0090b3', // secondary-light
  '#c8e68a', // accent-dim
  '#e8434f', // danger-dim
  '#e5b035', // warning-dim
  '#00b894', // emerald
  '#6c5ce7', // purple
  '#fd79a8', // pink
  '#74b9ff', // sky
  '#a29bfe', // lavender
  '#00cec9', // teal
  '#fab1a0', // salmon
] as const;


