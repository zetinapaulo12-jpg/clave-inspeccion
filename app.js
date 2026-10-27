// ============================================================================
// CLAVE CONSTRUCCIÓN - SISTEMA DIGITAL DE INSPECCIÓN TÉCNICA
// ============================================================================

const STORAGE_CURRENT_KEY = 'clave_inspeccion_current_v1';
const STORAGE_HISTORY_KEY = 'clave_inspeccion_history_v1';

// Definición de puntos para Equipos Centrales y Exterior
const SYSTEMS_SCHEMA = [
  {
    categoryId: 'sys_elec',
    categoryTitle: '⚡ Instalación Eléctrica Central (Tablero Principal)',
    items: [
      {
        id: 'tablero_estado',
        title: 'Centro de carga / Tablero eléctrico principal',
        hint: 'Estado físico del gabinete, tapa frontal, interruptores termomagnéticos (pastillas) en buen estado y acordes al calibre.',
        tags: ['Gabinete y tapa completos', 'Circuitos identificados', 'Pastillas en buen estado', 'Sin directorio de circuitos', 'Tapa faltante', 'Pastilla dañada', 'Marcas de calentamiento', 'Sobrecarga en pastilla']
      },
      {
        id: 'tablero_cableado',
        title: 'Cableado interno, conexiones y puesta a tierra',
        hint: 'Ausencia de empalmes improvisados, cables sueltos, aislamiento derretido; presencia de barra de tierra física.',
        tags: ['Cableado ordenado y peinado', 'Con barra de tierra física', 'Sin tierra física', 'Cables mal empalmados', 'Cables expuestos fuera de tubería', 'Calibre inadecuado aparente']
      },
      {
        id: 'acometida_medidor',
        title: 'Acometida eléctrica, mufa y base de medidor',
        hint: 'Estado visual exterior de la acometida, interruptor general de cuchillas/principal y sujeción en muro.',
        tags: ['Acometida y medidor en orden', 'Mufa inclinada', 'Filtración en base de medidor', 'Interruptor principal oxidado']
      }
    ]
  },
  {
    categoryId: 'sys_hid',
    categoryTitle: '💧 Equipos Hidráulicos, Sanitarios y Gas Centrales',
    items: [
      {
        id: 'boiler_calentador',
        title: 'Calentador de agua (Boiler) y conexiones',
        hint: 'Encendido, estado del tanque (sin corrosión ni goteo), válvula de alivio, ventilación adecuada y llave de gas sin fugas.',
        tags: ['Operando correctamente', 'Buena ventilación', 'Fuga en conexiones', 'Sin tiro / mala ventilación', 'Piloto no enciende', 'Corrosión en base', 'Falta válvula de alivio']
      },
      {
        id: 'bomba_hidro',
        title: 'Bomba de agua / Sistema hidroneumático / Presurizador',
        hint: 'Arranque automático, nivel de ruido, manómetro de presión, ausencia de fugas en sellos o válvulas check.',
        tags: ['Arranque y presión normal', 'Fuga en sello mecánico', 'No arranca en automático', 'Ruido excesivo en baleros', 'Tanque precargado sin presión']
      },
      {
        id: 'tinaco_cisterna',
        title: 'Tinaco y/o Cisterna (Acceso normal)',
        hint: 'Estado interior/limpieza aparente, tapa segura, funcionamiento de válvula de llenado, flotador y jarro de aire.',
        tags: ['Limpio y con tapa segura', 'Flotador operando bien', 'Tapa rota o faltante', 'Flotador desajustado', 'Sedimento / requiere lavado', 'Fisura en muros de cisterna']
      },
      {
        id: 'medidor_agua_gas',
        title: 'Cuadro de medidor de agua, llave de paso general e instalación de gas aparente',
        hint: 'Ausencia de fugas en medidor hidráulico; tubería de gas pintada/identificada, regulador y llaves de corte funcionales.',
        tags: ['Sin fugas aparentes', 'Llaves de corte operativas', 'Goteo en llave de paso general', 'Tubería de gas con oxidación', 'Regulador antiguo', 'Falta llave de corte accesible']
      }
    ]
  },
  {
    categoryId: 'sys_ext',
    categoryTitle: '🏗️ Estructura Exterior Visible y Fachada',
    items: [
      {
        id: 'fachada_muros',
        title: 'Muros exteriores, fachada y bardas perimetrales',
        hint: 'Revisión de grietas estructurales, fisuras en repello, desplomes en bardas o separación en juntas constructivas.',
        tags: ['Muros aplomados y sin grietas', 'Fisuras superficiales en fachada', 'Grieta diagonal en muro exterior', 'Barda perimetral con desplome', 'Humedad en base de fachada']
      },
      {
        id: 'estructura_ext',
        title: 'Columnas, trabes, voladizos y marquesinas exteriores',
        hint: 'Alineación visual, ausencia de flechas pronunciadas en voladizos, recubrimiento de concreto sin acero expuesto.',
        tags: ['Sin daño estructural visible', 'Acero de refuerzo expuesto', 'Desprendimiento de recubrimiento', 'Grieta en unión trabe-columna']
      },
      {
        id: 'accesos_pisos_ext',
        title: 'Banquetas, firme de cochera y portón / puerta principal de acceso',
        hint: 'Hundimientos o grietas por asentamiento en pisos exteriores; operación de portón vehicular y cerradura peatonal.',
        tags: ['Pisos nivelados y portón funcional', 'Hundimiento en firme exterior', 'Portón roza o descuadrado', 'Pendiente pluvial hacia el interior']
      }
    ]
  }
];

// Esquema de revisión dentro de cada Área / Habitación (Opción B)
const ROOM_CATEGORIES_SCHEMA = [
  {
    categoryId: 'estructura',
    categoryTitle: '🏗️ 1. Revisión Estructural Visible (Muros, Losa, Columnas)',
    alwaysShow: true,
    items: [
      {
        id: 'muros_est',
        title: 'Muros de carga y divisorios',
        hint: 'Presencia de fisuras o grietas (superficiales vs. diagonales/escalonadas por asentamiento), desplomes o abombamientos.',
        tags: ['Fisura superficial en acabado', 'Grieta diagonal a 45°', 'Grieta vertical en unión', 'Muro con desplome visible']
      },
      {
        id: 'losa_est',
        title: 'Losa / Techo estructural',
        hint: 'Flechas o deflexiones visibles en el claro, grietas en perímetro o centro de losa, desprendimiento o varilla expuesta.',
        tags: ['Fisura en unión losa-muro', 'Deflexión / flecha visible', 'Varilla oxidada expuesta', 'Humedad estructural en losa']
      },
      {
        id: 'columnas_est',
        title: 'Columnas, castillos y trabes (vigas) visibles',
        hint: 'Integridad en uniones (nodos), ausencia de grietas cortantes, golpes o pérdida de sección.',
        tags: ['Fisura en nodo trabe-columna', 'Despostillamiento en esquina', 'Sin elementos expuestos / Ocultos en muro']
      }
    ]
  },
  {
    categoryId: 'electrica',
    categoryTitle: '⚡ 2. Instalación Eléctrica Aparente',
    alwaysShow: true,
    items: [
      {
        id: 'contactos_elec',
        title: 'Contactos (Enchufes) eléctricos',
        hint: 'Tensión correcta, polaridad y tierra física verificada, sujeción firme a la chalupa, sin rastros de chispazo o calor.',
        tags: ['Placa floja o mal sujeta', 'Sin tierra física', 'Polaridad invertida', 'Contacto sin corriente', 'Falta contacto GFCI (zona húmeda)']
      },
      {
        id: 'apagadores_elec',
        title: 'Apagadores y placas',
        hint: 'Accionamiento suave, control correcto de luminarias, apagadores de escalera (3 vías) funcionando.',
        tags: ['Apagador no acciona luz', 'Apagador de escalera mal conectado', 'Placa rota o manchada de pintura']
      },
      {
        id: 'iluminacion_elec',
        title: 'Iluminación, salidas de techo/muro y cableado aparente',
        hint: 'Funcionamiento de lámparas/spots, rosetas seguras y ausencia de cables sueltos sin canaleta o tubo conduit.',
        tags: ['Luminaria fundida / no enciende', 'Cables expuestos sin tapa', 'Parpadeo en lámpara LED']
      }
    ]
  },
  {
    categoryId: 'hidraulica',
    categoryTitle: '💧 3. Instalación Hidráulica y Sanitaria Aparente',
    alwaysShow: false, // Se activa en baños, cocinas, patios o manualmente
    items: [
      {
        id: 'presion_hid',
        title: 'Suministro, presión de agua y llegada de agua caliente',
        hint: 'Caudal constante al abrir llaves simultáneamente; flujo correcto en línea fría y caliente.',
        tags: ['Baja presión de agua', 'No llega agua caliente', 'Golpe de ariete / vibración en tubería']
      },
      {
        id: 'llaves_hid',
        title: 'Llaves mezcladoras, monomandos, mangueras coflex y llaves angulares',
        hint: 'Cierre hermético sin goteo, mangueras alimentadoras sin oxidación ni fugas en tuercas.',
        tags: ['Goteo en mezcladora', 'Fuga en manguera alimentadora', 'Llave angular pegada / con sarro', 'Maneral flojo']
      },
      {
        id: 'muebles_hid',
        title: 'Muebles sanitarios (WC, lavabo, regadera, tarja)',
        hint: 'Fijación firme al piso/muro, descarga eficiente del WC, herrajes de tanque (sapito/flotador) sin fuga silenciosa.',
        tags: ['Fuga interna en sapito de WC', 'WC flojo en la base (cuello de cera)', 'Regadera obstruida por sarro', 'Fuga bajo tarja/lavabo']
      },
      {
        id: 'desagues_hid',
        title: 'Desagües, céspoles y coladeras',
        hint: 'Velocidad de desalojo de agua sin estancamiento, céspol sin goteo y ausencia de malos olores (sello hidráulico).',
        tags: ['Drenado lento / semi-tapado', 'Fuga en céspol de lavabo/tarja', 'Retorno de malos olores en coladera', 'Rejilla de coladera suelta']
      }
    ]
  },
  {
    categoryId: 'acabados',
    categoryTitle: '🎨 4. Acabados Arquitectónicos (Pisos, Paredes y Techos)',
    alwaysShow: true,
    items: [
      {
        id: 'pisos_aca',
        title: 'Pisos y zoclos',
        hint: 'Revisión de piezas flojas o "huecas" al golpeo ligero, piezas estrelladas, desgaste en laminado/madera y estado de boquillas.',
        tags: ['Piezas huecas al percutir', 'Loseta estrellada o despostillada', 'Boquilla / junta faltante', 'Zoclo desprendido', 'Desnivel o encharcamiento']
      },
      {
        id: 'paredes_aca',
        title: 'Paredes y recubrimientos (Pintura, pasta, azulejos)',
        hint: 'Uniformidad de pintura, manchas, desprendimientos por humedad, azulejos bien adheridos y silicón en bordes húmedos.',
        tags: ['Pintura manchada o descascarada', 'Abombamiento por humedad baja', 'Azulejos huecos o sin boquilla', 'Falta sello de silicón']
      },
      {
        id: 'techos_aca',
        title: 'Techos y plafones inferiores',
        hint: 'Estado de yeso o tablaroca, juntas de cinta visibles, manchas amarillas por filtración o pintura desprendida.',
        tags: ['Mancha de humedad en plafón', 'Fisura en junta de tablaroca', 'Desprendimiento de yeso/pintura']
      }
    ]
  },
  {
    categoryId: 'equipamiento',
    categoryTitle: '🚪 5. Equipamiento Fijo (Puertas, Ventanas, Cerrajería y Carpintería)',
    alwaysShow: true,
    items: [
      {
        id: 'puertas_eq',
        title: 'Puertas y marcos',
        hint: 'Apertura y cierre suave sin rozar con el piso o marco, estado de la hoja (sin golpes ni hinchazón), bisagras y topes.',
        tags: ['Puerta roza con el piso/marco', 'No cierra el pestillo en la contra', 'Hinchazón por humedad inferior', 'Falta tope de puerta', 'Bisagra rechinando o floja']
      },
      {
        id: 'ventanas_eq',
        title: 'Ventanas y cancelería',
        hint: 'Correderas suaves, vidrios sin fisuras, mosquiteros completos, felpas y sellado perimetral de silicón contra lluvia.',
        tags: ['Hoja corrediza atascada', 'Sello exterior reseco o abierto', 'Mosquitero roto o faltante', 'Vidrio estrellado / rayado']
      },
      {
        id: 'cerrajeria_eq',
        title: 'Cerrajería y herrajes',
        hint: 'Funcionamiento mecánico de chapas, cerraduras, pasadores, seguros de ventanas y entrega de llaves.',
        tags: ['Cerradura trabada', 'Sin llave disponible', 'Seguro de ventana roto', 'Manija suelta']
      },
      {
        id: 'carpinteria_eq',
        title: 'Clósets, gabinetes, alacenas o barandales fijos',
        hint: 'Puertas de clóset/gabinete niveladas, cajones con correderas suaves, firmeza en barandales o cancel de baño.',
        tags: ['Puertas de gabinete desniveladas', 'Cajón se atora en corredera', 'Cancel de baño con fuga de agua', 'Barandal con juego/flojo']
      }
    ]
  },
  {
    categoryId: 'humedad_room',
    categoryTitle: '💧🔦 6. Revisión de Humedad y Filtraciones en el Área (Paquete Integral / Premium)',
    integralOnly: true,
    items: [
      {
        id: 'humedad_focal',
        title: 'Diagnóstico de humedad, filtraciones y termografía / higrómetro en esta área',
        hint: 'Verificación instrumentada o detallada en base de muros (capilaridad), perímetro de ventanas, muros colindantes y plafón.',
        tags: ['Sin humedad anormal (<12%)', 'Humedad por capilaridad en rodapié', 'Filtración en perímetro de ventana', 'Filtración activa desde losa/baño superior', 'Condensación por falta de ventilación']
      }
    ]
  }
];

// Esquema Módulo Registro Aéreo con Dron (Integral y Premium)
const DRONE_SCHEMA = [
  {
    id: 'dron_imper',
    title: 'Estado general de azotea e impermeabilización',
    hint: 'Inspección aérea de membrana prefabricada o impermeabilizante acrílico, grietas en losa superior, abombamientos o desprendimientos.',
    tags: ['Impermeabilizante en buen estado', 'Impermeabilizante reseco / agrietado', 'Burbujas o abombamientos', 'Requiere re-impermeabilización urgente']
  },
  {
    id: 'dron_pendientes',
    title: 'Pendientes pluviales, encharcamientos y coladeras de azotea',
    hint: 'Detección de zonas de acumulación de agua (charcos), basura acumulada o vegetación en bajantes pluviales y gárgolas.',
    tags: ['Bajantes limpios y libres', 'Marca de encharcamiento severo', 'Coladera pluvial obstruida con hojas/basura', 'Contrapendiente en azotea']
  },
  {
    id: 'dron_domos_tejas',
    title: 'Techumbres inclinadas, tejas, domos y tragaluces',
    hint: 'Piezas de teja desplazadas o rotas, estado de policarbonato/cristal en domos y sellos perimetrales.',
    tags: ['Tejas completas y alineadas', 'Tejas rotas o desplazadas', 'Domo con sello perimetral vencido', 'Policarbonato dañado por sol/granizo']
  },
  {
    id: 'dron_equipos',
    title: 'Instalaciones y equipos en azotea (Tinacos, A/C, Paneles, Calentador Solar)',
    hint: 'Revisión aérea de bases, tuberías térmicas expuestas al sol, soportes de minisplits y limpieza de paneles/tubos solares.',
    tags: ['Aislamiento térmico de tubería roto', 'Tinaco sin tapa en azotea', 'Base metálica con corrosión', 'Paneles/tubos solares limpios y fijos']
  },
  {
    id: 'dron_fachadas_altas',
    title: 'Fachadas altas, pretiles y colindancias superiores',
    hint: 'Revisión de fisuras en niveles altos inaccesibles desde piso, remates de pretil (chaflanes) y sellado entre construcciones vecinas.',
    tags: ['Chaflanes y pretiles íntegros', 'Grieta en pretil de azotea', 'Falta sellado en junta colindante', 'Desprendimiento de aplanado en altura']
  }
];

// Esquema Módulo Humedad, Filtraciones y Áreas de Difícil Acceso (Integral y Premium)
const MOISTURE_SCHEMA = [
  {
    id: 'hum_capilaridad',
    title: 'Humedad ascendente por capilaridad (Cimentación / Planta Baja)',
    hint: 'Revisión en los primeros 40-80 cm de muros de planta baja y colindancias en busca de salitre (eflorescencia) o abombamientos.',
    tags: ['Sin presencia de capilaridad', 'Salitre / eflorescencia en base de muros', 'Humedad severa en muro colindante']
  },
  {
    id: 'hum_filtracion',
    title: 'Filtraciones activas o latentes (Losa, baños en planta alta, fachadas)',
    hint: 'Rastreo de pasos de agua debajo de zonas húmedas, charolas de baño, balcones y muros expuestos a lluvia dominante.',
    tags: ['Sin filtraciones detectadas', 'Filtración bajo zona de regadera superior', 'Humedad en muro bajo ventana exterior']
  },
  {
    id: 'dif_entretechos',
    title: 'Áreas de difícil acceso: Entretechos / Plafones falsos registrables',
    hint: 'Inspección sobre plafón con cámara/linterna: estado de losa oculta, pasos de tuberías, cajas eléctricas de registro y fauna.',
    tags: ['Plafón corrido no registrable', 'Interior de plafón seco y ordenado', 'Goteo oculto sobre plafón falso', 'Cables sueltos sin cajas de conexión']
  },
  {
    id: 'dif_sotanos_ductos',
    title: 'Áreas de difícil acceso: Sótanos, cuartos de máquinas o ductos verticales',
    hint: 'Revisión de muros de contención, ventilación, pasos verticales de instalaciones hidrosanitarias.',
    tags: ['Sin sótano / No aplica', 'Ducto de instalaciones accesible y seco', 'Filtración en muro de contención', 'Fuga en bajante vertical']
  },
  {
    id: 'dif_registros',
    title: 'Inspección de Registros Sanitarios y Pluviales',
    hint: 'Apertura de tapas de registro para verificar medias cañas, flujo libre de aguas residuales, ausencia de raíces, grasa o azolve.',
    tags: ['Registros limpios y con buen flujo', 'Tapa de registro sellada / rota', 'Presencia de azolve o taponamiento', 'Fisuras en paredes del registro']
  }
];

// Estado global de la inspección actual
let state = createDefaultState();

function createDefaultState() {
  const today = new Date().toISOString().split('T')[0];
  const nowTime = new Date().toTimeString().slice(0, 5);
  const randomDigits = Math.floor(100 + Math.random() * 900);

  const defaultRooms = [
    createRoomObject('sala_comedor', 'Sala - Comedor', false),
    createRoomObject('cocina', 'Cocina', true),
    createRoomObject('bano', 'Baño Principal', true),
    createRoomObject('recamara', 'Recámara Principal', false),
    createRoomObject('patio', 'Patio / Área de Servicio', true)
  ];

  return {
    id: 'insp_' + Date.now(),
    package: null, // Se fija al seleccionar: 'esencial' | 'integral' | 'premium'
    packageLocked: false,
    activeTab: 'tab-general',
    activeRoomId: defaultRooms[0].id,
    meta: {
      folio: `CLV-2026-${randomDigits}`,
      date: today,
      time: nowTime,
      purpose: 'Recepción de inmueble nuevo / Entrega de constructora',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      accompaniedBy: '',
      address: '',
      coordinates: '',
      mapsUrl: '',
      propertyType: 'Casa Habitación',
      areaM2: '',
      levels: '2 niveles',
      age: '',
      occupancy: 'Vacío / Deshabitado',
      weather: 'Soleado / Seco',
      inspectorName: '',
      coverPhoto: null,
      generalNotes: ''
    },
    systems: {}, // { [itemId]: { status, notes, selectedTags: [], photos: [] } }
    rooms: defaultRooms,
    drone: {
      equipment: '',
      conditions: '',
      videoUrl: '',
      items: {}
    },
    moisture: {
      tools: 'Inspección visual + Higrómetro digital de humedad',
      maxReading: '',
      items: {}
    },
    premium: {
      tourUrl: '',
      tourCamera: '',
      tourScenesCount: '',
      tourNotes: '',
      profName: '',
      profTitle: 'Ingeniero Civil',
      cedula: '',
      colegio: '',
      verdict: 'ÓPTIMO / HABITABLE SIN RIESGOS APARENTES',
      conclusion: '',
      declaration: 'El presente Dictamen Técnico se emite con base en la inspección visual y de diagnóstico no destructivo realizada en la fecha indicada por personal acreditado de CLAVE CONSTRUCCIÓN, haciendo constar las condiciones físicas, estructurales visibles y de instalaciones aparentes del inmueble.'
    },
    signatures: {
      inspector: null,
      client: null
    }
  };
}

function createRoomObject(type, name, hasPlumbing) {
  return {
    id: 'room_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    type,
    name,
    hasPlumbing: Boolean(hasPlumbing),
    generalObservation: '',
    items: {} // { [itemId]: { status: ''|'good'|'warn'|'bad'|'na', notes: '', selectedTags: [], photos: [] } }
  };
}

// ============================================================================
// INICIALIZACIÓN
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
  loadCurrentFromStorage();
  initSignaturePads();
  renderAll();
});

function renderAll() {
  syncPackageUI();
  syncMetaInputs();
  renderSystemsChecklist();
  renderRoomsSidebar();
  renderActiveRoomPanel();
  renderIntegralModules();
  renderPremiumModules();
  renderFindingsSummary();
  updateStatsBar();
  updateHistoryCountBadge();
}

// ============================================================================
// PERSISTENCIA Y RESPALDO (LOCALSTORAGE + JSON)
// ============================================================================

function isCurrentFormWorthIndexing(formObj) {
  if (!formObj) return false;
  if (formObj.package) return true;
  if (formObj.meta?.clientName?.trim() || formObj.meta?.address?.trim()) return true;
  return false;
}

function syncCurrentToDatabaseSilent() {
  if (!isCurrentFormWorthIndexing(state)) return;
  try {
    const list = getHistoryList();
    const idx = list.findIndex(item => item.id === state.id || (item.meta?.folio && item.meta.folio === state.meta?.folio));
    const copy = JSON.parse(JSON.stringify(state));
    copy.savedAt = new Date().toISOString();
    if (idx >= 0) {
      list[idx] = copy;
    } else {
      list.unshift(copy);
    }
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(list));
    updateHistoryCountBadge();
  } catch (e) {
    console.warn('No se pudo sincronizar automáticamente en la base de datos local:', e);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_CURRENT_KEY, JSON.stringify(state));
    syncCurrentToDatabaseSilent();
    const indicator = document.getElementById('autosave-text');
    if (indicator) {
      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      indicator.textContent = `Guardado en Base de Datos: ${timeStr}`;
    }
  } catch (e) {
    console.warn('Error guardando en localStorage (posible límite por fotos):', e);
  }
  updateStatsBar();
}

function loadCurrentFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_CURRENT_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.meta && Array.isArray(parsed.rooms)) {
        state = parsed;
      }
    }
  } catch (e) {
    console.warn('No se pudo recuperar sesión previa:', e);
  }
}

function getHistoryList() {
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function updateHistoryCountBadge() {
  const list = getHistoryList();
  const el = document.getElementById('saved-count');
  if (el) el.textContent = list.length;
  const elMob = document.getElementById('saved-count-mob');
  if (elMob) elMob.textContent = list.length;
}

function saveToHistoryExplicit() {
  saveState();
  const list = getHistoryList();
  const idx = list.findIndex(item => item.id === state.id || (item.meta?.folio && item.meta.folio === state.meta?.folio));
  const copy = JSON.parse(JSON.stringify(state));
  copy.savedAt = new Date().toISOString();
  if (idx >= 0) {
    list[idx] = copy;
  } else {
    list.unshift(copy);
  }
  try {
    localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(list));
    updateHistoryCountBadge();
    renderHistoryModalList();
    showToast(`🗄️ Formulario "${state.meta.folio}" guardado en la Base de Datos`, 'success');
  } catch (e) {
    alert('El almacenamiento del navegador está lleno. Descarga la Base de Datos Maestra (.xlsx) o el respaldo (.json).');
  }
}

function openHistoryModal() {
  syncCurrentToDatabaseSilent();
  renderHistoryModalList();
  document.getElementById('modal-history').classList.add('open');
}

function closeHistoryModal() {
  document.getElementById('modal-history').classList.remove('open');
}

function computeStatsForFormState(formObj) {
  const items = collectActiveItemsForFormState(formObj);
  let evaluated = 0;
  let good = 0;
  let warn = 0;
  let bad = 0;
  items.forEach(({ entry }) => {
    if (entry.status) evaluated++;
    if (entry.status === 'good') good++;
    if (entry.status === 'warn') warn++;
    if (entry.status === 'bad') bad++;
  });
  const pct = items.length > 0 ? Math.round((evaluated / items.length) * 100) : 0;
  return { total: items.length, evaluated, good, warn, bad, pct };
}

function renderHistoryModalList() {
  const container = document.getElementById('history-list-container');
  const kpiBar = document.getElementById('db-kpi-bar');
  if (!container) return;

  const list = getHistoryList();
  const searchQuery = (document.getElementById('db-search-input')?.value || '').trim().toLowerCase();

  let totalGood = 0;
  let totalWarn = 0;
  let totalBad = 0;

  list.forEach(item => {
    const st = computeStatsForFormState(item);
    totalGood += st.good;
    totalWarn += st.warn;
    totalBad += st.bad;
  });

  if (kpiBar) {
    kpiBar.innerHTML = `
      <div style="background:#18181B; color:#fff; padding:10px 14px; border-radius:10px;">
        <div style="font-size:0.7rem; text-transform:uppercase; color:#A1A1AA; font-weight:700;">Total Formularios</div>
        <div style="font-size:1.35rem; font-weight:800; color:#FACC15;">${list.length}</div>
      </div>
      <div style="background:#F0FDF4; border:1px solid #BBF7D0; padding:10px 14px; border-radius:10px;">
        <div style="font-size:0.7rem; text-transform:uppercase; color:#166534; font-weight:700;">Puntos Óptimos (Total)</div>
        <div style="font-size:1.35rem; font-weight:800; color:#15803D;">✓ ${totalGood}</div>
      </div>
      <div style="background:#FFFBEB; border:1px solid #FDE68A; padding:10px 14px; border-radius:10px;">
        <div style="font-size:0.7rem; text-transform:uppercase; color:#92400E; font-weight:700;">Mantenimiento Regular</div>
        <div style="font-size:1.35rem; font-weight:800; color:#B45309;">⚠ ${totalWarn}</div>
      </div>
      <div style="background:#FEF2F2; border:1px solid #FECACA; padding:10px 14px; border-radius:10px;">
        <div style="font-size:0.7rem; text-transform:uppercase; color:#991B1B; font-weight:700;">Hallazgos Urgentes</div>
        <div style="font-size:1.35rem; font-weight:800; color:#B91C1C;">✕ ${totalBad}</div>
      </div>
    `;
  }

  const filtered = list.filter(item => {
    if (!searchQuery) return true;
    const haystack = [
      item.meta?.folio,
      item.package,
      item.meta?.clientName,
      item.meta?.clientPhone,
      item.meta?.address,
      item.meta?.inspectorName,
      item.meta?.date
    ].filter(Boolean).join(' ').toLowerCase();
    return haystack.includes(searchQuery);
  });

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="padding:24px; text-align:center; color:var(--text-muted); font-size:0.86rem; border:1px dashed var(--border-color); border-radius:12px;">
        ${list.length === 0
          ? 'Aún no hay formularios registrados en la Base de Datos. Conforme llenes un formulario o presiones "💾 Guardar / Actualizar Formulario Actual", aparecerá aquí automáticamente.'
          : 'No se encontraron formularios que coincidan con tu búsqueda.'}
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map((item, idx) => {
    const pkgName = (item.package || 'SIN PAQUETE').toUpperCase();
    const client = item.meta?.clientName || 'Sin nombre de cliente';
    const phone = item.meta?.clientPhone ? ` • 📞 ${item.meta.clientPhone}` : '';
    const addr = item.meta?.address || 'Sin dirección registrada';
    const inspector = item.meta?.inspectorName || 'Sin inspector asignado';
    const isCurrent = item.id === state.id;
    const st = computeStatsForFormState(item);

    return `
      <div style="border:${isCurrent ? '2px solid var(--brand-gold)' : '1px solid var(--border-color)'}; border-radius:12px; padding:12px 14px; display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:12px; background:${isCurrent ? '#FEFCE8' : '#FFFFFF'}; box-shadow:var(--shadow-xs);">
        <div style="flex:1; min-width:240px;">
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-bottom:4px;">
            <span style="font-size:0.75rem; font-weight:800; background:#18181B; color:#FACC15; padding:2px 8px; border-radius:6px;">#${idx + 1} • ${escapeHtml(item.meta?.folio || 'S/F')}</span>
            <span style="font-size:0.73rem; font-weight:800; background:#F4F4F5; color:#18181B; padding:2px 8px; border-radius:6px; border:1px solid #E4E4E7;">🛡️ ${escapeHtml(pkgName)}</span>
            <span style="font-size:0.73rem; font-weight:700; color:var(--text-secondary);">📅 ${escapeHtml(item.meta?.date || '')} ${escapeHtml(item.meta?.time || '')}</span>
            ${isCurrent ? '<span style="font-size:0.7rem; font-weight:800; color:#15803D; background:#DCFCE7; padding:2px 7px; border-radius:99px;">● Abierto actualmente</span>' : ''}
          </div>
          <div style="font-weight:800; font-size:0.92rem; color:var(--brand-black); margin-bottom:2px;">
            👤 ${escapeHtml(client)}${escapeHtml(phone)}
          </div>
          <div style="font-size:0.8rem; color:var(--text-secondary); margin-bottom:6px;">
            📍 ${escapeHtml(addr)}
            ${item.meta?.mapsUrl ? ` — <a href="${escapeAttr(item.meta.mapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#0284C7; font-weight:700;">🗺️ Ver en Maps</a>` : ''}
          </div>
          <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; font-size:0.75rem;">
            <span style="background:#DCFCE7; color:#166534; font-weight:700; padding:2px 8px; border-radius:6px;">✓ ${st.good} Buenos</span>
            <span style="background:#FEF3C7; color:#92400E; font-weight:700; padding:2px 8px; border-radius:6px;">⚠ ${st.warn} Regulares</span>
            <span style="background:#FEE2E2; color:#991B1B; font-weight:700; padding:2px 8px; border-radius:6px;">✕ ${st.bad} Urgentes</span>
            <span style="color:var(--text-muted); font-weight:600;">Avance: ${st.pct}% • Inspector: ${escapeHtml(inspector)}</span>
          </div>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap; align-items:center;">
          <button type="button" class="btn btn-primary btn-sm" onclick="loadFromHistory('${item.id}')" title="Abrir este formulario para ver o editar">
            ✏️ Abrir
          </button>
          <button type="button" class="btn btn-gold btn-sm" onclick="openPdfFromHistory('${item.id}')" title="Ver Informe PDF de este formulario">
            📄 PDF
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="exportSingleHistoryWorkbook('${item.id}')" title="Descargar Hoja Individual (.xlsx) de este formulario">
            📊 Hoja (.xlsx)
          </button>
          <button type="button" class="btn btn-danger-outline btn-sm" onclick="deleteFromHistory('${item.id}')" title="Eliminar de la base de datos">
            🗑️
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function loadFromHistory(id) {
  const list = getHistoryList();
  const found = list.find(x => x.id === id);
  if (!found) return;
  state = JSON.parse(JSON.stringify(found));
  saveState();
  renderAll();
  restoreSignaturesToCanvas();
  closeHistoryModal();
  showToast(`📂 Formulario ${state.meta?.folio || ''} cargado`, 'info');
}

function openPdfFromHistory(id) {
  loadFromHistory(id);
  toggleReportPreview(true);
}

function exportSingleHistoryWorkbook(id) {
  const list = getHistoryList();
  const found = list.find(x => x.id === id);
  if (!found) return;
  const prevState = JSON.parse(JSON.stringify(state));
  state = JSON.parse(JSON.stringify(found));
  downloadFinishedExcelWorkbook();
  state = prevState;
  saveState();
}

function deleteFromHistory(id) {
  if (!confirm('¿Eliminar este formulario de la Base de Datos?')) return;
  const list = getHistoryList().filter(x => x.id !== id);
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(list));
  updateHistoryCountBadge();
  renderHistoryModalList();
  showToast('🗑️ Formulario eliminado de la Base de Datos', 'info');
}

function resetNewInspection() {
  if (!confirm('¿Iniciar una nueva visita de inspección en blanco? El formulario actual quedará guardado automáticamente en tu Base de Datos (🗄️) y se desbloqueará la selección de paquete para la nueva visita.')) return;
  // Guarda automáticamente el formulario actual en la Base de Datos antes de reiniciar
  syncCurrentToDatabaseSilent();
  state = createDefaultState();
  clearSignature('inspector', true);
  clearSignature('client', true);
  saveState();
  renderAll();
  switchTab('tab-general');
  showToast('➕ Nueva visita iniciada (el formulario anterior quedó en tu Base de Datos)', 'success');
}

function exportInspectionJSON() {
  saveState();
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(state, null, 2));
  const a = document.createElement('a');
  const safeFolio = (state.meta.folio || 'inspeccion').replace(/[^a-zA-Z0-9_-]/g, '_');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `${safeFolio}_CLAVE.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function importInspectionJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const loaded = JSON.parse(e.target.result);
      if (loaded && loaded.meta && Array.isArray(loaded.rooms)) {
        state = loaded;
        saveState();
        renderAll();
        restoreSignaturesToCanvas();
        showToast(`✅ Formulario ${state.meta.folio} cargado y agregado a la Base de Datos`, 'success');
      } else if (Array.isArray(loaded)) {
        // Si el usuario subió un respaldo de toda la base de datos en este botón, también lo soporta
        mergeDatabaseArray(loaded);
      } else {
        alert('El archivo no tiene el formato válido de inspección de CLAVE CONSTRUCCIÓN.');
      }
    } catch (err) {
      alert('Error al leer el archivo JSON.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function exportFullDatabaseJSON() {
  syncCurrentToDatabaseSilent();
  const list = getHistoryList();
  if (list.length === 0) {
    alert('Aún no hay formularios registrados en la Base de Datos.');
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(list, null, 2));
  const a = document.createElement('a');
  a.setAttribute('href', dataStr);
  a.setAttribute('download', `Base_de_Datos_CLAVE_${today}.json`);
  document.body.appendChild(a);
  a.click();
  a.remove();
  showToast(`📥 Respaldo completo de Base de Datos (${list.length} formularios) descargado`, 'success');
}

function mergeDatabaseArray(importedList) {
  const currentList = getHistoryList();
  let added = 0;
  let updated = 0;
  importedList.forEach(entry => {
    if (!entry || !entry.meta || !Array.isArray(entry.rooms)) return;
    const idx = currentList.findIndex(x => x.id === entry.id || (x.meta?.folio && x.meta.folio === entry.meta?.folio));
    if (idx >= 0) {
      currentList[idx] = entry;
      updated++;
    } else {
      currentList.push(entry);
      added++;
    }
  });
  localStorage.setItem(STORAGE_HISTORY_KEY, JSON.stringify(currentList));
  updateHistoryCountBadge();
  renderHistoryModalList();
  showToast(`🗄️ Base de Datos actualizada: ${added} nuevos, ${updated} actualizados`, 'success');
}

function importFullDatabaseJSON(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const parsed = JSON.parse(e.target.result);
      if (Array.isArray(parsed)) {
        mergeDatabaseArray(parsed);
      } else if (parsed && parsed.meta && Array.isArray(parsed.rooms)) {
        mergeDatabaseArray([parsed]);
      } else {
        alert('El archivo no contiene una Base de Datos válida de CLAVE CONSTRUCCIÓN.');
      }
    } catch (err) {
      alert('Error al leer el archivo de Base de Datos.');
    }
  };
  reader.readAsText(file);
  event.target.value = '';
}

// ============================================================================
// SELECCIÓN DE PAQUETE (BLOQUEO UNA VEZ SELECCIONADO) Y PESTAÑAS
// ============================================================================

let roomFilterMode = 'all'; // 'all' | 'pending' | 'issues'
const collapsedCategories = {};

function showToast(msg) {
  const cont = document.getElementById('toast-container');
  if (!cont) return;
  const el = document.createElement('div');
  el.className = 'toast-item';
  el.innerHTML = `<span>${escapeHtml(msg)}</span>`;
  cont.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(8px)';
    el.style.transition = 'all 0.2s ease';
    setTimeout(() => el.remove(), 220);
  }, 3000);
}

function selectPackage(pkg) {
  // Si el paquete ya fue bloqueado en esta visita, no permitir cambiarlo
  if (state.packageLocked && state.package) {
    return;
  }
  state.package = pkg;
  state.packageLocked = true;
  saveState();
  syncPackageUI();
  renderActiveRoomPanel();
  renderFindingsSummary();
  showToast(`🔒 Nivel de servicio fijado en: ${pkg.toUpperCase()}`);
}

function togglePackageDetailsView() {
  const section = document.getElementById('package-selector-section');
  const btn = document.getElementById('btn-toggle-pkg-details');
  if (!section) return;
  const isShowing = section.classList.toggle('show-details');
  if (btn) {
    btn.textContent = isShowing ? '🔼 Ocultar alcance' : '👁️ Ver alcance';
  }
}

function syncPackageUI() {
  const isLocked = Boolean(state.packageLocked && state.package);
  const section = document.getElementById('package-selector-section');
  const toggleBtn = document.getElementById('btn-toggle-pkg-details');

  if (section) {
    section.classList.toggle('compact-locked', isLocked);
    section.classList.toggle('unselected-pulse', !isLocked);
    if (!isLocked) section.classList.remove('show-details');
  }
  if (toggleBtn) {
    toggleBtn.style.display = isLocked ? 'inline-flex' : 'none';
  }

  ['esencial', 'integral', 'premium'].forEach(p => {
    const card = document.getElementById(`pkg-card-${p}`);
    if (!card) return;
    const isSelected = state.package === p && isLocked;
    card.classList.toggle('active', isSelected);
    card.classList.toggle('disabled-pkg', isLocked && state.package !== p);
  });

  const lockStatusEl = document.getElementById('pkg-lock-status');
  if (lockStatusEl) {
    if (isLocked) {
      lockStatusEl.innerHTML = `<span class="package-locked-pill">🔒 Servicio Fijo: ${state.package.toUpperCase()} (Bloqueado)</span>`;
    } else {
      lockStatusEl.innerHTML = `<span style="font-weight:700; color:var(--brand-gold-hover);">👆 Paso inicial: Elige el paquete contratado (una vez seleccionado quedará bloqueado)</span>`;
    }
  }

  const pkgNames = {
    esencial: 'Paquete Fijo: Esencial',
    integral: 'Paquete Fijo: Integral (Con Dron y Humedad)',
    premium: 'Paquete Fijo: Premium (Completo + Dictamen Legal)'
  };
  const bottomInd = document.getElementById('bottom-pkg-indicator');
  if (bottomInd) {
    bottomInd.textContent = isLocked ? (pkgNames[state.package] || '') : 'Paquete: Pendiente de elegir';
  }

  // Mostrar/ocultar pestañas según el paquete seleccionado
  const effectivePkg = state.package || 'esencial';
  const isIntegralOrHigher = effectivePkg === 'integral' || effectivePkg === 'premium';
  const isPremium = effectivePkg === 'premium';

  const tabIntegral = document.getElementById('nav-tab-integral');
  const tabPremium = document.getElementById('nav-tab-premium');
  if (tabIntegral) {
    tabIntegral.style.display = isIntegralOrHigher ? 'inline-flex' : 'none';
  }
  if (tabPremium) {
    tabPremium.style.display = isPremium ? 'inline-flex' : 'none';
  }

  const mobIntegral = document.getElementById('mob-tab-integral');
  const mobPremium = document.getElementById('mob-tab-premium');
  if (mobIntegral) {
    mobIntegral.style.display = isIntegralOrHigher ? 'flex' : 'none';
  }
  if (mobPremium) {
    mobPremium.style.display = isPremium ? 'flex' : 'none';
  }

  const intBanner = document.getElementById('integral-locked-banner');
  const intContent = document.getElementById('integral-content-wrapper');
  if (intBanner && intContent) {
    intBanner.style.display = 'none';
    intContent.style.opacity = '1';
    intContent.style.pointerEvents = 'auto';
  }

  const premBanner = document.getElementById('premium-locked-banner');
  const premContent = document.getElementById('premium-content-wrapper');
  if (premBanner && premContent) {
    premBanner.style.display = 'none';
    premContent.style.opacity = '1';
    premContent.style.pointerEvents = 'auto';
  }

  const sigLabel = document.getElementById('sig-inspector-label');
  if (sigLabel) {
    sigLabel.textContent = isPremium
      ? 'Firma del Ingeniero / Arquitecto Colegiado'
      : 'Firma del Inspector Técnico';
  }
}

function toggleMobileMenu() {
  const drawer = document.getElementById('navbar-actions-drawer');
  const btn = document.getElementById('btn-mobile-menu');
  if (!drawer) return;
  const isOpen = drawer.classList.toggle('mobile-open');
  if (btn) {
    btn.textContent = isOpen ? '✕ Cerrar' : '☰ Menú';
  }
}

function closeMobileMenu() {
  const drawer = document.getElementById('navbar-actions-drawer');
  const btn = document.getElementById('btn-mobile-menu');
  if (drawer) drawer.classList.remove('mobile-open');
  if (btn) btn.textContent = '☰ Menú';
}

function switchTab(tabId) {
  state.activeTab = tabId;
  document.querySelectorAll('.tab-panel').forEach(panel => {
    panel.style.display = panel.id === tabId ? 'block' : 'none';
  });
  document.querySelectorAll('#main-tabs .nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  document.querySelectorAll('#mobile-bottom-nav .mob-nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  closeMobileMenu();
  if (tabId === 'tab-closing') {
    renderFindingsSummary();
    setTimeout(resizeSignatureCanvases, 50);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
  saveState();
}

function goNextFromRooms() {
  if (state.package === 'esencial' || !state.package) {
    switchTab('tab-closing');
  } else {
    switchTab('tab-integral');
  }
}

function goNextFromIntegral() {
  if (state.package === 'premium') {
    switchTab('tab-premium');
  } else {
    switchTab('tab-closing');
  }
}

// ============================================================================
// 1. DATOS GENERALES (META)
// ============================================================================

function syncMetaInputs() {
  const fields = [
    'folio', 'date', 'time', 'purpose', 'clientName', 'clientPhone',
    'clientEmail', 'accompaniedBy', 'address', 'coordinates', 'mapsUrl',
    'propertyType', 'areaM2', 'levels', 'age', 'occupancy', 'weather',
    'inspectorName', 'generalNotes'
  ];
  fields.forEach(f => {
    const el = document.getElementById(`meta-${f}`);
    if (el) {
      el.value = state.meta[f] || '';
      el.classList.toggle('filled-green', Boolean(state.meta[f] && String(state.meta[f]).trim()));
    }
  });

  const headerFolio = document.getElementById('header-folio-display');
  if (headerFolio) {
    headerFolio.textContent = `Folio: ${state.meta.folio || 'Sin Folio'} • ${state.meta.clientName || 'Registro Digital de Visita'}`;
  }

  refreshGoogleMapEmbed();
  renderCoverPhotoPreview();
}

function updateMeta(field, value) {
  state.meta[field] = value;
  const el = document.getElementById(`meta-${field}`);
  if (el) {
    el.classList.toggle('filled-green', Boolean(value && String(value).trim()));
  }
  if (field === 'folio' || field === 'clientName') {
    const headerFolio = document.getElementById('header-folio-display');
    if (headerFolio) {
      headerFolio.textContent = `Folio: ${state.meta.folio || 'Sin Folio'} • ${state.meta.clientName || 'Registro Digital de Visita'}`;
    }
  }
  if (field === 'mapsUrl') {
    const openBtn = document.getElementById('btn-open-gmaps');
    if (openBtn) {
      openBtn.href = value || '#';
      openBtn.style.display = value ? 'inline-flex' : 'none';
    }
  }
  saveState();
}

function geolocatePropertyGPS() {
  if (!navigator.geolocation) {
    showToast('❌ Tu navegador no soporta geolocalización GPS');
    return;
  }

  const btn = document.getElementById('btn-geolocate-gps');
  const origText = btn ? btn.innerHTML : '';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '⏳ Obteniendo GPS...';
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude.toFixed(6);
      const lng = pos.coords.longitude.toFixed(6);
      const coordsStr = `${lat}, ${lng}`;
      const gmapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

      state.meta.coordinates = coordsStr;
      state.meta.mapsUrl = gmapsLink;

      const coordEl = document.getElementById('meta-coordinates');
      const urlEl = document.getElementById('meta-mapsUrl');
      if (coordEl) {
        coordEl.value = coordsStr;
        coordEl.classList.add('filled-green');
      }
      if (urlEl) {
        urlEl.value = gmapsLink;
        urlEl.classList.add('filled-green');
      }

      refreshGoogleMapEmbed();
      saveState();
      showToast(`📍 Ubicación GPS capturada (${coordsStr})`);

      // Intentar obtener la dirección postal automáticamente si el campo de dirección está vacío
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
          headers: { 'Accept-Language': 'es' }
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.display_name && !state.meta.address?.trim()) {
            state.meta.address = data.display_name;
            const addrEl = document.getElementById('meta-address');
            if (addrEl) {
              addrEl.value = data.display_name;
              addrEl.classList.add('filled-green');
            }
            saveState();
            showToast('🏠 Dirección autocompletada con éxito');
          }
        }
      } catch (e) {
        // Silencioso si no hay red para geocodificación inversa
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
    },
    (err) => {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = origText;
      }
      let msg = 'No se pudo obtener la ubicación GPS. Asegúrate de permitir el acceso a la ubicación en tu navegador/teléfono.';
      if (err.code === 1) msg = 'Permiso de ubicación denegado. Actívalo en el candado de la barra de direcciones.';
      showToast(`⚠️ ${msg}`);
    },
    { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
  );
}

function locateAddressOnGoogleMaps() {
  const addr = (state.meta.address || '').trim();
  const coords = (state.meta.coordinates || '').trim();
  const query = addr || coords;

  if (!query) {
    showToast('⚠️ Escribe primero la dirección del inmueble o usa el botón de GPS');
    return;
  }

  const gmapsLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
  state.meta.mapsUrl = gmapsLink;

  const urlEl = document.getElementById('meta-mapsUrl');
  if (urlEl) {
    urlEl.value = gmapsLink;
    urlEl.classList.add('filled-green');
  }

  refreshGoogleMapEmbed(query);
  saveState();
  showToast('🗺️ Ubicación cargada en Google Maps');
}

function refreshGoogleMapEmbed(forcedQuery) {
  const wrapper = document.getElementById('google-map-wrapper');
  const iframe = document.getElementById('google-map-iframe');
  const openBtn = document.getElementById('btn-open-gmaps');

  const coords = (state.meta.coordinates || '').trim();
  const addr = (state.meta.address || '').trim();
  const mapsUrl = (state.meta.mapsUrl || '').trim();

  if (openBtn) {
    const targetHref = mapsUrl || (coords ? `https://www.google.com/maps?q=${encodeURIComponent(coords)}` : (addr ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}` : ''));
    openBtn.href = targetHref || '#';
    openBtn.style.display = targetHref ? 'inline-flex' : 'none';
  }

  const embedQuery = forcedQuery || coords || (mapsUrl ? addr : '');
  if (!wrapper || !iframe) return;

  if (embedQuery) {
    const newSrc = `https://maps.google.com/maps?q=${encodeURIComponent(embedQuery)}&t=m&z=17&ie=UTF8&iwloc=&output=embed`;
    if (iframe.dataset.lastQuery !== embedQuery) {
      iframe.src = newSrc;
      iframe.dataset.lastQuery = embedQuery;
    }
    wrapper.style.display = 'block';
  } else {
    wrapper.style.display = 'none';
  }
}

function handleCoverPhotoUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  compressImageFile(file, 900, 0.78, (dataUrl) => {
    state.meta.coverPhoto = dataUrl;
    renderCoverPhotoPreview();
    saveState();
    showToast('📷 Foto de portada agregada');
  });
  event.target.value = '';
}

function renderCoverPhotoPreview() {
  const container = document.getElementById('cover-photo-preview');
  if (!container) return;
  if (!state.meta.coverPhoto) {
    container.innerHTML = '';
    return;
  }
  container.innerHTML = `
    <div class="photo-thumb-card">
      <img src="${state.meta.coverPhoto}" alt="Portada" />
      <button type="button" class="photo-remove-btn" onclick="removeCoverPhoto()">✕</button>
    </div>
  `;
}

function removeCoverPhoto() {
  state.meta.coverPhoto = null;
  renderCoverPhotoPreview();
  saveState();
}

// ============================================================================
// 2. EQUIPOS CENTRALES Y EXTERIOR
// ============================================================================

function toggleCategoryCollapse(catKey) {
  collapsedCategories[catKey] = !collapsedCategories[catKey];
  const block = document.getElementById(`cat-block-${catKey}`);
  if (block) {
    block.classList.toggle('collapsed', Boolean(collapsedCategories[catKey]));
  }
}

function renderSystemsChecklist() {
  const container = document.getElementById('systems-checklist-container');
  if (!container) return;

  container.innerHTML = SYSTEMS_SCHEMA.map(cat => {
    const total = cat.items.length;
    const done = cat.items.filter(it => {
      const r = state.systems[it.id];
      return r && (r.status || (Array.isArray(r.selectedTags) && r.selectedTags.length > 0));
    }).length;
    const isComplete = done === total && total > 0;
    const catKey = `sys_${cat.categoryId}`;
    const isCollapsed = Boolean(collapsedCategories[catKey]);

    return `
      <div class="category-block ${isCollapsed ? 'collapsed' : ''}" id="cat-block-${catKey}">
        <div class="category-block-header" onclick="toggleCategoryCollapse('${catKey}')">
          <div class="category-block-title">${cat.categoryTitle}</div>
          <span class="cat-progress-pill ${isComplete ? 'complete' : ''}">
            ${isComplete ? '✓ Completado' : `${done}/${total} revisados`}
          </span>
        </div>
        <div class="category-items-body">
          ${cat.items.map(item => renderChecklistItemHTML('systems', item, state.systems[item.id])).join('')}
        </div>
      </div>
    `;
  }).join('');
}

function markAllSystemsGood() {
  SYSTEMS_SCHEMA.forEach(cat => {
    cat.items.forEach(item => {
      if (!state.systems[item.id] || !state.systems[item.id].status) {
        state.systems[item.id] = state.systems[item.id] || { status: '', notes: '', selectedTags: [], photos: [] };
        state.systems[item.id].status = 'good';
      }
    });
  });
  saveState();
  renderSystemsChecklist();
  showToast('✅ Equipos sin observaciones marcados como Bueno');
}

// ============================================================================
// 3. REVISIÓN POR ÁREA / HABITACIÓN (OPCIÓN B)
// ============================================================================

function renderRoomsSidebar() {
  const listEl = document.getElementById('room-sidebar-list');
  const badgeEl = document.getElementById('rooms-count-badge');
  if (badgeEl) badgeEl.textContent = state.rooms.length;
  if (!listEl) return;

  if (!state.rooms.find(r => r.id === state.activeRoomId) && state.rooms.length > 0) {
    state.activeRoomId = state.rooms[0].id;
  }

  listEl.innerHTML = state.rooms.map((room, index) => {
    const isActive = room.id === state.activeRoomId;
    const stats = getRoomStats(room);
    const pct = stats.total > 0 ? Math.round((stats.evaluated / stats.total) * 100) : 0;

    let indicatorHTML = `<span style="font-size:0.72rem; opacity:0.85;">${stats.evaluated}/${stats.total}</span>`;
    if (stats.bad > 0) {
      indicatorHTML += `<span class="status-dot" style="background:var(--status-bad);" title="${stats.bad} urgente(s)"></span>`;
    } else if (stats.warn > 0) {
      indicatorHTML += `<span class="status-dot" style="background:var(--status-warn);" title="${stats.warn} regular(es)"></span>`;
    } else if (stats.evaluated > 0 && stats.evaluated === stats.total) {
      indicatorHTML += `<span class="status-dot" style="background:var(--status-good);" title="Completo"></span>`;
    }

    return `
      <button type="button" class="room-item-btn ${isActive ? 'active' : ''}" onclick="selectRoom('${room.id}')">
        <div class="room-item-top">
          <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${index + 1}. ${escapeHtml(room.name)}</span>
          <span class="room-status-dots">${indicatorHTML}</span>
        </div>
        <div class="room-mini-progress">
          <div class="room-mini-progress-fill" style="width:${pct}%;"></div>
        </div>
      </button>
    `;
  }).join('');
}

function selectRoom(roomId) {
  state.activeRoomId = roomId;
  renderRoomsSidebar();
  renderActiveRoomPanel();
  saveState();
}

function setRoomFilterMode(mode) {
  roomFilterMode = mode;
  renderActiveRoomPanel();
}

function getActiveCategoriesForRoom(room) {
  const isIntegralOrHigher = state.package === 'integral' || state.package === 'premium';
  return ROOM_CATEGORIES_SCHEMA.filter(cat => {
    if (cat.integralOnly && !isIntegralOrHigher) return false;
    if (cat.categoryId === 'hidraulica' && !room.hasPlumbing) return false;
    return true;
  });
}

function getRoomStats(room) {
  const cats = getActiveCategoriesForRoom(room);
  let total = 0;
  let evaluated = 0;
  let good = 0;
  let warn = 0;
  let bad = 0;

  cats.forEach(cat => {
    cat.items.forEach(item => {
      total++;
      const entry = room.items?.[item.id];
      const hasTags = Array.isArray(entry?.selectedTags) && entry.selectedTags.length > 0;
      if (entry && (entry.status || hasTags)) {
        evaluated++;
        if (entry.status === 'good') good++;
        if (entry.status === 'warn') warn++;
        if (entry.status === 'bad') bad++;
      }
    });
  });

  return { total, evaluated, good, warn, bad };
}

function renderActiveRoomPanel() {
  const panel = document.getElementById('active-room-panel');
  if (!panel) return;

  const room = state.rooms.find(r => r.id === state.activeRoomId);
  if (!room) {
    panel.innerHTML = `<div class="card">No hay habitaciones registradas. Haz clic en "+ Agregar" para crear una.</div>`;
    return;
  }

  const activeCategories = getActiveCategoriesForRoom(room);
  const stats = getRoomStats(room);

  panel.innerHTML = `
    <div class="card">
      <div class="section-header-row" style="border-bottom:1px solid var(--border-color); padding-bottom:14px; margin-bottom:14px;">
        <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap; flex:1;">
          <input
            type="text"
            class="form-control"
            style="font-size:1.05rem; font-weight:800; max-width:290px;"
            value="${escapeHtml(room.name)}"
            oninput="renameActiveRoom(this.value)"
            title="Editar nombre del área o habitación"
          />
          <label style="display:inline-flex; align-items:center; gap:6px; font-size:0.8rem; font-weight:700; color:var(--text-secondary); cursor:pointer; background:var(--bg-subtle); padding:7px 11px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
            <input type="checkbox" ${room.hasPlumbing ? 'checked' : ''} onchange="toggleRoomPlumbing(this.checked)" />
            💧 Con instalaciones de agua/drenaje
          </label>
        </div>

        <div style="display:flex; gap:6px; flex-wrap:wrap;">
          <button type="button" class="btn btn-green btn-sm" onclick="markRoomAllGood('${room.id}')" title="Marcar los puntos vacíos de esta habitación como Bueno">
            ✅ Marcar Resto como Bueno
          </button>
          <button type="button" class="btn btn-outline btn-sm" onclick="duplicateRoom('${room.id}')" title="Duplicar área (ej. para otra recámara o baño)">
            📋 Duplicar
          </button>
          ${state.rooms.length > 1 ? `
            <button type="button" class="btn btn-danger-outline btn-sm" onclick="deleteRoom('${room.id}')">
              🗑️ Eliminar
            </button>
          ` : ''}
        </div>
      </div>

      <!-- BARRA DE FILTRO RÁPIDO EN LA HABITACIÓN -->
      <div class="filter-bar">
        <div class="filter-pills">
          <button type="button" class="filter-pill ${roomFilterMode === 'all' ? 'active' : ''}" onclick="setRoomFilterMode('all')">
            Todos (${stats.total})
          </button>
          <button type="button" class="filter-pill ${roomFilterMode === 'pending' ? 'active' : ''}" onclick="setRoomFilterMode('pending')">
            Pendientes (${stats.total - stats.evaluated})
          </button>
          <button type="button" class="filter-pill ${roomFilterMode === 'issues' ? 'active' : ''}" onclick="setRoomFilterMode('issues')">
            Con Hallazgos ⚠️/❌ (${stats.warn + stats.bad})
          </button>
        </div>
        <span style="font-size:0.75rem; color:var(--text-muted); font-weight:600;">
          Toca cualquier encabezado de categoría para contraer/expandir
        </span>
      </div>

      ${activeCategories.map(cat => {
        const filteredItems = cat.items.filter(item => {
          const entry = room.items[item.id];
          const isEval = Boolean(entry && (entry.status || (Array.isArray(entry.selectedTags) && entry.selectedTags.length > 0)));
          if (roomFilterMode === 'pending') return !isEval;
          if (roomFilterMode === 'issues') return entry && (entry.status === 'warn' || entry.status === 'bad');
          return true;
        });

        if (filteredItems.length === 0) return '';

        const catTotal = cat.items.length;
        const catDone = cat.items.filter(it => {
          const r = room.items[it.id];
          return r && (r.status || (Array.isArray(r.selectedTags) && r.selectedTags.length > 0));
        }).length;
        const isCatComplete = catDone === catTotal && catTotal > 0;
        const catKey = `room_${room.id}_${cat.categoryId}`;
        const isCollapsed = Boolean(collapsedCategories[catKey]);

        return `
          <div class="category-block ${isCollapsed ? 'collapsed' : ''}" id="cat-block-${catKey}">
            <div class="category-block-header" onclick="toggleCategoryCollapse('${catKey}')">
              <div class="category-block-title">${cat.categoryTitle}</div>
              <span class="cat-progress-pill ${isCatComplete ? 'complete' : ''}">
                ${isCatComplete ? '✓ Completado' : `${catDone}/${catTotal} revisados`}
              </span>
            </div>
            <div class="category-items-body">
              ${filteredItems.map(item => renderChecklistItemHTML(`room:${room.id}`, item, room.items[item.id])).join('')}
            </div>
          </div>
        `;
      }).join('')}

      <div class="form-group" style="margin-top:12px;">
        <label>Notas u Observaciones Generales de "${escapeHtml(room.name)}"</label>
        <textarea
          class="form-control"
          placeholder="Observaciones adicionales sobre este espacio en particular..."
          oninput="updateRoomGeneralNote('${room.id}', this.value)"
        >${escapeHtml(room.generalObservation || '')}</textarea>
      </div>
    </div>
  `;
}

function renameActiveRoom(newName) {
  const room = state.rooms.find(r => r.id === state.activeRoomId);
  if (!room) return;
  room.name = newName;
  renderRoomsSidebar();
  saveState();
}

function toggleRoomPlumbing(checked) {
  const room = state.rooms.find(r => r.id === state.activeRoomId);
  if (!room) return;
  room.hasPlumbing = Boolean(checked);
  renderRoomsSidebar();
  renderActiveRoomPanel();
  saveState();
}

function updateRoomGeneralNote(roomId, value) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  room.generalObservation = value;
  saveState();
}

function markRoomAllGood(roomId) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  const cats = getActiveCategoriesForRoom(room);
  cats.forEach(cat => {
    cat.items.forEach(item => {
      if (!room.items[item.id] || !room.items[item.id].status) {
        room.items[item.id] = room.items[item.id] || { status: '', notes: '', selectedTags: [], photos: [] };
        room.items[item.id].status = 'good';
      }
    });
  });
  saveState();
  renderRoomsSidebar();
  renderActiveRoomPanel();
  showToast(`✅ Puntos restantes de "${room.name}" marcados como Bueno`);
}

function duplicateRoom(roomId) {
  const room = state.rooms.find(r => r.id === roomId);
  if (!room) return;
  const newRoom = createRoomObject(room.type, `${room.name} (Copia)`, room.hasPlumbing);
  state.rooms.push(newRoom);
  state.activeRoomId = newRoom.id;
  saveState();
  renderRoomsSidebar();
  renderActiveRoomPanel();
  showToast(`📋 Área "${newRoom.name}" creada`);
}

function deleteRoom(roomId) {
  if (state.rooms.length <= 1) return;
  const room = state.rooms.find(r => r.id === roomId);
  if (!confirm(`¿Seguro que deseas eliminar "${room?.name}" de la inspección?`)) return;
  state.rooms = state.rooms.filter(r => r.id !== roomId);
  state.activeRoomId = state.rooms[0].id;
  saveState();
  renderRoomsSidebar();
  renderActiveRoomPanel();
}

function openAddRoomModal() {
  suggestRoomName();
  document.getElementById('modal-add-room').classList.add('open');
}

function closeAddRoomModal() {
  document.getElementById('modal-add-room').classList.remove('open');
}

function suggestRoomName() {
  const typeSelect = document.getElementById('new-room-type');
  const nameInput = document.getElementById('new-room-name');
  if (!typeSelect || !nameInput) return;

  const typeLabels = {
    recamara: 'Recámara',
    bano: 'Baño Completo',
    medio_bano: 'Medio Baño',
    cocina: 'Cocina',
    sala_comedor: 'Sala - Comedor',
    patio: 'Patio de Servicio',
    exterior: 'Jardín / Terraza',
    cochera: 'Cochera',
    escaleras: 'Escaleras / Pasillo',
    estudio: 'Estudio / Sala TV'
  };

  const baseName = typeLabels[typeSelect.value] || 'Área';
  const countSameType = state.rooms.filter(r => r.type === typeSelect.value).length;
  nameInput.value = countSameType > 0 ? `${baseName} ${countSameType + 1}` : baseName;
}

function confirmAddRoom() {
  const type = document.getElementById('new-room-type').value;
  const rawName = document.getElementById('new-room-name').value.trim();
  const name = rawName || 'Nueva Área';
  const plumbingTypes = ['bano', 'medio_bano', 'cocina', 'patio'];
  const hasPlumbing = plumbingTypes.includes(type);

  const newRoom = createRoomObject(type, name, hasPlumbing);
  state.rooms.push(newRoom);
  state.activeRoomId = newRoom.id;
  saveState();
  renderRoomsSidebar();
  renderActiveRoomPanel();
  closeAddRoomModal();
  showToast(`🏠 Se agregó "${name}"`);
}

// ============================================================================
// 4. MÓDULOS INTEGRAL (DRON + HUMEDAD Y ÁREAS DE DIFÍCIL ACCESO)
// ============================================================================

function renderIntegralModules() {
  // Inputs de Dron y Humedad
  const dEq = document.getElementById('drone-equipment');
  const dCond = document.getElementById('drone-conditions');
  const dUrl = document.getElementById('drone-videoUrl');
  if (dEq) dEq.value = state.drone.equipment || '';
  if (dCond) dCond.value = state.drone.conditions || '';
  if (dUrl) dUrl.value = state.drone.videoUrl || '';

  const mTools = document.getElementById('moisture-tools');
  const mMax = document.getElementById('moisture-maxReading');
  if (mTools) mTools.value = state.moisture.tools || '';
  if (mMax) mMax.value = state.moisture.maxReading || '';

  // Checklists
  const droneCont = document.getElementById('drone-checklist-container');
  if (droneCont) {
    droneCont.innerHTML = `
      <div class="category-block">
        <div class="category-block-header">
          <div class="category-block-title">🚁 Puntos de Inspección Aérea con Dron</div>
        </div>
        <div class="category-items-body">
          ${DRONE_SCHEMA.map(item => renderChecklistItemHTML('drone', item, state.drone.items[item.id])).join('')}
        </div>
      </div>
    `;
  }

  const moistCont = document.getElementById('moisture-checklist-container');
  if (moistCont) {
    moistCont.innerHTML = `
      <div class="category-block">
        <div class="category-block-header">
          <div class="category-block-title">💧🔦 Puntos de Humedad, Filtraciones y Áreas de Difícil Acceso</div>
        </div>
        <div class="category-items-body">
          ${MOISTURE_SCHEMA.map(item => renderChecklistItemHTML('moisture', item, state.moisture.items[item.id])).join('')}
        </div>
      </div>
    `;
  }
}

// ============================================================================
// 5. MÓDULOS PREMIUM (TOUR 360° + DICTAMEN LEGAL COLEGIADO)
// ============================================================================

function renderPremiumModules() {
  const p = state.premium || {};
  const map = {
    'tour-url': p.tourUrl,
    'tour-camera': p.tourCamera,
    'tour-scenesCount': p.tourScenesCount,
    'tour-notes': p.tourNotes,
    'legal-profName': p.profName,
    'legal-profTitle': p.profTitle || 'Ingeniero Civil',
    'legal-cedula': p.cedula,
    'legal-colegio': p.colegio,
    'legal-verdict': p.verdict || 'ÓPTIMO / HABITABLE SIN RIESGOS APARENTES',
    'legal-conclusion': p.conclusion,
    'legal-declaration': p.declaration
  };

  Object.entries(map).forEach(([elId, val]) => {
    const el = document.getElementById(elId);
    if (el) el.value = val || '';
  });
}

function updateModuleField(mod, field, value) {
  if (!state[mod]) state[mod] = {};
  state[mod][field] = value;
  saveState();
}

// ============================================================================
// COMPONENTE REUTILIZABLE DE ITEM DE CHECKLIST (ESTADOS, CHIPS, FOTOS)
// ============================================================================

function renderChecklistItemHTML(scope, itemSchema, entryData) {
  const entry = entryData || { status: '', notes: '', selectedTags: [], photos: [] };
  const st = entry.status || '';
  const notes = entry.notes || '';
  const selectedTags = Array.isArray(entry.selectedTags) ? entry.selectedTags : [];
  const photos = entry.photos || [];
  const isAnswered = Boolean(st || selectedTags.length > 0);

  let rowStatusClass = '';
  if (st === 'bad') rowStatusClass = 'status-row-bad';
  else if (st === 'warn') rowStatusClass = 'status-row-warn';
  else if (isAnswered) rowStatusClass = 'answered-row';

  const tagsHTML = (itemSchema.tags || []).map(tag => {
    const isSelected = selectedTags.includes(tag) || (notes && notes.includes(tag));
    return `
      <button
        type="button"
        class="chip ${isSelected ? 'selected-green' : ''}"
        onclick="appendQuickTag('${scope}', '${itemSchema.id}', '${escapeAttr(tag)}')"
      >
        ${isSelected ? '✓' : '+'} ${escapeHtml(tag)}
      </button>
    `;
  }).join('');

  const photosHTML = photos.map((photoUrl, idx) => `
    <div class="photo-thumb-card">
      <img src="${photoUrl}" alt="Evidencia" />
      <button type="button" class="photo-remove-btn" onclick="removeItemPhoto('${scope}', '${itemSchema.id}', ${idx})">✕</button>
    </div>
  `).join('');

  return `
    <div class="checklist-item ${rowStatusClass}" id="item-${scope}-${itemSchema.id}">
      <div class="checklist-item-top">
        <div class="item-info">
          <div class="item-title">${escapeHtml(itemSchema.title)}</div>
          <div class="item-hint">${escapeHtml(itemSchema.hint)}</div>
        </div>

        <div class="status-selector">
          <button type="button" class="status-btn ${st === 'good' ? 'active-good' : ''}" onclick="setItemStatus('${scope}', '${itemSchema.id}', 'good')">
            ✅ Bueno
          </button>
          <button type="button" class="status-btn ${st === 'warn' ? 'active-warn' : ''}" onclick="setItemStatus('${scope}', '${itemSchema.id}', 'warn')">
            ⚠️ Regular
          </button>
          <button type="button" class="status-btn ${st === 'bad' ? 'active-bad' : ''}" onclick="setItemStatus('${scope}', '${itemSchema.id}', 'bad')">
            ❌ Malo
          </button>
          <button type="button" class="status-btn ${st === 'na' ? 'active-na' : ''}" onclick="setItemStatus('${scope}', '${itemSchema.id}', 'na')">
            ➖ N/A
          </button>
        </div>
      </div>

      <div class="item-details-drawer">
        ${tagsHTML ? `
          <div class="quick-tags">
            <span class="quick-tags-label">Opciones múltiples:</span>
            ${tagsHTML}
          </div>
        ` : ''}

        <div class="item-notes-row">
          <input
            type="text"
            class="item-notes-input"
            id="note-input-${scope}-${itemSchema.id}"
            placeholder="Observaciones adicionales o ubicación exacta..."
            value="${escapeHtml(notes)}"
            oninput="setItemNotes('${scope}', '${itemSchema.id}', this.value)"
          />
          <label class="photo-upload-label">
            📷 Foto (${photos.length})
            <input
              type="file"
              accept="image/*"
              multiple
              style="display:none;"
              onchange="handleItemPhotoUpload(event, '${scope}', '${itemSchema.id}')"
            />
          </label>
        </div>

        ${photos.length > 0 ? `<div class="photo-thumbs">${photosHTML}</div>` : ''}
      </div>
    </div>
  `;
}

function getTargetRecord(scope, itemId) {
  if (scope === 'systems') {
    if (!state.systems[itemId]) state.systems[itemId] = { status: '', notes: '', selectedTags: [], photos: [] };
    if (!Array.isArray(state.systems[itemId].selectedTags)) state.systems[itemId].selectedTags = [];
    return state.systems[itemId];
  }
  if (scope === 'drone') {
    if (!state.drone.items[itemId]) state.drone.items[itemId] = { status: '', notes: '', selectedTags: [], photos: [] };
    if (!Array.isArray(state.drone.items[itemId].selectedTags)) state.drone.items[itemId].selectedTags = [];
    return state.drone.items[itemId];
  }
  if (scope === 'moisture') {
    if (!state.moisture.items[itemId]) state.moisture.items[itemId] = { status: '', notes: '', selectedTags: [], photos: [] };
    if (!Array.isArray(state.moisture.items[itemId].selectedTags)) state.moisture.items[itemId].selectedTags = [];
    return state.moisture.items[itemId];
  }
  if (scope.startsWith('room:')) {
    const roomId = scope.split(':')[1];
    const room = state.rooms.find(r => r.id === roomId);
    if (!room) return null;
    if (!room.items[itemId]) room.items[itemId] = { status: '', notes: '', selectedTags: [], photos: [] };
    if (!Array.isArray(room.items[itemId].selectedTags)) room.items[itemId].selectedTags = [];
    return room.items[itemId];
  }
  return null;
}

function refreshScopeUI(scope) {
  if (scope === 'systems') renderSystemsChecklist();
  else if (scope === 'drone' || scope === 'moisture') renderIntegralModules();
  else if (scope.startsWith('room:')) {
    renderRoomsSidebar();
    renderActiveRoomPanel();
  }
}

function setItemStatus(scope, itemId, statusVal) {
  const rec = getTargetRecord(scope, itemId);
  if (!rec) return;
  rec.status = rec.status === statusVal ? '' : statusVal;
  saveState();
  refreshScopeUI(scope);
}

function setItemNotes(scope, itemId, text) {
  const rec = getTargetRecord(scope, itemId);
  if (!rec) return;
  rec.notes = text;
  saveState();
}

function appendQuickTag(scope, itemId, tagText) {
  const rec = getTargetRecord(scope, itemId);
  if (!rec) return;

  const isAlreadySelected = rec.selectedTags.includes(tagText) || (rec.notes && rec.notes.includes(tagText));

  if (isAlreadySelected) {
    // Deseleccionar opción
    rec.selectedTags = rec.selectedTags.filter(t => t !== tagText);
    if (rec.notes) {
      const parts = rec.notes.split(';').map(s => s.trim()).filter(Boolean);
      const filtered = parts.filter(p => p !== tagText);
      rec.notes = filtered.join('; ');
    }
  } else {
    // Seleccionar opción (se marca en verde)
    rec.selectedTags.push(tagText);
    if (!rec.notes) {
      rec.notes = tagText;
    } else if (!rec.notes.includes(tagText)) {
      rec.notes = `${rec.notes.trim().replace(/\.$/, '')}; ${tagText}`;
    }

    // Si aún no tiene estado asignado, asignar estado automático acorde a la opción
    if (!rec.status) {
      const lower = tagText.toLowerCase();
      if (
        lower.includes('buen estado') ||
        lower.includes('completos') ||
        lower.includes('identificados') ||
        lower.includes('ordenado') ||
        lower.includes('con barra de tierra') ||
        lower.includes('en orden') ||
        lower.includes('operando') ||
        lower.includes('buena') ||
        lower.includes('normal') ||
        lower.includes('limpio') ||
        lower.includes('sin fugas') ||
        lower.includes('operativas') ||
        lower.includes('aplomados') ||
        lower.includes('sin daño') ||
        lower.includes('nivelados') ||
        lower.includes('íntegros') ||
        lower.includes('sin presencia') ||
        lower.includes('sin humedad') ||
        lower.includes('seco')
      ) {
        rec.status = 'good';
      } else {
        rec.status = 'warn';
      }
    }
  }

  saveState();
  refreshScopeUI(scope);
}

function handleItemPhotoUpload(event, scope, itemId) {
  const files = Array.from(event.target.files || []);
  if (!files.length) return;
  const rec = getTargetRecord(scope, itemId);
  if (!rec) return;

  let processed = 0;
  files.forEach(file => {
    compressImageFile(file, 850, 0.75, (dataUrl) => {
      rec.photos.push(dataUrl);
      processed++;
      if (processed === files.length) {
        saveState();
        refreshScopeUI(scope);
        showToast(`📷 ${files.length} fotografía(s) adjuntada(s)`);
      }
    });
  });
  event.target.value = '';
}

function removeItemPhoto(scope, itemId, photoIdx) {
  const rec = getTargetRecord(scope, itemId);
  if (!rec) return;
  rec.photos.splice(photoIdx, 1);
  saveState();
  refreshScopeUI(scope);
}

// Compresión automática de fotografías en cliente para rapidez y PDF ligero
function compressImageFile(file, maxWidth, quality, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      callback(canvas.toDataURL('image/jpeg', quality));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ============================================================================
// ESTADÍSTICAS Y RESUMEN DE HALLAZGOS
// ============================================================================

function collectActiveItemsForFormState(formObj) {
  const targetState = formObj || state;
  const list = [];

  // 1. Equipos Centrales y Exterior
  SYSTEMS_SCHEMA.forEach(cat => {
    cat.items.forEach(item => {
      list.push({
        area: 'Equipos Centrales / Exterior',
        category: cat.categoryTitle,
        title: item.title,
        entry: targetState.systems?.[item.id] || { status: '', notes: '', selectedTags: [], photos: [] }
      });
    });
  });

  // 2. Habitaciones
  (targetState.rooms || []).forEach(room => {
    const activeCats = getActiveCategoriesForRoom(room);
    activeCats.forEach(cat => {
      cat.items.forEach(item => {
        list.push({
          area: room.name,
          category: cat.categoryTitle,
          title: item.title,
          entry: room.items?.[item.id] || { status: '', notes: '', selectedTags: [], photos: [] }
        });
      });
    });
  });

  // 3. Integral (Dron y Humedad/Difícil acceso)
  if (targetState.package === 'integral' || targetState.package === 'premium') {
    DRONE_SCHEMA.forEach(item => {
      list.push({
        area: 'Registro Aéreo con Dron',
        category: '🚁 Inspección con Dron',
        title: item.title,
        entry: targetState.drone?.items?.[item.id] || { status: '', notes: '', selectedTags: [], photos: [] }
      });
    });
    MOISTURE_SCHEMA.forEach(item => {
      list.push({
        area: 'Humedad y Difícil Acceso',
        category: '💧🔦 Humedad / Áreas Difíciles',
        title: item.title,
        entry: targetState.moisture?.items?.[item.id] || { status: '', notes: '', selectedTags: [], photos: [] }
      });
    });
  }

  return list;
}

function collectAllActiveItems() {
  return collectActiveItemsForFormState(state);
}

function updateStatsBar() {
  const all = collectAllActiveItems();
  let evaluated = 0;
  let good = 0;
  let warn = 0;
  let bad = 0;
  let photosCount = state.meta.coverPhoto ? 1 : 0;

  all.forEach(({ entry }) => {
    const hasTags = Array.isArray(entry.selectedTags) && entry.selectedTags.length > 0;
    if (entry.status || hasTags) evaluated++;
    if (entry.status === 'good') good++;
    if (entry.status === 'warn') warn++;
    if (entry.status === 'bad') bad++;
    if (Array.isArray(entry.photos)) photosCount += entry.photos.length;
  });

  const pct = all.length > 0 ? Math.round((evaluated / all.length) * 100) : 0;

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('stat-progress', `${pct}%`);
  setTxt('stat-evaluated-count', `${evaluated}/${all.length}`);
  setTxt('stat-good', good);
  setTxt('stat-warn', warn);
  setTxt('stat-bad', bad);
  setTxt('stat-photos', photosCount);

  const fillEl = document.getElementById('progress-bar-fill');
  if (fillEl) {
    fillEl.style.width = `${pct}%`;
  }
}

function renderFindingsSummary() {
  const box = document.getElementById('findings-summary-box');
  if (!box) return;

  const all = collectAllActiveItems();
  const critical = all.filter(x => x.entry.status === 'bad');
  const warnings = all.filter(x => x.entry.status === 'warn');
  const withNotesOnly = all.filter(x => (x.entry.status === 'good' || !x.entry.status) && x.entry.notes?.trim());

  if (critical.length === 0 && warnings.length === 0 && withNotesOnly.length === 0) {
    box.innerHTML = `
      <div style="padding:18px; background:#F8FAFC; border:1px dashed var(--border-color); border-radius:var(--radius-md); color:var(--text-secondary); font-size:0.86rem;">
        No se han marcado hallazgos como <strong>⚠️ Regular</strong> o <strong>❌ Malo</strong> hasta el momento. Conforme califiques puntos en las pestañas anteriores, aparecerán resumidos aquí automáticamente.
      </div>
    `;
    return;
  }

  let html = '';

  if (critical.length > 0) {
    html += `
      <div style="margin-bottom:14px; border:1px solid #FECACA; background:#FEF2F2; border-radius:var(--radius-md); padding:14px;">
        <h4 style="color:#B91C1C; font-size:0.9rem; margin-bottom:8px;">❌ Reparaciones Urgentes / Hallazgos Críticos (${critical.length})</h4>
        <ul style="padding-left:18px; font-size:0.84rem; display:flex; flex-direction:column; gap:4px;">
          ${critical.map(c => `<li><strong>[${escapeHtml(c.area)}] ${escapeHtml(c.title)}:</strong> ${escapeHtml(c.entry.notes || 'Requiere intervención prioritaria.')}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  if (warnings.length > 0) {
    html += `
      <div style="margin-bottom:14px; border:1px solid #FDE68A; background:#FFFBEB; border-radius:var(--radius-md); padding:14px;">
        <h4 style="color:#B45309; font-size:0.9rem; margin-bottom:8px;">⚠️ Mantenimiento Preventivo / Correctivo Menor (${warnings.length})</h4>
        <ul style="padding-left:18px; font-size:0.84rem; display:flex; flex-direction:column; gap:4px;">
          ${warnings.map(w => `<li><strong>[${escapeHtml(w.area)}] ${escapeHtml(w.title)}:</strong> ${escapeHtml(w.entry.notes || 'Observación registrada en visita.')}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  box.innerHTML = html;
}

// ============================================================================
// PIZARRAS DE FIRMA DIGITAL (CANVAS)
// ============================================================================

const sigPads = {};

function initSignaturePads() {
  setupSingleSignaturePad('inspector', 'canvas-sig-inspector');
  setupSingleSignaturePad('client', 'canvas-sig-client');
  restoreSignaturesToCanvas();
}

function setupSingleSignaturePad(key, canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let drawing = false;

  sigPads[key] = { canvas, ctx };

  const getPos = (e) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const start = (e) => {
    e.preventDefault();
    drawing = true;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const pos = getPos(e);
    ctx.lineWidth = 2.2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#141414';
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const end = () => {
    if (!drawing) return;
    drawing = false;
    state.signatures[key] = canvas.toDataURL('image/png');
    saveState();
  };

  canvas.addEventListener('mousedown', start);
  canvas.addEventListener('mousemove', move);
  window.addEventListener('mouseup', end);

  canvas.addEventListener('touchstart', start, { passive: false });
  canvas.addEventListener('touchmove', move, { passive: false });
  canvas.addEventListener('touchend', end);
}

function clearSignature(key, skipSave) {
  const pad = sigPads[key];
  if (!pad) return;
  pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
  state.signatures[key] = null;
  if (!skipSave) saveState();
}

function restoreSignaturesToCanvas() {
  ['inspector', 'client'].forEach(key => {
    const pad = sigPads[key];
    if (!pad) return;
    pad.ctx.clearRect(0, 0, pad.canvas.width, pad.canvas.height);
    const dataUrl = state.signatures?.[key];
    if (dataUrl) {
      const img = new Image();
      img.onload = () => {
        pad.ctx.drawImage(img, 0, 0, pad.canvas.width, pad.canvas.height);
      };
      img.src = dataUrl;
    }
  });
}

function resizeSignatureCanvases() {
  restoreSignaturesToCanvas();
}

// ============================================================================
// GENERADOR DE INFORME OFICIAL Y VISTA DE IMPRESIÓN PDF
// ============================================================================

function toggleReportPreview(showReport) {
  const editorView = document.getElementById('editor-view');
  const reportView = document.getElementById('report-view');
  if (showReport) {
    renderOfficialReportHTML();
    editorView.style.display = 'none';
    reportView.style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    reportView.style.display = 'none';
    editorView.style.display = 'block';
  }
}

function statusBadgeReportHTML(status) {
  if (status === 'good') return `<span style="display:inline-block; padding:2px 8px; border-radius:4px; background:#DCFCE7; color:#15803D; font-weight:700; font-size:0.75rem;">✓ BUENO</span>`;
  if (status === 'warn') return `<span style="display:inline-block; padding:2px 8px; border-radius:4px; background:#FEF3C7; color:#B45309; font-weight:700; font-size:0.75rem;">⚠ REGULAR</span>`;
  if (status === 'bad') return `<span style="display:inline-block; padding:2px 8px; border-radius:4px; background:#FEE2E2; color:#B91C1C; font-weight:700; font-size:0.75rem;">✕ MALO / URGENTE</span>`;
  if (status === 'na') return `<span style="display:inline-block; padding:2px 8px; border-radius:4px; background:#F1F5F9; color:#475569; font-weight:600; font-size:0.75rem;">— N/A</span>`;
  return `<span style="color:#94A3B8; font-size:0.75rem;">Sin evaluar</span>`;
}

function renderOfficialReportHTML() {
  const target = document.getElementById('report-render-target');
  if (!target) return;

  const pkgLabels = {
    esencial: 'SERVICIO ESENCIAL',
    integral: 'SERVICIO INTEGRAL',
    premium: 'SERVICIO PREMIUM • DICTAMEN COLEGIADO'
  };

  const allItems = collectAllActiveItems();
  const goodCount = allItems.filter(x => x.entry.status === 'good').length;
  const warnCount = allItems.filter(x => x.entry.status === 'warn').length;
  const badCount = allItems.filter(x => x.entry.status === 'bad').length;
  const allFindings = allItems.filter(x => x.entry.status === 'bad' || x.entry.status === 'warn');

  // Recolectar galería fotográfica etiquetada
  const photoGallery = [];
  allItems.forEach(item => {
    if (Array.isArray(item.entry.photos) && item.entry.photos.length > 0) {
      item.entry.photos.forEach(ph => {
        photoGallery.push({
          url: ph,
          area: item.area,
          title: item.title,
          status: item.entry.status,
          notes: item.entry.notes || ''
        });
      });
    }
  });

  // Renderizado de tabla de Equipos Centrales y Exterior
  let systemsRowsHTML = '';
  SYSTEMS_SCHEMA.forEach(cat => {
    cat.items.forEach(item => {
      const entry = state.systems[item.id] || {};
      if (entry.status || entry.notes) {
        systemsRowsHTML += `
          <tr>
            <td><strong>${escapeHtml(item.title)}</strong><br><span style="font-size:0.74rem; color:#64748B;">${escapeHtml(cat.categoryTitle)}</span></td>
            <td style="width:130px; text-align:center;">${statusBadgeReportHTML(entry.status)}</td>
            <td>${escapeHtml(entry.notes || 'Sin observaciones adicionales.')}</td>
          </tr>
        `;
      }
    });
  });

  // Renderizado por Habitación (Opción B)
  const roomsReportHTML = state.rooms.map((room, rIdx) => {
    const cats = getActiveCategoriesForRoom(room);
    let rows = '';
    cats.forEach(cat => {
      cat.items.forEach(item => {
        const entry = room.items[item.id] || {};
        if (entry.status || entry.notes) {
          rows += `
            <tr>
              <td style="width:28%;"><strong>${escapeHtml(item.title)}</strong></td>
              <td style="width:24%; font-size:0.76rem; color:#52525B;">${escapeHtml(cat.categoryTitle.replace(/^[^\s]+\s\d\.\s/, ''))}</td>
              <td style="width:16%; text-align:center;">${statusBadgeReportHTML(entry.status)}</td>
              <td>${escapeHtml(entry.notes || '—')}</td>
            </tr>
          `;
        }
      });
    });

    if (!rows && !room.generalObservation) {
      rows = `<tr><td colspan="4" style="text-align:center; color:#94A3B8;">Sin registros capturados en esta área.</td></tr>`;
    }

    return `
      <div style="margin-bottom:18px; page-break-inside:avoid;">
        <div style="background:#F4F5F7; padding:8px 12px; border-left:4px solid var(--brand-gold); font-weight:700; font-size:0.9rem; display:flex; justify-content:space-between;">
          <span>${rIdx + 1}. Área / Habitación: ${escapeHtml(room.name)}</span>
          <span style="font-size:0.76rem; color:#52525B;">${room.hasPlumbing ? 'Incluye Revisión Hidrosanitaria' : 'Área Seca'}</span>
        </div>
        <table class="report-table" style="margin-top:6px; margin-bottom:6px;">
          <thead>
            <tr>
              <th>Elemento Revisado</th>
              <th>Especialidad</th>
              <th style="text-align:center;">Estado</th>
              <th>Observaciones / Hallazgos</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        ${room.generalObservation ? `<div style="font-size:0.8rem; background:#FAFAFA; padding:6px 10px; border:1px solid var(--border-color);"><strong>Nota del área:</strong> ${escapeHtml(room.generalObservation)}</div>` : ''}
      </div>
    `;
  }).join('');

  // Sección Integral (Dron y Humedad/Difícil Acceso)
  let integralReportHTML = '';
  if (state.package === 'integral' || state.package === 'premium') {
    const droneRows = DRONE_SCHEMA.map(item => {
      const entry = state.drone.items[item.id] || {};
      return `
        <tr>
          <td><strong>${escapeHtml(item.title)}</strong></td>
          <td style="width:130px; text-align:center;">${statusBadgeReportHTML(entry.status)}</td>
          <td>${escapeHtml(entry.notes || '—')}</td>
        </tr>
      `;
    }).join('');

    const moistureRows = MOISTURE_SCHEMA.map(item => {
      const entry = state.moisture.items[item.id] || {};
      return `
        <tr>
          <td><strong>${escapeHtml(item.title)}</strong></td>
          <td style="width:130px; text-align:center;">${statusBadgeReportHTML(entry.status)}</td>
          <td>${escapeHtml(entry.notes || '—')}</td>
        </tr>
      `;
    }).join('');

    integralReportHTML = `
      <div class="report-section-title">🚁 REGISTRO AÉREO CON DRON (AZOTEAS, CUBIERTAS Y FACHADAS ALTAS)</div>
      <table class="report-meta-table" style="margin-bottom:10px;">
        <tr>
          <th>Equipo / Dron</th>
          <td>${escapeHtml(state.drone.equipment || 'Dron de inspección de alta resolución')}</td>
          <th>Condiciones de Vuelo</th>
          <td>${escapeHtml(state.drone.conditions || 'Óptimas')}</td>
        </tr>
        ${state.drone.videoUrl ? `
        <tr>
          <th>Enlace a Video / Carpeta Aérea</th>
          <td colspan="3"><a href="${escapeHtml(state.drone.videoUrl)}" target="_blank">${escapeHtml(state.drone.videoUrl)}</a></td>
        </tr>` : ''}
      </table>
      <table class="report-table">
        <thead>
          <tr>
            <th>Punto Aéreo Evaluado</th>
            <th style="text-align:center;">Estado</th>
            <th>Hallazgos y Observaciones</th>
          </tr>
        </thead>
        <tbody>${droneRows}</tbody>
      </table>

      <div class="report-section-title">💧🔦 REVISIÓN DE HUMEDAD, FILTRACIONES Y ÁREAS DE DIFÍCIL ACCESO</div>
      <table class="report-meta-table" style="margin-bottom:10px;">
        <tr>
          <th>Instrumentación</th>
          <td>${escapeHtml(state.moisture.tools || 'Visual + Higrómetro')}</td>
          <th>Lectura Máx. Humedad</th>
          <td>${escapeHtml(state.moisture.maxReading || 'Dentro de rango normal')}</td>
        </tr>
      </table>
      <table class="report-table">
        <thead>
          <tr>
            <th>Concepto Evaluado</th>
            <th style="text-align:center;">Estado</th>
            <th>Diagnóstico</th>
          </tr>
        </thead>
        <tbody>${moistureRows}</tbody>
      </table>
    `;
  }

  // Sección Premium (Tour Virtual 360 + Dictamen Técnico Colegiado)
  let premiumReportHTML = '';
  if (state.package === 'premium') {
    const p = state.premium || {};
    premiumReportHTML = `
      <div class="report-section-title">🥽 REGISTRO ESPACIAL: TOUR VIRTUAL 360°</div>
      <table class="report-meta-table">
        <tr>
          <th>Enlace Interactivo 360°</th>
          <td colspan="3"><strong>${p.tourUrl ? `<a href="${escapeHtml(p.tourUrl)}" target="_blank">${escapeHtml(p.tourUrl)}</a>` : 'En proceso de procesamiento digital'}</strong></td>
        </tr>
        <tr>
          <th>Equipo de Captura 360°</th>
          <td>${escapeHtml(p.tourCamera || 'Cámara 360° HDR')}</td>
          <th>Escenas Capturadas</th>
          <td>${escapeHtml(p.tourScenesCount || 'Totalidad del inmueble')}</td>
        </tr>
        ${p.tourNotes ? `<tr><th>Alcance del Recorrido</th><td colspan="3">${escapeHtml(p.tourNotes)}</td></tr>` : ''}
      </table>

      <div class="dictamen-legal-box">
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--brand-gold); padding-bottom:8px; margin-bottom:12px;">
          <h3 style="font-size:1rem; font-weight:800; color:var(--brand-black);">⚖️ DICTAMEN TÉCNICO CON RESPALDO LEGAL</h3>
          <span style="font-size:0.78rem; font-weight:700; color:var(--brand-gold-dark);">INGENIERO / ARQUITECTO COLEGIADO</span>
        </div>

        <table class="report-meta-table" style="background:#fff; margin-bottom:12px;">
          <tr>
            <th>Profesionista Responsable</th>
            <td><strong>${escapeHtml(p.profName || state.meta.inspectorName || 'Por especificar')}</strong></td>
            <th>Título Profesional</th>
            <td>${escapeHtml(p.profTitle || 'Ingeniero / Arquitecto')}</td>
          </tr>
          <tr>
            <th>Cédula Profesional</th>
            <td><strong>${escapeHtml(p.cedula || '—')}</strong></td>
            <th>Colegio / Registro</th>
            <td>${escapeHtml(p.colegio || '—')}</td>
          </tr>
          <tr>
            <th>Resultado del Dictamen</th>
            <td colspan="3" style="font-weight:800; font-size:0.9rem;">${escapeHtml(p.verdict || '')}</td>
          </tr>
        </table>

        <div style="font-size:0.85rem; margin-bottom:10px;">
          <strong>Conclusión Técnica Pericial:</strong>
          <p style="margin-top:4px; white-space:pre-line; background:#fff; padding:10px; border:1px solid var(--border-color); border-radius:4px;">${escapeHtml(p.conclusion || 'Con base en la revisión técnica realizada, se asientan las observaciones contenidas en el presente informe.')}</p>
        </div>

        <div style="font-size:0.75rem; color:var(--text-secondary); font-style:italic;">
          ${escapeHtml(p.declaration || '')}
        </div>
      </div>
    `;
  }

  target.innerHTML = `
    <div class="report-header">
      <div style="display:flex; align-items:center; gap:16px;">
        <img src="assets/logo.png" alt="CLAVE CONSTRUCCIÓN" style="height:56px; width:auto;" />
        <div>
          <h2 style="font-size:1.15rem; font-weight:800; color:var(--brand-black);">INFORME TÉCNICO DE INSPECCIÓN DE INMUEBLE</h2>
          <p style="font-size:0.8rem; color:var(--text-secondary);">CLAVE CONSTRUCCIÓN • Diagnóstico Estructural, Instalaciones y Acabados</p>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="report-badge-pkg">${pkgLabels[state.package] || 'INSPECCIÓN'}</div>
        <div style="font-size:0.82rem; font-weight:700; margin-top:6px;">Folio: ${escapeHtml(state.meta.folio || 'S/F')}</div>
        <div style="font-size:0.76rem; color:var(--text-secondary);">Fecha: ${escapeHtml(state.meta.date || '')} ${escapeHtml(state.meta.time || '')}</div>
      </div>
    </div>

    <!-- DATOS GENERALES -->
    <table class="report-meta-table">
      <tr>
        <th>Cliente / Solicitante</th>
        <td><strong>${escapeHtml(state.meta.clientName || '—')}</strong></td>
        <th>Teléfono / Contacto</th>
        <td>${escapeHtml(state.meta.clientPhone || '—')} ${state.meta.clientEmail ? `(${escapeHtml(state.meta.clientEmail)})` : ''}</td>
      </tr>
      <tr>
        <th>Dirección del Inmueble</th>
        <td colspan="3">
          <strong>${escapeHtml(state.meta.address || '—')}</strong>
          ${(state.meta.coordinates || state.meta.mapsUrl) ? `
            <div style="margin-top:4px; font-size:0.76rem; color:var(--text-secondary);">
              ${state.meta.coordinates ? `📍 <strong>GPS:</strong> ${escapeHtml(state.meta.coordinates)} &nbsp;` : ''}
              ${state.meta.mapsUrl ? `<a href="${escapeAttr(state.meta.mapsUrl)}" target="_blank" rel="noopener noreferrer" style="color:#0284C7; font-weight:700; text-decoration:underline;">🗺️ Ver ubicación exacta en Google Maps</a>` : ''}
            </div>
          ` : ''}
        </td>
      </tr>
      <tr>
        <th>Tipo de Propiedad</th>
        <td>${escapeHtml(state.meta.propertyType || '—')} (${escapeHtml(state.meta.levels || '')})</td>
        <th>Superficie / Antigüedad</th>
        <td>${state.meta.areaM2 ? `${escapeHtml(state.meta.areaM2)} m²` : '—'} • Antigüedad: ${escapeHtml(state.meta.age || '—')}</td>
      </tr>
      <tr>
        <th>Motivo de Visita</th>
        <td>${escapeHtml(state.meta.purpose || '—')}</td>
        <th>Clima / Ocupación</th>
        <td>${escapeHtml(state.meta.weather || '—')} • ${escapeHtml(state.meta.occupancy || '—')}</td>
      </tr>
      <tr>
        <th>Inspector Responsable</th>
        <td><strong>${escapeHtml(state.meta.inspectorName || 'CLAVE CONSTRUCCIÓN')}</strong></td>
        <th>Atendió en Sitio</th>
        <td>${escapeHtml(state.meta.accompaniedBy || '—')}</td>
      </tr>
    </table>

    ${state.meta.coverPhoto ? `
      <div style="margin-bottom:20px; text-align:center;">
        <img src="${state.meta.coverPhoto}" alt="Fachada del Inmueble" style="max-height:240px; border-radius:8px; border:1px solid var(--border-color); object-fit:cover;" />
        <div style="font-size:0.75rem; color:var(--text-muted); margin-top:4px;">Fotografía de identificación del inmueble inspeccionado</div>
      </div>
    ` : ''}

    <!-- RESUMEN EJECUTIVO -->
    <div class="report-section-title">📊 RESUMEN EJECUTIVO DE LA INSPECCIÓN</div>
    <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:12px; margin-bottom:16px;">
      <div style="border:1px solid #BBF7D0; background:#F0FDF4; padding:10px 14px; border-radius:6px; text-align:center;">
        <div style="font-size:1.3rem; font-weight:800; color:#15803D;">${goodCount}</div>
        <div style="font-size:0.76rem; font-weight:600; color:#166534;">Puntos en Estado Óptimo / Bueno</div>
      </div>
      <div style="border:1px solid #FDE68A; background:#FFFBEB; padding:10px 14px; border-radius:6px; text-align:center;">
        <div style="font-size:1.3rem; font-weight:800; color:#B45309;">${warnCount}</div>
        <div style="font-size:0.76rem; font-weight:600; color:#92400E;">Observaciones (Mantenimiento Regular)</div>
      </div>
      <div style="border:1px solid #FECACA; background:#FEF2F2; padding:10px 14px; border-radius:6px; text-align:center;">
        <div style="font-size:1.3rem; font-weight:800; color:#B91C1C;">${badCount}</div>
        <div style="font-size:0.76rem; font-weight:600; color:#991B1B;">Hallazgos Críticos / Reparación Urgente</div>
      </div>
    </div>

    ${allFindings.length > 0 ? `
      <div style="margin-bottom:18px;">
        <h4 style="font-size:0.86rem; font-weight:700; margin-bottom:6px;">Listado Prioritario de Hallazgos Detectados:</h4>
        <table class="report-table">
          <thead>
            <tr>
              <th style="width:22%;">Área / Ubicación</th>
              <th style="width:28%;">Elemento</th>
              <th style="width:16%; text-align:center;">Prioridad</th>
              <th>Detalle del Hallazgo</th>
            </tr>
          </thead>
          <tbody>
            ${allFindings.map(f => `
              <tr>
                <td><strong>${escapeHtml(f.area)}</strong></td>
                <td>${escapeHtml(f.title)}</td>
                <td style="text-align:center;">${statusBadgeReportHTML(f.entry.status)}</td>
                <td>${escapeHtml(f.entry.notes || 'Requiere revisión.')}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    ` : ''}

    <!-- EQUIPOS CENTRALES Y EXTERIOR -->
    <div class="report-section-title">⚡💧 1. EQUIPOS CENTRALES, INSTALACIONES GENERALES Y FACHADA</div>
    <table class="report-table">
      <thead>
        <tr>
          <th style="width:38%;">Elemento Evaluado</th>
          <th style="width:16%; text-align:center;">Estado</th>
          <th>Observaciones</th>
        </tr>
      </thead>
      <tbody>
        ${systemsRowsHTML || `<tr><td colspan="3" style="text-align:center; color:#94A3B8;">Sin calificaciones registradas en equipos centrales.</td></tr>`}
      </tbody>
    </table>

    <!-- DESGLOSE POR ÁREA / HABITACIÓN -->
    <div class="report-section-title">🏠 2. EVALUACIÓN DETALLADA POR ÁREA / HABITACIÓN</div>
    ${roomsReportHTML}

    <!-- MÓDULOS INTEGRAL (SI APLICA) -->
    ${integralReportHTML}

    <!-- MÓDULOS PREMIUM (SI APLICA) -->
    ${premiumReportHTML}

    <!-- OBSERVACIONES FINALES -->
    ${state.meta.generalNotes ? `
      <div class="report-section-title">📝 COMENTARIOS GENERALES Y RECOMENDACIONES</div>
      <div style="padding:12px; border:1px solid var(--border-color); border-radius:6px; font-size:0.85rem; white-space:pre-line; margin-bottom:18px;">${escapeHtml(state.meta.generalNotes)}</div>
    ` : ''}

    <!-- REGISTRO FOTOGRÁFICO -->
    ${photoGallery.length > 0 ? `
      <div class="report-section-title">📸 ANEXO: REGISTRO FOTOGRÁFICO DE EVIDENCIAS (${photoGallery.length})</div>
      <div class="report-photo-grid">
        ${photoGallery.map((p, i) => `
          <div class="report-photo-item">
            <img src="${p.url}" alt="Foto ${i + 1}" />
            <div class="report-photo-caption">
              <strong>#${i + 1} [${escapeHtml(p.area)}]</strong> ${escapeHtml(p.title)}<br/>
              ${p.notes ? `<span>${escapeHtml(p.notes)}</span>` : ''}
            </div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    <!-- FIRMAS -->
    <div style="margin-top:32px; page-break-inside:avoid; border-top:2px solid var(--border-color); padding-top:20px;">
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:40px; text-align:center;">
        <div>
          <div style="height:90px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #18181B; margin-bottom:8px;">
            ${state.signatures.inspector ? `<img src="${state.signatures.inspector}" style="max-height:85px;" alt="Firma Inspector" />` : '<span style="color:#CBD5E1; font-size:0.75rem;">Espacio para firma</span>'}
          </div>
          <div style="font-weight:700; font-size:0.86rem;">${escapeHtml(state.package === 'premium' && state.premium.profName ? state.premium.profName : (state.meta.inspectorName || 'Inspector Responsable'))}</div>
          <div style="font-size:0.76rem; color:var(--text-secondary);">
            ${state.package === 'premium' ? `${escapeHtml(state.premium.profTitle || '')} • Cédula: ${escapeHtml(state.premium.cedula || '—')}` : 'CLAVE CONSTRUCCIÓN • Inspección Técnica'}
          </div>
        </div>

        <div>
          <div style="height:90px; display:flex; align-items:center; justify-content:center; border-bottom:1px solid #18181B; margin-bottom:8px;">
            ${state.signatures.client ? `<img src="${state.signatures.client}" style="max-height:85px;" alt="Firma Cliente" />` : '<span style="color:#CBD5E1; font-size:0.75rem;">Espacio para firma</span>'}
          </div>
          <div style="font-weight:700; font-size:0.86rem;">${escapeHtml(state.meta.clientName || state.meta.accompaniedBy || 'Cliente / Recepción de Visita')}</div>
          <div style="font-size:0.76rem; color:var(--text-secondary);">Conformidad de Visita de Inspección</div>
        </div>
      </div>
    </div>
  `;
}

// ============================================================================
// GENERADOR DE HOJA DE CÁLCULO TERMINADA (.XLSX) Y SUBIDA A GOOGLE DRIVE
// ============================================================================

const STORAGE_DRIVE_FOLDER_KEY = 'clave_inspeccion_drive_folder_v1';
const STORAGE_DRIVE_TOKEN_KEY = 'clave_inspeccion_drive_token_v1';
// Carpeta oficial de Google Drive de CLAVE CONSTRUCCIÓN fijada por defecto:
const DEFAULT_DRIVE_FOLDER_ID = '10H-2yMX_VXg4wjXv3YExS3iBMMYd2-Pf';
const DEFAULT_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/10H-2yMX_VXg4wjXv3YExS3iBMMYd2-Pf?usp=drive_link';

function getDriveFolderUrl() {
  return localStorage.getItem(STORAGE_DRIVE_FOLDER_KEY) || DEFAULT_DRIVE_FOLDER_URL;
}

function extractDriveFolderId(urlOrId) {
  const str = (urlOrId || '').trim();
  if (!str) return DEFAULT_DRIVE_FOLDER_ID;
  const match = str.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (match && match[1]) return match[1];
  return DEFAULT_DRIVE_FOLDER_ID;
}

function getSafeWorkbookFilename() {
  const safeFolio = (state.meta.folio || 'CLV-2026').replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeClient = (state.meta.clientName || 'Inmueble')
    .trim()
    .replace(/[^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s_-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 28);
  return `${safeFolio}_${safeClient || 'Inspeccion'}_CLAVE.xlsx`;
}

function openSheetsConfigModal() {
  const input = document.getElementById('drive-folder-url');
  const saved = localStorage.getItem(STORAGE_DRIVE_FOLDER_KEY) || DEFAULT_DRIVE_FOLDER_URL;
  if (input) input.value = saved;
  const fnEl = document.getElementById('drive-modal-filename');
  if (fnEl) fnEl.textContent = getSafeWorkbookFilename();
  document.getElementById('modal-sheets-config').classList.add('open');
}

function closeSheetsConfigModal() {
  document.getElementById('modal-sheets-config').classList.remove('open');
}

function saveDriveFolderUrl() {
  const input = document.getElementById('drive-folder-url');
  const url = (input?.value || '').trim();
  if (!url) {
    localStorage.removeItem(STORAGE_DRIVE_FOLDER_KEY);
    if (input) input.value = DEFAULT_DRIVE_FOLDER_URL;
    showToast('📁 Carpeta oficial de CLAVE CONSTRUCCIÓN restaurada por defecto', 'info');
    return;
  }
  localStorage.setItem(STORAGE_DRIVE_FOLDER_KEY, url);
  showToast('📁 Carpeta de Google Drive fijada correctamente', 'success');
}

function buildPayloadForFormState(formObj) {
  const fState = formObj || state;
  const allItems = collectActiveItemsForFormState(fState);
  let evaluated = 0;
  let good = 0;
  let warn = 0;
  let bad = 0;
  let photosCount = fState.meta?.coverPhoto ? 1 : 0;

  allItems.forEach(({ entry }) => {
    if (entry.status) evaluated++;
    if (entry.status === 'good') good++;
    if (entry.status === 'warn') warn++;
    if (entry.status === 'bad') bad++;
    if (Array.isArray(entry.photos)) photosCount += entry.photos.length;
  });

  const progressPct = allItems.length > 0 ? Math.round((evaluated / allItems.length) * 100) : 0;

  const urgentFindings = allItems
    .filter(x => x.entry.status === 'bad')
    .map(x => `[${x.area}] ${x.title}: ${x.entry.notes || 'Urgente'}`)
    .join(' | ');

  const regularFindings = allItems
    .filter(x => x.entry.status === 'warn')
    .map(x => `[${x.area}] ${x.title}: ${x.entry.notes || 'Mantenimiento'}`)
    .join(' | ');

  const roomsList = (fState.rooms || []).map(r => r.name).join(', ');
  const savedDateStr = fState.savedAt ? new Date(fState.savedAt).toLocaleString('es-MX') : new Date().toLocaleString('es-MX');

  return {
    timestamp: savedDateStr,
    folio: fState.meta?.folio || '',
    paquete: (fState.package || 'sin seleccionar').toUpperCase(),
    fechaVisita: fState.meta?.date || '',
    horaVisita: fState.meta?.time || '',
    motivo: fState.meta?.purpose || '',
    clienteNombre: fState.meta?.clientName || '',
    clienteTelefono: fState.meta?.clientPhone || '',
    clienteCorreo: fState.meta?.clientEmail || '',
    atendioEnSitio: fState.meta?.accompaniedBy || '',
    direccionInmueble: fState.meta?.address || '',
    coordenadasGps: fState.meta?.coordinates || '',
    googleMapsUrl: fState.meta?.mapsUrl || '',
    tipoInmueble: fState.meta?.propertyType || '',
    superficieM2: fState.meta?.areaM2 || '',
    niveles: fState.meta?.levels || '',
    antiguedad: fState.meta?.age || '',
    ocupacion: fState.meta?.occupancy || '',
    clima: fState.meta?.weather || '',
    inspector: fState.meta?.inspectorName || '',
    avancePorcentaje: `${progressPct}%`,
    puntosBuenos: good,
    puntosRegulares: warn,
    puntosUrgentesMalos: bad,
    totalFotos: photosCount,
    habitacionesEvaluadas: roomsList,
    hallazgosUrgentes: urgentFindings || 'Ninguno',
    hallazgosRegulares: regularFindings || 'Ninguno',
    dronVideoUrl: fState.drone?.videoUrl || '',
    humedadLecturaMax: fState.moisture?.maxReading || '',
    tour360Url: fState.premium?.tourUrl || '',
    peritoColegiado: fState.premium?.profName || '',
    cedulaProfesional: fState.premium?.cedula || '',
    dictamenHabitabilidad: fState.package === 'premium' ? (fState.premium?.verdict || '') : 'N/A',
    comentariosGenerales: fState.meta?.generalNotes || ''
  };
}

function buildSheetsPayload() {
  return buildPayloadForFormState(state);
}

function formatStatusLabelForSheet(status) {
  if (status === 'good') return '✅ ÓPTIMO / BUENO';
  if (status === 'warn') return '⚠️ REGULAR / MANTENIMIENTO';
  if (status === 'bad') return '❌ MALO / URGENTE';
  if (status === 'na') return '➖ NO APLICA';
  return '⏳ PENDIENTE';
}

function getStatusCellStyle(status, borderObj) {
  if (status === 'good') {
    return {
      fill: { fgColor: { rgb: 'DCFCE7' } },
      font: { bold: true, color: { rgb: '166534' }, sz: 10, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: borderObj
    };
  }
  if (status === 'warn') {
    return {
      fill: { fgColor: { rgb: 'FEF3C7' } },
      font: { bold: true, color: { rgb: '92400E' }, sz: 10, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: borderObj
    };
  }
  if (status === 'bad') {
    return {
      fill: { fgColor: { rgb: 'FEE2E2' } },
      font: { bold: true, color: { rgb: '991B1B' }, sz: 10, name: 'Calibri' },
      alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
      border: borderObj
    };
  }
  return {
    fill: { fgColor: { rgb: 'F4F4F5' } },
    font: { bold: false, color: { rgb: '52525B' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: borderObj
  };
}

/**
 * Construye el libro de Excel (.xlsx) terminado con 3 pestañas y diseño corporativo.
 * Devuelve un objeto Blob listo para descargar o compartir directamente a Google Drive.
 */
function createFinishedWorkbookBlob() {
  saveState();
  const p = buildSheetsPayload();

  if (typeof XLSX === 'undefined') {
    // Fallback CSV si por alguna razón no cargó la librería
    exportInspectionCSV();
    return null;
  }

  const wb = XLSX.utils.book_new();

  const thinBorder = {
    top: { style: 'thin', color: { rgb: 'D4D4D8' } },
    bottom: { style: 'thin', color: { rgb: 'D4D4D8' } },
    left: { style: 'thin', color: { rgb: 'D4D4D8' } },
    right: { style: 'thin', color: { rgb: 'D4D4D8' } }
  };

  const styleBannerBlack = {
    fill: { fgColor: { rgb: '141414' } },
    font: { bold: true, color: { rgb: 'FACC15' }, sz: 14, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  const styleSubBannerGold = {
    fill: { fgColor: { rgb: 'FEF9C3' } },
    font: { bold: true, color: { rgb: '18181B' }, sz: 11, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder
  };

  const styleSectionHeader = {
    fill: { fgColor: { rgb: '27272A' } },
    font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center' },
    border: thinBorder
  };

  const styleLabelCell = {
    fill: { fgColor: { rgb: 'F4F4F5' } },
    font: { bold: true, color: { rgb: '18181B' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  const styleValueCell = {
    fill: { fgColor: { rgb: 'FFFFFF' } },
    font: { bold: false, color: { rgb: '18181B' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  const styleTableHeader = {
    fill: { fgColor: { rgb: '18181B' } },
    font: { bold: true, color: { rgb: 'FACC15' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  // =========================================================================
  // PESTAÑA 1: FICHA TÉCNICA Y RESUMEN EJECUTIVO
  // =========================================================================
  const ws1Data = [
    ['CLAVE CONSTRUCCIÓN — HOJA OFICIAL DE INSPECCIÓN TÉCNICA DE INMUEBLE', '', '', ''],
    [`FOLIO: ${p.folio}   |   NIVEL DE SERVICIO: ${p.paquete}   |   FECHA: ${p.fechaVisita} ${p.horaVisita}   |   AVANCE: ${p.avancePorcentaje}`, '', '', ''],
    ['', '', '', ''],
    ['1. INFORMACIÓN GENERAL DE LA VISITA Y DEL INMUEBLE', '', '', ''],
    ['Cliente / Solicitante', p.clienteNombre || '—', 'Teléfono Cliente', p.clienteTelefono || '—'],
    ['Correo Electrónico', p.clienteCorreo || '—', 'Atendió en Sitio', p.atendioEnSitio || '—'],
    ['Dirección del Inmueble', p.direccionInmueble || '—', '', ''],
    ['Coordenadas GPS', p.coordenadasGps || '—', 'Enlace Google Maps', p.googleMapsUrl || '—'],
    ['Tipo de Propiedad', `${p.tipoInmueble || '—'} (${p.niveles || ''})`, 'Superficie / Antigüedad', `${p.superficieM2 ? p.superficieM2 + ' m²' : '—'} • ${p.antiguedad || '—'}`],
    ['Motivo de la Visita', p.motivo || '—', 'Clima / Ocupación', `${p.clima || '—'} • ${p.ocupacion || '—'}`],
    ['Inspector Responsable', p.inspector || 'CLAVE CONSTRUCCIÓN', 'Total Fotos Capturadas', String(p.totalFotos)],
    ['Áreas / Habitaciones Evaluadas', p.habitacionesEvaluadas || '—', '', ''],
    ['', '', '', ''],
    ['2. RESUMEN EJECUTIVO DE CALIFICACIONES', '', '', ''],
    ['✅ PUNTOS EN ESTADO ÓPTIMO / BUENO', '⚠️ OBSERVACIONES (MANTENIMIENTO REGULAR)', '❌ HALLAZGOS CRÍTICOS / REPARACIÓN URGENTE', 'AVANCE DE REVISIÓN'],
    [p.puntosBuenos, p.puntosRegulares, p.puntosUrgentesMalos, p.avancePorcentaje],
    ['', '', '', ''],
    ['3. LISTADO PRIORITARIO DE HALLAZGOS DETECTADOS (URGENTES Y REGULARES)', '', '', ''],
    ['Área / Ubicación', 'Elemento Evaluado', 'Prioridad / Estado', 'Detalle del Hallazgo y Opciones Seleccionadas']
  ];

  const allItems = collectAllActiveItems();
  const findings = allItems.filter(x => x.entry.status === 'bad' || x.entry.status === 'warn');
  findings.sort((a, b) => (a.entry.status === 'bad' && b.entry.status !== 'bad' ? -1 : 1));

  const findingsStartRow = ws1Data.length;
  if (findings.length === 0) {
    ws1Data.push(['Sin hallazgos críticos ni regulares registrados hasta el momento.', '', '', '']);
  } else {
    findings.forEach(f => {
      const tagsText = Array.isArray(f.entry.selectedTags) && f.entry.selectedTags.length > 0
        ? `[Opciones: ${f.entry.selectedTags.join(', ')}] `
        : '';
      ws1Data.push([
        f.area,
        f.title,
        formatStatusLabelForSheet(f.entry.status),
        `${tagsText}${f.entry.notes || 'Requiere revisión.'}`
      ]);
    });
  }

  ws1Data.push(['', '', '', '']);
  const commentsHeaderRow = ws1Data.length;
  ws1Data.push(['4. COMENTARIOS GENERALES Y DICTAMEN FINAL', '', '', '']);
  ws1Data.push(['Recomendaciones Generales', p.comentariosGenerales || 'Sin comentarios adicionales.', '', '']);

  if (state.package === 'integral' || state.package === 'premium') {
    ws1Data.push(['Equipo Dron / Video Aéreo', state.drone?.equipment || '—', 'URL Video Dron', p.dronVideoUrl || '—']);
    ws1Data.push(['Instrumentación Humedad', state.moisture?.tools || '—', 'Lectura Máx. Humedad', p.humedadLecturaMax || '—']);
  }
  if (state.package === 'premium') {
    ws1Data.push(['Perito Colegiado Responsable', `${p.peritoColegiado || '—'} (${state.premium?.profTitle || ''})`, 'Cédula / Colegio', `${p.cedulaProfesional || '—'} • ${state.premium?.colegio || '—'}`]);
    ws1Data.push(['Dictamen Legal de Habitabilidad', p.dictamenHabitabilidad || '—', 'URL Tour Virtual 360°', p.tour360Url || '—']);
    ws1Data.push(['Conclusión Técnica Pericial', state.premium?.conclusion || '—', '', '']);
  }

  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);

  // Combinaciones de celdas en Pestaña 1
  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
    { s: { r: 3, c: 0 }, e: { r: 3, c: 3 } },
    { s: { r: 6, c: 1 }, e: { r: 6, c: 3 } },
    { s: { r: 11, c: 1 }, e: { r: 11, c: 3 } },
    { s: { r: 13, c: 0 }, e: { r: 13, c: 3 } },
    { s: { r: 17, c: 0 }, e: { r: 17, c: 3 } },
    { s: { r: commentsHeaderRow, c: 0 }, e: { r: commentsHeaderRow, c: 3 } },
    { s: { r: commentsHeaderRow + 1, c: 1 }, e: { r: commentsHeaderRow + 1, c: 3 } }
  ];

  // Anchos de columna de Pestaña 1
  ws1['!cols'] = [
    { wch: 30 },
    { wch: 38 },
    { wch: 30 },
    { wch: 48 }
  ];

  // Aplicar estilos a Pestaña 1
  const range1 = XLSX.utils.decode_range(ws1['!ref']);
  for (let R = range1.s.r; R <= range1.e.r; ++R) {
    for (let C = range1.s.c; C <= range1.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws1[addr]) ws1[addr] = { t: 's', v: '' };

      if (R === 0) {
        ws1[addr].s = styleBannerBlack;
      } else if (R === 1) {
        ws1[addr].s = styleSubBannerGold;
      } else if (R === 3 || R === 13 || R === 17 || R === commentsHeaderRow) {
        ws1[addr].s = styleSectionHeader;
      } else if (R >= 4 && R <= 11) {
        ws1[addr].s = (C === 0 || C === 2) ? styleLabelCell : styleValueCell;
        if (R === 6 && C >= 1) ws1[addr].s = styleValueCell;
        if (R === 11 && C >= 1) ws1[addr].s = styleValueCell;
      } else if (R === 14) {
        ws1[addr].s = styleTableHeader;
      } else if (R === 15) {
        if (C === 0) ws1[addr].s = getStatusCellStyle('good', thinBorder);
        else if (C === 1) ws1[addr].s = getStatusCellStyle('warn', thinBorder);
        else if (C === 2) ws1[addr].s = getStatusCellStyle('bad', thinBorder);
        else ws1[addr].s = { ...styleSubBannerGold };
      } else if (R === 18) {
        ws1[addr].s = styleTableHeader;
      } else if (R >= findingsStartRow && R < commentsHeaderRow - 1) {
        if (findings.length > 0 && C === 2) {
          const fItem = findings[R - findingsStartRow];
          ws1[addr].s = getStatusCellStyle(fItem?.entry?.status, thinBorder);
        } else {
          ws1[addr].s = C === 0 ? styleLabelCell : styleValueCell;
        }
      } else if (R > commentsHeaderRow) {
        ws1[addr].s = (C === 0 || C === 2) ? styleLabelCell : styleValueCell;
        if (R === commentsHeaderRow + 1 && C >= 1) ws1[addr].s = styleValueCell;
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws1, '1_Ficha_y_Resumen');

  // =========================================================================
  // PESTAÑA 2: CHECKLIST COMPLETO POR ÁREA Y HABITACIÓN
  // =========================================================================
  const ws2Data = [
    ['CLAVE CONSTRUCCIÓN — DESGLOSE COMPLETO DE PUNTOS EVALUADOS POR ÁREA Y HABITACIÓN', '', '', '', '', '', '', ''],
    [`FOLIO: ${p.folio}   |   CLIENTE: ${p.clienteNombre || '—'}   |   DIRECCIÓN: ${p.direccionInmueble || '—'}`, '', '', '', '', '', '', ''],
    ['N.º', 'Módulo', 'Área / Habitación', 'Especialidad / Categoría', 'Elemento Evaluado', 'Estado / Calificación', 'Opciones Marcadas (✓)', 'Observaciones y Hallazgos en Sitio']
  ];

  const rowStatuses = [];
  let itemCounter = 1;

  // 1) Equipos Centrales
  SYSTEMS_SCHEMA.forEach(cat => {
    cat.items.forEach(item => {
      const entry = state.systems[item.id] || {};
      const tags = Array.isArray(entry.selectedTags) ? entry.selectedTags.join(', ') : '';
      ws2Data.push([
        itemCounter++,
        '1. Equipos Centrales',
        'Equipos Centrales y Exterior',
        cat.categoryTitle,
        item.title,
        formatStatusLabelForSheet(entry.status),
        tags || '—',
        entry.notes || '—'
      ]);
      rowStatuses.push(entry.status || '');
    });
  });

  // 2) Habitaciones / Áreas (Opción B)
  state.rooms.forEach(room => {
    const cats = getActiveCategoriesForRoom(room);
    cats.forEach(cat => {
      cat.items.forEach(item => {
        const entry = room.items[item.id] || {};
        const tags = Array.isArray(entry.selectedTags) ? entry.selectedTags.join(', ') : '';
        ws2Data.push([
          itemCounter++,
          '2. Habitaciones / Áreas',
          room.name,
          cat.categoryTitle,
          item.title,
          formatStatusLabelForSheet(entry.status),
          tags || '—',
          entry.notes || '—'
        ]);
        rowStatuses.push(entry.status || '');
      });
    });
  });

  // 3) Dron y Humedad (si es Integral o Premium)
  if (state.package === 'integral' || state.package === 'premium') {
    DRONE_SCHEMA.forEach(item => {
      const entry = state.drone.items[item.id] || {};
      const tags = Array.isArray(entry.selectedTags) ? entry.selectedTags.join(', ') : '';
      ws2Data.push([
        itemCounter++,
        '3. Inspección con Dron',
        'Azotea y Fachadas Altas',
        'Revisión Aérea con Dron',
        item.title,
        formatStatusLabelForSheet(entry.status),
        tags || '—',
        entry.notes || '—'
      ]);
      rowStatuses.push(entry.status || '');
    });

    MOISTURE_SCHEMA.forEach(item => {
      const entry = state.moisture.items[item.id] || {};
      const tags = Array.isArray(entry.selectedTags) ? entry.selectedTags.join(', ') : '';
      ws2Data.push([
        itemCounter++,
        '4. Humedad y Filtraciones',
        'Zonas Críticas / Difícil Acceso',
        'Diagnóstico de Humedad',
        item.title,
        formatStatusLabelForSheet(entry.status),
        tags || '—',
        entry.notes || '—'
      ]);
      rowStatuses.push(entry.status || '');
    });
  }

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 7 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 7 } }
  ];
  ws2['!cols'] = [
    { wch: 6 },
    { wch: 22 },
    { wch: 26 },
    { wch: 28 },
    { wch: 34 },
    { wch: 26 },
    { wch: 36 },
    { wch: 46 }
  ];

  const range2 = XLSX.utils.decode_range(ws2['!ref']);
  for (let R = range2.s.r; R <= range2.e.r; ++R) {
    for (let C = range2.s.c; C <= range2.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws2[addr]) ws2[addr] = { t: 's', v: '' };

      if (R === 0) {
        ws2[addr].s = styleBannerBlack;
      } else if (R === 1) {
        ws2[addr].s = styleSubBannerGold;
      } else if (R === 2) {
        ws2[addr].s = styleTableHeader;
      } else {
        const st = rowStatuses[R - 3];
        if (C === 5) {
          ws2[addr].s = getStatusCellStyle(st, thinBorder);
        } else if (C === 0) {
          ws2[addr].s = { ...styleLabelCell, alignment: { horizontal: 'center', vertical: 'center' } };
        } else if (C === 2 || C === 4) {
          ws2[addr].s = styleLabelCell;
        } else {
          ws2[addr].s = styleValueCell;
        }
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws2, '2_Checklist_Completo');

  // =========================================================================
  // PESTAÑA 3: FILA CONCENTRADA (PARA BASE DE DATOS HISTÓRICA)
  // =========================================================================
  const headers3 = [
    'Fecha Registro', 'Folio', 'Paquete', 'Fecha Visita', 'Hora', 'Motivo',
    'Cliente', 'Teléfono', 'Correo', 'Atendió en Sitio', 'Dirección Inmueble',
    'Coordenadas GPS', 'Google Maps URL',
    'Tipo Inmueble', 'Superficie m2', 'Niveles', 'Antigüedad', 'Ocupación',
    'Clima', 'Inspector', 'Avance', 'Puntos Buenos', 'Puntos Regulares',
    'Puntos Urgentes (Malos)', 'Total Fotos', 'Habitaciones Evaluadas',
    'Hallazgos Urgentes', 'Hallazgos Regulares', 'URL Dron', 'Lectura Máx Humedad',
    'URL Tour 360', 'Perito Colegiado', 'Cédula Profesional', 'Dictamen Legal',
    'Comentarios Generales'
  ];

  const values3 = [
    p.timestamp, p.folio, p.paquete, p.fechaVisita, p.horaVisita, p.motivo,
    p.clienteNombre, p.clienteTelefono, p.clienteCorreo, p.atendioEnSitio, p.direccionInmueble,
    p.coordenadasGps, p.googleMapsUrl,
    p.tipoInmueble, p.superficieM2, p.niveles, p.antiguedad, p.ocupacion,
    p.clima, p.inspector, p.avancePorcentaje, p.puntosBuenos, p.puntosRegulares,
    p.puntosUrgentesMalos, p.totalFotos, p.habitacionesEvaluadas,
    p.hallazgosUrgentes, p.hallazgosRegulares, p.dronVideoUrl, p.humedadLecturaMax,
    p.tour360Url, p.peritoColegiado, p.cedulaProfesional, p.dictamenHabitabilidad,
    p.comentariosGenerales
  ];

  const ws3 = XLSX.utils.aoa_to_sheet([headers3, values3]);
  ws3['!cols'] = headers3.map(() => ({ wch: 24 }));
  for (let C = 0; C < headers3.length; C++) {
    const hAddr = XLSX.utils.encode_cell({ r: 0, c: C });
    const vAddr = XLSX.utils.encode_cell({ r: 1, c: C });
    if (ws3[hAddr]) ws3[hAddr].s = styleTableHeader;
    if (ws3[vAddr]) ws3[vAddr].s = styleValueCell;
  }

  XLSX.utils.book_append_sheet(wb, ws3, '3_Fila_Concentrado');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

function downloadFinishedExcelWorkbook() {
  const blob = createFinishedWorkbookBlob();
  if (!blob) return;

  const filename = getSafeWorkbookFilename();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  showToast(`📊 Hoja terminada descargada: ${filename}`, 'success');
}

async function uploadBlobToDriveFolder(blob, filename) {
  const token = (localStorage.getItem(STORAGE_DRIVE_TOKEN_KEY) || '').trim();
  if (!token) return false;

  const folderId = extractDriveFolderId(getDriveFolderUrl());
  const metadata = {
    name: filename,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    parents: [folderId]
  };

  const form = new FormData();
  form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
  form.append('file', blob, filename);

  try {
    const res = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    if (res.ok) {
      const data = await res.json();
      showToast(`☁️ ¡Subido automáticamente a la carpeta de Drive! (${data.name})`, 'success');
      return true;
    }
  } catch (err) {
    console.warn('Error en subida directa API Drive:', err);
  }
  return false;
}

async function exportFinishedWorkbookAndDrive() {
  // 1. Guarda en la Base de Datos y genera la hoja .xlsx terminada
  syncCurrentToDatabaseSilent();
  const blob = createFinishedWorkbookBlob();
  const filename = getSafeWorkbookFilename();

  // 2. Intenta subida directa automática a la carpeta 10H-2yMX_VXg4wjXv3YExS3iBMMYd2-Pf si hay token activo
  if (blob) {
    const uploaded = await uploadBlobToDriveFolder(blob, filename);
    if (uploaded) {
      // También actualiza la Base de Datos Maestra en la misma carpeta
      const masterBlob = createMasterDatabaseWorkbookBlob();
      if (masterBlob) {
        await uploadBlobToDriveFolder(masterBlob, getMasterDatabaseFilename());
      }
      window.open(getDriveFolderUrl(), '_blank', 'noopener,noreferrer');
      return;
    }
  }

  // 3. Descarga la hoja .xlsx terminada y abre la carpeta de Drive de CLAVE CONSTRUCCIÓN
  downloadFinishedExcelWorkbook();
  openSheetsConfigModal();
  window.open(getDriveFolderUrl(), '_blank', 'noopener,noreferrer');
}

async function shareWorkbookToDriveApp() {
  const blob = createFinishedWorkbookBlob();
  if (!blob) return;

  const filename = getSafeWorkbookFilename();
  const uploaded = await uploadBlobToDriveFolder(blob, filename);
  if (uploaded) {
    window.open(getDriveFolderUrl(), '_blank', 'noopener,noreferrer');
    return;
  }

  const file = new File([blob], filename, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: `Inspección ${state.meta.folio || 'CLAVE'}`,
        text: `Hoja oficial de inspección técnica (${state.meta.folio || ''}) - CLAVE CONSTRUCCIÓN`,
        files: [file]
      });
      showToast('☁️ Archivo enviado correctamente', 'success');
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  // Si está en computadora o el navegador no soporta share de archivos, abre la carpeta oficial de Drive
  openDriveFolderAndDownload();
}

function openDriveFolderAndDownload() {
  const driveUrl = getDriveFolderUrl();
  window.open(driveUrl, '_blank', 'noopener,noreferrer');
  showToast('☁️ Carpeta de Google Drive de CLAVE CONSTRUCCIÓN abierta. Suelta ahí la hoja .xlsx descargada', 'info');
}

function exportInspectionCSV() {
  downloadFinishedExcelWorkbook();
}

// ============================================================================
// GENERADOR DE LA BASE DE DATOS MAESTRA DE TODOS LOS FORMULARIOS (.XLSX)
// ============================================================================

function createMasterDatabaseWorkbookBlob() {
  saveState();
  syncCurrentToDatabaseSilent();

  let list = getHistoryList();
  if (list.length === 0) {
    list = [JSON.parse(JSON.stringify(state))];
  }

  if (typeof XLSX === 'undefined') {
    alert('La librería Excel aún está cargando. Intenta de nuevo en un segundo.');
    return null;
  }

  const wb = XLSX.utils.book_new();

  const thinBorder = {
    top: { style: 'thin', color: { rgb: 'D4D4D8' } },
    bottom: { style: 'thin', color: { rgb: 'D4D4D8' } },
    left: { style: 'thin', color: { rgb: 'D4D4D8' } },
    right: { style: 'thin', color: { rgb: 'D4D4D8' } }
  };

  const styleBannerBlack = {
    fill: { fgColor: { rgb: '141414' } },
    font: { bold: true, color: { rgb: 'FACC15' }, sz: 14, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center' }
  };

  const styleSubBannerGold = {
    fill: { fgColor: { rgb: 'FEF9C3' } },
    font: { bold: true, color: { rgb: '18181B' }, sz: 11, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center' },
    border: thinBorder
  };

  const styleTableHeader = {
    fill: { fgColor: { rgb: '18181B' } },
    font: { bold: true, color: { rgb: 'FACC15' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  const styleLabelCell = {
    fill: { fgColor: { rgb: 'F4F4F5' } },
    font: { bold: true, color: { rgb: '18181B' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  const styleValueCell = {
    fill: { fgColor: { rgb: 'FFFFFF' } },
    font: { bold: false, color: { rgb: '18181B' }, sz: 10, name: 'Calibri' },
    alignment: { horizontal: 'left', vertical: 'center', wrapText: true },
    border: thinBorder
  };

  // =========================================================================
  // PESTAÑA 1: BASE DE DATOS GENERAL DE FORMULARIOS (1 FILA POR FORMULARIO)
  // =========================================================================
  const dbHeaders = [
    'N.º', 'Fecha Guardado', 'Folio', 'Nivel Servicio', 'Fecha Visita', 'Hora',
    'Cliente / Solicitante', 'Teléfono', 'Correo Electrónico', 'Atendió en Sitio',
    'Dirección del Inmueble', 'Coordenadas GPS', 'Enlace Google Maps',
    'Tipo Propiedad', 'Superficie (m²)', 'Niveles', 'Antigüedad', 'Ocupación',
    'Clima', 'Inspector Responsable', '% Avance',
    '✅ Puntos Buenos', '⚠️ Puntos Regulares', '❌ Puntos Urgentes', 'Total Fotos',
    'Habitaciones Evaluadas', 'Resumen Hallazgos Urgentes', 'Resumen Hallazgos Regulares',
    'URL Video Dron', 'Lectura Máx Humedad', 'URL Tour 360°',
    'Perito Colegiado', 'Cédula Profesional', 'Dictamen Habitabilidad', 'Comentarios Generales'
  ];

  const ws1Data = [
    ['CLAVE CONSTRUCCIÓN — BASE DE DATOS MAESTRA DE FORMULARIOS DE INSPECCIÓN', ...Array(dbHeaders.length - 1).fill('')],
    [`TOTAL DE FORMULARIOS REGISTRADOS: ${list.length}   |   GENERADO EL: ${new Date().toLocaleString('es-MX')}`, ...Array(dbHeaders.length - 1).fill('')],
    dbHeaders
  ];

  list.forEach((formObj, idx) => {
    const p = buildPayloadForFormState(formObj);
    ws1Data.push([
      idx + 1,
      p.timestamp,
      p.folio,
      p.paquete,
      p.fechaVisita,
      p.horaVisita,
      p.clienteNombre || '—',
      p.clienteTelefono || '—',
      p.clienteCorreo || '—',
      p.atendioEnSitio || '—',
      p.direccionInmueble || '—',
      p.coordenadasGps || '—',
      p.googleMapsUrl || '—',
      p.tipoInmueble || '—',
      p.superficieM2 || '—',
      p.niveles || '—',
      p.antiguedad || '—',
      p.ocupacion || '—',
      p.clima || '—',
      p.inspector || '—',
      p.avancePorcentaje,
      p.puntosBuenos,
      p.puntosRegulares,
      p.puntosUrgentesMalos,
      p.totalFotos,
      p.habitacionesEvaluadas || '—',
      p.hallazgosUrgentes,
      p.hallazgosRegulares,
      p.dronVideoUrl || '—',
      p.humedadLecturaMax || '—',
      p.tour360Url || '—',
      p.peritoColegiado || '—',
      p.cedulaProfesional || '—',
      p.dictamenHabitabilidad || '—',
      p.comentariosGenerales || '—'
    ]);
  });

  const ws1 = XLSX.utils.aoa_to_sheet(ws1Data);
  ws1['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } }
  ];
  ws1['!cols'] = dbHeaders.map((h, i) => {
    if (i === 0) return { wch: 6 };
    if (i === 10 || i === 25 || i === 26 || i === 27 || i === 34) return { wch: 42 };
    return { wch: 22 };
  });

  const range1 = XLSX.utils.decode_range(ws1['!ref']);
  for (let R = range1.s.r; R <= range1.e.r; ++R) {
    for (let C = range1.s.c; C <= range1.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws1[addr]) ws1[addr] = { t: 's', v: '' };
      if (R === 0) ws1[addr].s = styleBannerBlack;
      else if (R === 1) ws1[addr].s = styleSubBannerGold;
      else if (R === 2) ws1[addr].s = styleTableHeader;
      else {
        if (C === 2 || C === 6) ws1[addr].s = styleLabelCell;
        else if (C === 21) ws1[addr].s = getStatusCellStyle('good', thinBorder);
        else if (C === 22) ws1[addr].s = getStatusCellStyle('warn', thinBorder);
        else if (C === 23) ws1[addr].s = getStatusCellStyle('bad', thinBorder);
        else ws1[addr].s = styleValueCell;
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws1, '1_Base_Datos_Formularios');

  // =========================================================================
  // PESTAÑA 2: BASE DE DATOS DE HALLAZGOS DE TODOS LOS INMUEBLES
  // =========================================================================
  const findingsHeaders = [
    'N.º', 'Folio Formulario', 'Fecha Visita', 'Paquete', 'Cliente',
    'Dirección del Inmueble', 'Área / Habitación', 'Especialidad / Categoría',
    'Elemento Evaluado', 'Prioridad / Estado', 'Opciones Marcadas (✓)', 'Detalle del Hallazgo'
  ];

  const ws2Data = [
    ['CLAVE CONSTRUCCIÓN — BASE DE DATOS HISTÓRICA DE HALLAZGOS Y REPARACIONES', ...Array(findingsHeaders.length - 1).fill('')],
    findingsHeaders
  ];

  const findingRowStatuses = [];
  let fCounter = 1;

  list.forEach(formObj => {
    const items = collectActiveItemsForFormState(formObj);
    const formFindings = items.filter(x => x.entry.status === 'bad' || x.entry.status === 'warn');
    formFindings.forEach(f => {
      const tags = Array.isArray(f.entry.selectedTags) ? f.entry.selectedTags.join(', ') : '';
      ws2Data.push([
        fCounter++,
        formObj.meta?.folio || '—',
        formObj.meta?.date || '—',
        (formObj.package || '—').toUpperCase(),
        formObj.meta?.clientName || '—',
        formObj.meta?.address || '—',
        f.area,
        f.category,
        f.title,
        formatStatusLabelForSheet(f.entry.status),
        tags || '—',
        f.entry.notes || 'Requiere revisión.'
      ]);
      findingRowStatuses.push(f.entry.status);
    });
  });

  if (findingRowStatuses.length === 0) {
    ws2Data.push(['—', '—', '—', '—', '—', '—', '—', '—', 'Sin hallazgos registrados en la base de datos', '—', '—', '—']);
    findingRowStatuses.push('');
  }

  const ws2 = XLSX.utils.aoa_to_sheet(ws2Data);
  ws2['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 11 } }];
  ws2['!cols'] = [
    { wch: 6 }, { wch: 18 }, { wch: 14 }, { wch: 14 }, { wch: 24 },
    { wch: 34 }, { wch: 24 }, { wch: 26 }, { wch: 30 }, { wch: 26 }, { wch: 32 }, { wch: 44 }
  ];

  const range2 = XLSX.utils.decode_range(ws2['!ref']);
  for (let R = range2.s.r; R <= range2.e.r; ++R) {
    for (let C = range2.s.c; C <= range2.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws2[addr]) ws2[addr] = { t: 's', v: '' };
      if (R === 0) ws2[addr].s = styleBannerBlack;
      else if (R === 1) ws2[addr].s = styleTableHeader;
      else {
        const st = findingRowStatuses[R - 2];
        if (C === 9 && st) ws2[addr].s = getStatusCellStyle(st, thinBorder);
        else if (C === 1 || C === 4 || C === 8) ws2[addr].s = styleLabelCell;
        else ws2[addr].s = styleValueCell;
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws2, '2_Base_Datos_Hallazgos');

  // =========================================================================
  // PESTAÑA 3: DETALLE DE TODOS LOS CHECKLISTS DE TODOS LOS FORMULARIOS
  // =========================================================================
  const allCheckHeaders = [
    'Folio Formulario', 'Fecha', 'Cliente', 'Dirección', 'Área / Habitación',
    'Categoría', 'Punto de Inspección', 'Calificación', 'Opciones Marcadas (✓)', 'Observaciones'
  ];

  const ws3Data = [
    ['CLAVE CONSTRUCCIÓN — REGISTRO DETALLADO DE PUNTOS EVALUADOS (TODOS LOS FORMULARIOS)', ...Array(allCheckHeaders.length - 1).fill('')],
    allCheckHeaders
  ];

  const allCheckStatuses = [];
  list.forEach(formObj => {
    const items = collectActiveItemsForFormState(formObj);
    items.forEach(it => {
      // Incluye todos los puntos calificados o con notas/opciones
      if (it.entry.status || it.entry.notes || (it.entry.selectedTags && it.entry.selectedTags.length > 0)) {
        const tags = Array.isArray(it.entry.selectedTags) ? it.entry.selectedTags.join(', ') : '';
        ws3Data.push([
          formObj.meta?.folio || '—',
          formObj.meta?.date || '—',
          formObj.meta?.clientName || '—',
          formObj.meta?.address || '—',
          it.area,
          it.category,
          it.title,
          formatStatusLabelForSheet(it.entry.status),
          tags || '—',
          it.entry.notes || '—'
        ]);
        allCheckStatuses.push(it.entry.status || '');
      }
    });
  });

  if (allCheckStatuses.length === 0) {
    ws3Data.push(['—', '—', '—', '—', '—', '—', 'Aún no hay puntos calificados', '—', '—', '—']);
    allCheckStatuses.push('');
  }

  const ws3 = XLSX.utils.aoa_to_sheet(ws3Data);
  ws3['!merges'] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 9 } }];
  ws3['!cols'] = [
    { wch: 18 }, { wch: 14 }, { wch: 24 }, { wch: 32 }, { wch: 24 },
    { wch: 26 }, { wch: 32 }, { wch: 24 }, { wch: 32 }, { wch: 42 }
  ];

  const range3 = XLSX.utils.decode_range(ws3['!ref']);
  for (let R = range3.s.r; R <= range3.e.r; ++R) {
    for (let C = range3.s.c; C <= range3.e.c; ++C) {
      const addr = XLSX.utils.encode_cell({ r: R, c: C });
      if (!ws3[addr]) ws3[addr] = { t: 's', v: '' };
      if (R === 0) ws3[addr].s = styleBannerBlack;
      else if (R === 1) ws3[addr].s = styleTableHeader;
      else {
        const st = allCheckStatuses[R - 2];
        if (C === 7) ws3[addr].s = getStatusCellStyle(st, thinBorder);
        else if (C === 0 || C === 6) ws3[addr].s = styleLabelCell;
        else ws3[addr].s = styleValueCell;
      }
    }
  }

  XLSX.utils.book_append_sheet(wb, ws3, '3_Detalle_Todos_Formularios');

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  return new Blob([wbout], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });
}

function getMasterDatabaseFilename() {
  const today = new Date().toISOString().slice(0, 10);
  return `Base_de_Datos_Inspecciones_CLAVE_${today}.xlsx`;
}

function downloadMasterDatabaseWorkbook() {
  const blob = createMasterDatabaseWorkbookBlob();
  if (!blob) return;

  const filename = getMasterDatabaseFilename();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);

  const count = getHistoryList().length || 1;
  showToast(`🗄️ Base de Datos Maestra (${count} formularios) descargada: ${filename}`, 'success');
}

async function shareMasterDatabaseToDrive() {
  const blob = createMasterDatabaseWorkbookBlob();
  if (!blob) return;

  const filename = getMasterDatabaseFilename();
  const uploaded = await uploadBlobToDriveFolder(blob, filename);
  if (uploaded) {
    window.open(getDriveFolderUrl(), '_blank', 'noopener,noreferrer');
    return;
  }

  const file = new File([blob], filename, {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share({
        title: 'Base de Datos de Inspecciones - CLAVE CONSTRUCCIÓN',
        text: 'Hoja Maestra con la Base de Datos de Formularios de Inspección - CLAVE CONSTRUCCIÓN',
        files: [file]
      });
      showToast('☁️ Base de Datos enviada a Google Drive', 'success');
      return;
    } catch (err) {
      if (err.name === 'AbortError') return;
    }
  }

  downloadMasterDatabaseWorkbook();
  openDriveFolderAndDownload();
}

// ============================================================================
// UTILIDADES
// ============================================================================

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/`/g, '&#096;');
}

