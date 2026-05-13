export type WasteCategory = {
  id: string;
  name: string;
  emoji: string;
  bin: string;
  binColor: string;
  description: string;
  tip: string;
  apiClassName: string;
};

export const WASTE_CATEGORIES: WasteCategory[] = [
  {
    id: 'cardboard',
    name: 'Cartón',
    emoji: '📦',
    bin: 'Contenedor azul',
    binColor: '#3B82F6',
    description: 'Cajas, embalajes y láminas de cartón limpio.',
    tip: 'Aplastá las cajas para ahorrar espacio en el contenedor.',
    apiClassName: 'Cardboard',
  },
  {
    id: 'food-organics',
    name: 'Orgánico',
    emoji: '🍎',
    bin: 'Contenedor marrón',
    binColor: '#A16207',
    description: 'Restos de comida, cáscaras y residuos compostables.',
    tip: 'Sin plásticos ni envoltorios: composta directa.',
    apiClassName: 'Food Organics',
  },
  {
    id: 'glass',
    name: 'Vidrio',
    emoji: '🍾',
    bin: 'Contenedor verde',
    binColor: '#16A34A',
    description: 'Botellas, frascos y envases de vidrio enjuagados.',
    tip: 'Sin tapas ni corchos; van por otro circuito.',
    apiClassName: 'Glass',
  },
  {
    id: 'metal',
    name: 'Metal',
    emoji: '🥫',
    bin: 'Contenedor amarillo / gris',
    binColor: '#EAB308',
    description: 'Latas, aluminio y pequeñas piezas metálicas.',
    tip: 'Aplastá las latas para reducir su volumen.',
    apiClassName: 'Metal',
  },
  {
    id: 'misc',
    name: 'Misceláneo',
    emoji: '🗑️',
    bin: 'Contenedor gris',
    binColor: '#6B7280',
    description: 'Residuos que no encajan en otra categoría.',
    tip: 'Si dudás, no contamines reciclables válidos.',
    apiClassName: 'Miscellaneous Trash',
  },
  {
    id: 'paper',
    name: 'Papel',
    emoji: '📄',
    bin: 'Contenedor azul',
    binColor: '#2563EB',
    description: 'Hojas, periódicos, revistas y documentos.',
    tip: 'Sin grasa, sin comida pegada, sin plásticos.',
    apiClassName: 'Paper',
  },
  {
    id: 'plastic',
    name: 'Plástico',
    emoji: '🥤',
    bin: 'Contenedor amarillo',
    binColor: '#F59E0B',
    description: 'Envases, botellas y film plástico reciclable.',
    tip: 'Verificá el código de reciclaje en la base.',
    apiClassName: 'Plastic',
  },
  {
    id: 'textile',
    name: 'Textil',
    emoji: '👕',
    bin: 'Punto verde textil',
    binColor: '#10B981',
    description: 'Ropa, sábanas y telas en general.',
    tip: 'Si está en buen estado, considerá donarlo.',
    apiClassName: 'Textile Trash',
  },
  {
    id: 'vegetation',
    name: 'Vegetación',
    emoji: '🌿',
    bin: 'Composta',
    binColor: '#22C55E',
    description: 'Hojas, ramas y restos verdes del jardín.',
    tip: 'Cortá las ramas grandes antes de compostar.',
    apiClassName: 'Vegetation',
  },
];

export const CATEGORY_BY_API: Record<string, WasteCategory> = WASTE_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.apiClassName] = cat;
    acc[cat.apiClassName.replace(' ', '_')] = cat;
    return acc;
  },
  {} as Record<string, WasteCategory>,
);

export type Stat = { label: string; value: string; sub: string };

export const STATS: Stat[] = [
  { label: 'Categorías', value: '9', sub: 'tipos de residuo soportados' },
  { label: 'Precisión', value: '94%', sub: 'top-1 en validación' },
  { label: 'Latencia', value: '<1s', sub: 'predicción en edge' },
  { label: 'Open data', value: 'RealWaste', sub: 'dataset UCI · ResNet50' },
];

export type Step = { id: string; title: string; description: string; accent: string };

export const STEPS: Step[] = [
  {
    id: '01',
    title: 'Capturá la imagen',
    description:
      'Tomá una foto del residuo en buena luz o subila desde tu galería. Funciona con JPG, JPEG y PNG.',
    accent: 'from-brand-400 to-accent-cyan',
  },
  {
    id: '02',
    title: 'El modelo analiza',
    description:
      'ResNet50 con Transfer Learning extrae 2048 features de tu foto y las pasa por una cabeza fine-tuned sobre RealWaste.',
    accent: 'from-accent-cyan to-accent-violet',
  },
  {
    id: '03',
    title: 'Recibís la guía',
    description:
      'Categoría predicha, distribución de probabilidades por clase y la recomendación de reciclaje correcta.',
    accent: 'from-accent-violet to-accent-lime',
  },
];

export type TeamMember = {
  name: string;
  role: string;
  tag: 'Frontend' | 'Backend';
};

export const TEAM: TeamMember[] = [
  {
    name: 'María Claudia Fabián',
    role: 'Frontend · UI, animaciones e integración con la API',
    tag: 'Frontend',
  },
  {
    name: 'Fátima Isabel Sumbaine',
    role: 'Frontend · Diseño, UX y construcción de componentes',
    tag: 'Frontend',
  },
  {
    name: 'Daniel Marcelo Chachagua Garrido',
    role: 'Backend · API REST, modelo ResNet50 e inferencia ONNX',
    tag: 'Backend',
  },
  {
    name: 'Victoria Macarena Alvarez',
    role: 'Backend · Datos, pipeline de entrenamiento y evaluación',
    tag: 'Backend',
  },
];

export type Pillar = { title: string; copy: string; icon: string };

export const PILLARS: Pillar[] = [
  {
    title: 'Separación en origen',
    copy:
      'El primer paso para que un residuo vuelva al ciclo productivo. Lo que se mezcla, se contamina.',
    icon: '♻️',
  },
  {
    title: 'IA accesible',
    copy:
      'Una foto basta. Sin formularios complejos: una herramienta lista para usar desde el celular.',
    icon: '🤖',
  },
  {
    title: 'Educación abierta',
    copy:
      'Proyecto académico con código y datos públicos. Pensado para aprender y replicar.',
    icon: '🎓',
  },
];
