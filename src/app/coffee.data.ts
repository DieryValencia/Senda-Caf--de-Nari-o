type Process = 'Todos' | 'Lavado' | 'Honey' | 'Natural';
export type VarietyGroup = 'Todas' | 'Tradicionales' | 'Mejoradas' | 'Especiales';

export interface Coffee {
  id: number;
  name: string;
  municipality: string;
  farm: string;
  producer: string;
  altitude: string;
  variety: string;
  group: Exclude<VarietyGroup, 'Todas'>;
  species: string;
  lineage: string;
  plantType: string;
  rustResistance: string;
  evidence: string;
  imageCredit: string;
  process: Exclude<Process, 'Todos'>;
  harvest: string;
  drying: string;
  roast: string;
  score: string;
  notes: string[];
  price: number;
  priceBasis: string;
  priceSource: string;
  priceCheckedAt: string;
  image: string;
  cardImage: string;
  imageSource: string;
  homeImage?: string;
  story: string;
  accent: string;
}

export const VARIETY_GROUPS: VarietyGroup[] = ['Todas', 'Tradicionales', 'Mejoradas', 'Especiales'];

const PRODUCT_IMAGES = [
  { url: 'https://images.pexels.com/photos/28742833/pexels-photo-28742833.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Raymond Petrik · Pexels', source: 'https://www.pexels.com/photo/high-quality-close-up-of-roasted-coffee-beans-28742833/' },
  { url: 'https://images.pexels.com/photos/19286175/pexels-photo-19286175.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Nader Ayman · Pexels', source: 'https://www.pexels.com/photo/pile-of-roasted-coffee-beans-19286175/' },
  { url: 'https://images.pexels.com/photos/33220155/pexels-photo-33220155.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Indra Projects · Pexels', source: 'https://www.pexels.com/photo/33220155/' },
  { url: 'https://images.pexels.com/photos/4815900/pexels-photo-4815900.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Maksim Goncharenok · Pexels', source: 'https://www.pexels.com/photo/bunch-of-green-coffee-beans-4815900/' },
  { url: 'https://images.pexels.com/photos/35982640/pexels-photo-35982640.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Valentin Ivantsov · Pexels', source: 'https://www.pexels.com/photo/high-quality-close-up-of-coffee-beans-35982640/' },
  { url: 'https://images.pexels.com/photos/10357553/pexels-photo-10357553.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Sara · Pexels', source: 'https://www.pexels.com/photo/10357553/' },
  { url: 'https://images.pexels.com/photos/20708703/pexels-photo-20708703.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Kelly · Pexels', source: 'https://www.pexels.com/photo/20708703/' },
  { url: 'https://images.pexels.com/photos/4815898/pexels-photo-4815898.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Maksim Goncharenok · Pexels', source: 'https://www.pexels.com/photo/close-up-shot-of-green-coffee-beans-4815898/' },
  { url: 'https://images.pexels.com/photos/16784482/pexels-photo-16784482.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Bayram Yalçın · Pexels', source: 'https://www.pexels.com/photo/a-close-up-of-coffee-beans-16784482/' },
  { url: 'https://images.pexels.com/photos/32219643/pexels-photo-32219643.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Jara · Pexels', source: 'https://www.pexels.com/photo/32219643/' },
  { url: 'https://images.pexels.com/photos/209476/pexels-photo-209476.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Pixabay · Pexels', source: 'https://www.pexels.com/photo/coffee-beans-209476/' },
  { url: 'https://images.pexels.com/photos/4815951/pexels-photo-4815951.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Maksim Goncharenok · Pexels', source: 'https://www.pexels.com/photo/4815951/' },
  { url: 'https://images.pexels.com/photos/1695052/pexels-photo-1695052.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Igor Haritanovich · Pexels', source: 'https://www.pexels.com/photo/coffee-beans-1695052/' },
  { url: 'https://images.pexels.com/photos/34977389/pexels-photo-34977389.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Anoop VS · Pexels', source: 'https://www.pexels.com/photo/close-up-of-roasted-coffee-beans-texture-34977389/' },
  { url: 'https://images.pexels.com/photos/52724/coffee-beans-coffee-the-drink-caffeine-52724.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Pixabay · Pexels', source: 'https://www.pexels.com/photo/coffee-beans-52724/' },
  { url: 'https://images.pexels.com/photos/6239866/pexels-photo-6239866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Andre Taissin · Pexels', source: 'https://www.pexels.com/photo/close-up-photography-of-coffee-beans-6239866/' },
  { url: 'https://images.pexels.com/photos/34977389/pexels-photo-34977389.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Anoop VS · Pexels', source: 'https://www.pexels.com/photo/close-up-of-roasted-coffee-beans-texture-34977389/' },
  { url: 'https://images.pexels.com/photos/1399096/pexels-photo-1399096.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1500&fit=crop', credit: 'Tom Cordner · Pexels', source: 'https://www.pexels.com/photo/close-up-photo-of-brown-coffee-beans-1399096/' }
] as const;

export const COFFEES: Coffee[] = ([
    {
      id: 1, name: 'Caturra',
      municipality: 'Buesaco',
      farm: 'Lote demostrativo de Buesaco', producer: 'Productor por confirmar',
      altitude: '2.050 m s. n. m.',
      variety: 'Caturra roja', group: 'Tradicionales', species: 'Coffea arabica',
      lineage: 'Mutación natural de Borbón identificada en Brasil; introducida a Colombia en 1952.',
      plantType: 'Porte bajo, entrenudos cortos y apta para altas densidades.', rustResistance: 'Susceptible a la roya; requiere manejo fitosanitario.',
      evidence: 'FNC Nariño 2025 · 1.984,68 ha registradas', process: 'Lavado',
      harvest: 'Recolección manual de cerezas maduras por pases.', drying: 'Marquesina elevada · propuesta de lote', roast: 'Medio claro', score: 'Referencia',
      notes: ['Cítrico', 'Panela', 'Cacao'], price: 48000,
      image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=88',
      imageCredit: 'Fotografía documental · Unsplash', story: 'Variedad compacta y productiva que ayudó a intensificar la caficultura colombiana. En altura puede expresar una taza limpia, dulce y de acidez marcada; el perfil final depende del suelo, beneficio y tueste.', accent: '#b95138'
    },
    {
      id: 2, name: 'Variedad Colombia', municipality: 'El Tablón de Gómez', farm: 'Lote demostrativo de Aponte', producer: 'Productor por confirmar', altitude: '2.150 m s. n. m.',
      variety: 'Colombia', group: 'Mejoradas', species: 'Coffea arabica', lineage: 'Caturra × Híbrido de Timor; población compuesta liberada antes de la llegada de la roya al país.',
      plantType: 'Porte bajo, base genética amplia y buena productividad.', rustResistance: 'Resistente a la roya por diversidad de líneas.', evidence: 'FNC Nariño 2025 · 6.663,48 ha registradas', process: 'Honey',
      harvest: 'Recolección selectiva por pases.', drying: 'Camas elevadas · propuesta de lote', roast: 'Medio claro', score: 'Referencia', notes: ['Miel', 'Durazno', 'Floral'], price: 50000,
      image: 'https://images.unsplash.com/photo-1586575403276-aa75f8e4650f?auto=format&fit=crop&w=1200&q=88',
      imageCredit: 'Fotografía documental · Unsplash', story: 'Primera gran variedad colombiana desarrollada para combinar calidad, productividad y resistencia. No define por sí sola una nota de sabor: en Nariño suele beneficiarse de la maduración lenta de las zonas altas.', accent: '#c07b2d'
    },
    {
      id: 3, name: 'Castillo', municipality: 'La Unión', farm: 'Lote demostrativo regional', producer: 'Productor por confirmar', altitude: '1.850 m s. n. m.',
      variety: 'Castillo', group: 'Mejoradas', species: 'Coffea arabica', lineage: 'Caturra × Híbrido de Timor 1343; variedad compuesta liberada por Cenicafé en 2005.',
      plantType: 'Porte medio-bajo, productiva y adaptable.', rustResistance: 'Elevada resistencia a la roya.', evidence: 'FNC Nariño 2025 · 24.394,37 ha registradas', process: 'Lavado',
      harvest: 'Cerezas maduras seleccionadas a mano.', drying: 'Secado solar · propuesta de lote', roast: 'Medio', score: 'Referencia', notes: ['Caramelo', 'Cítrico', 'Chocolate'], price: 46000,
      image: 'https://images.unsplash.com/photo-1694322111431-c505f41eb65d?auto=format&fit=crop&w=1200&q=88',
      imageCredit: 'Fotografía documental · Unsplash', story: 'Es la variedad más extendida en Nariño según la cartilla oficial de 2025. Fue diseñada para sostener productividad, calidad física del grano y resistencia durable frente a la roya.', accent: '#6f3141'
    },
    {
      id: 4, name: 'Castillo Zona Sur', municipality: 'Sandoná', farm: 'Selección regional · lote demostrativo', producer: 'Productor por confirmar', altitude: '1.720 m s. n. m.',
      variety: 'Castillo Zona Sur', group: 'Mejoradas', species: 'Coffea arabica', lineage: 'Mezcla regional de líneas Castillo seleccionadas para ambientes del sur cafetero.', plantType: 'Porte medio-bajo y adaptación regional.', rustResistance: 'Resistente a la roya.', evidence: 'FNC Nariño 2025 · 475,87 ha registradas', process: 'Lavado',
      harvest: 'Recolección manual y flotación.', drying: 'Patio solar · propuesta de lote', roast: 'Medio', score: 'Referencia', notes: ['Caramelo', 'Naranja', 'Nuez'], price: 47000,
      image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=1200&q=88',
      imageCredit: 'Fotografía documental · Unsplash', story: 'Selección regional incluida expresamente en el inventario departamental. Conserva el enfoque de Castillo —productividad y resistencia— con componentes escogidos por su comportamiento en condiciones del sur.', accent: '#72743b'
    },
    { id:5,name:'Castillo Zona Centro',municipality:'Nariño · zona centro',farm:'Selección regional · lote demostrativo',producer:'Productor por confirmar',altitude:'1.800–2.100 m s. n. m.',variety:'Castillo Zona Centro',group:'Mejoradas',species:'Coffea arabica',lineage:'Mezcla regional de progenies Castillo.',plantType:'Porte medio-bajo; alta densidad posible.',rustResistance:'Resistente a la roya.',evidence:'FNC Nariño 2025 · 0,71 ha registradas',process:'Lavado',harvest:'Selección manual de fruto maduro.',drying:'Marquesina · propuesta de lote',roast:'Medio claro',score:'Referencia',notes:['Panela','Cítrico','Cacao'],price:49000,image:'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Una presencia pequeña pero nominalmente registrada en el departamento. Se presenta separada de Castillo general para que el catálogo no borre su identidad regional.',accent:'#735d37' },
    { id:6,name:'Cenicafé 1',municipality:'Nariño · varios municipios',farm:'Lote demostrativo departamental',producer:'Productor por confirmar',altitude:'1.700–2.100 m s. n. m.',variety:'Cenicafé 1',group:'Mejoradas',species:'Coffea arabica',lineage:'Progenies de Caturra × Híbrido de Timor 1343; liberada en 2016.',plantType:'Porte bajo, uniforme y altamente productivo.',rustResistance:'Resistente a roya y tolerante a CBD.',evidence:'FNC Nariño 2025 · 1.146,49 ha registradas',process:'Lavado',harvest:'Cerezas maduras recolectadas manualmente.',drying:'Secado solar · propuesta de lote',roast:'Medio claro',score:'Referencia',notes:['Dulce','Fruta amarilla','Cacao'],price:50000,image:'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Variedad colombiana de nueva generación con productividad comparable a Castillo y una proporción mayor de café supremo. Su registro en Nariño supera las mil hectáreas.',accent:'#4d6a45' },
    { id:7,name:'Tabi',municipality:'Nariño · varios municipios',farm:'Lote demostrativo de altura',producer:'Productor por confirmar',altitude:'1.850–2.200 m s. n. m.',variety:'Tabi',group:'Mejoradas',species:'Coffea arabica',lineage:'Híbrido de Timor cruzado con Típica y Borbón; liberada en 2002.',plantType:'Porte alto y grano grande; requiere menor densidad.',rustResistance:'Resistente a la roya.',evidence:'FNC Nariño 2025 · 42,06 ha registradas',process:'Honey',harvest:'Selección manual por color y densidad.',drying:'Camas elevadas · propuesta de lote',roast:'Claro',score:'Referencia',notes:['Floral','Miel','Cítrico'],price:58000,image:'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Su nombre significa “bueno” en lengua guambiana. Combina porte alto, resistencia y la calidad de bebida asociada a progenitores Típica y Borbón.',accent:'#9a653e' },
    { id:8,name:'Típica',municipality:'Nariño · cultivos patrimoniales',farm:'Lote demostrativo tradicional',producer:'Productor por confirmar',altitude:'1.800–2.200 m s. n. m.',variety:'Típica',group:'Tradicionales',species:'Coffea arabica',lineage:'Linaje arábica histórico difundido desde Yemen hacia América.',plantType:'Porte alto, ramas abiertas y baja densidad de siembra.',rustResistance:'Susceptible a la roya.',evidence:'FNC Nariño 2025 · 17,82 ha registradas',process:'Lavado',harvest:'Recolección selectiva manual.',drying:'Secado solar lento · propuesta de lote',roast:'Claro',score:'Referencia',notes:['Floral','Panela','Té negro'],price:60000,image:'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Una de las variedades fundacionales del café americano. Es menos productiva y más vulnerable que los materiales modernos, pero sigue siendo apreciada por su herencia y potencial sensorial.',accent:'#52613f' },
    { id:10,name:'Geisha',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Geisha / Gesha',group:'Especiales',species:'Coffea arabica',lineage:'Linaje etíope difundido internacionalmente vía Centroamérica.',plantType:'Porte alto, exigente y de bajo rendimiento relativo.',rustResistance:'Susceptibilidad variable; exige manejo cuidadoso.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Jazmín','Cítrico','Miel'],price:90000,image:'https://images.unsplash.com/photo-1512568400610-62da28bc8a13?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Variedad de especialidad documentada en El Turpial. La fuente reporta fermentación natural de cinco días en bolsas GrainPro y un perfil dulce, frutal y floral.',accent:'#7c7550' },
    { id:11,name:'Bourbon Rosado',municipality:'Cumbitara y Buesaco',farm:'El Turpial / lotes documentados de Nariño',producer:'Productores de especialidad',altitude:'Hasta 2.200 m s. n. m.',variety:'Bourbon Rosado / Pink Bourbon',group:'Especiales',species:'Coffea arabica',lineage:'Material de ascendencia etíope según evidencia genética reciente; el nombre comercial histórico puede inducir a confusión.',plantType:'Porte medio-alto y cereza rosada al madurar.',rustResistance:'No se considera una variedad resistente.',evidence:'ADR El Turpial + lotes comerciales documentados en Nariño',process:'Lavado',harvest:'Selección manual por color de madurez.',drying:'Camas elevadas · propuesta de lote',roast:'Claro',score:'Lote especial',notes:['Mandarina','Flores','Panela'],price:76000,image:'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Conocido por su cereza rosada y potencial floral. Se conserva el nombre usado en el mercado, pero la ficha aclara que no sería simplemente un cruce entre Borbones rojo y amarillo.',accent:'#b66a67' },
    { id:12,name:'SL28',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'SL28',group:'Especiales',species:'Coffea arabica',lineage:'Selección realizada en Kenia por Scott Agricultural Laboratories.',plantType:'Porte alto, vigoroso y reconocido por tolerancia a sequía.',rustResistance:'Susceptible a roya en muchos ambientes.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Grosella','Cítrico','Dulce'],price:82000,image:'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Selección keniana cultivada experimentalmente en Nariño. Su comportamiento y perfil cambian con el ambiente andino; no se debe asumir que sabrá igual que un café de Kenia.',accent:'#9f4c37' },
    { id:13,name:'Laurina',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Laurina',group:'Especiales',species:'Coffea arabica',lineage:'Mutación de Borbón conocida también como Bourbon Pointu.',plantType:'Porte compacto, grano alargado y rendimiento limitado.',rustResistance:'Susceptible; manejo agronómico exigente.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Selección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Dulce','Té','Fruta amarilla'],price:88000,image:'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Variedad escasa conocida por su morfología puntiaguda y menor contenido natural de cafeína respecto de arábicas comunes. Su presencia en Nariño está documentada en El Turpial.',accent:'#8a704b' },
    { id:14,name:'Sidra',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Sidra',group:'Especiales',species:'Coffea arabica',lineage:'Material de especialidad de origen genético aún discutido; asociado a germoplasma etíope.',plantType:'Porte medio-alto y alta exigencia nutricional.',rustResistance:'Susceptible; requiere manejo intensivo.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Floral','Uva','Miel'],price:86000,image:'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Cultivar de especialidad con identidad genética todavía debatida. La ficha evita repetir como hecho la popular atribución a un cruce Típica–Borbón.',accent:'#665d76' },
    { id:15,name:'Wush Wush',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Wush Wush',group:'Especiales',species:'Coffea arabica',lineage:'Landrace etíope asociado a la zona de Wushwush.',plantType:'Porte alto y adaptación variable fuera de Etiopía.',rustResistance:'Sin resistencia general garantizada.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Fruta tropical','Floral','Especias'],price:92000,image:'https://images.unsplash.com/photo-1511081692775-05d0f180a065?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Material etíope de producción limitada incorporado a la experimentación de especialidad en Cumbitara. El proceso poscosecha influye de manera decisiva en su expresión sensorial.',accent:'#5b3c4c' },
    { id:16,name:'Etíope',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Material etíope no especificado',group:'Especiales',species:'Coffea arabica',lineage:'Germoplasma de procedencia etíope; la fuente no identifica el cultivar exacto.',plantType:'No determinado públicamente para este lote.',rustResistance:'No determinada públicamente.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Flores','Cítrico','Fruta'],price:84000,image:'https://images.unsplash.com/photo-1525088553748-01d6e210e00b?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'La fuente enumera “Ethiopian” sin mayor identificación. Se mantiene esa precisión: es una categoría de germoplasma documentada, no un nombre varietal suficientemente resuelto.',accent:'#6e5d3f' },
    { id:17,name:'Sudán',municipality:'Cumbitara',farm:'Café El Turpial · referencia documentada',producer:'Asociación de Caficultores de Cumbitara',altitude:'2.200 m s. n. m.',variety:'Material sudanés no especificado',group:'Especiales',species:'Coffea arabica',lineage:'Germoplasma reportado como “Sudan”; la fuente no publica la accesión concreta.',plantType:'No determinado públicamente para este lote.',rustResistance:'No determinada públicamente.',evidence:'Agencia de Desarrollo Rural · El Turpial, Cumbitara',process:'Natural',harvest:'Recolección manual documentada.',drying:'Secado solar natural documentado',roast:'Claro',score:'Lote especial',notes:['Fruta roja','Hierbas','Miel'],price:84000,image:'https://images.unsplash.com/photo-1516743619420-154b70a65fea?auto=format&fit=crop&w=1200&q=88',imageCredit:'Fotografía documental · Unsplash',story:'Entrada conservada con el nombre publicado por la fuente. Sin una accesión o cultivar verificable, el catálogo no le atribuye genealogía ni resistencia específicas.',accent:'#715141' }
  ] as Omit<Coffee, 'imageSource' | 'cardImage' | 'homeImage' | 'priceBasis' | 'priceSource' | 'priceCheckedAt'>[]).map((coffee, index) => {
    const isPinkBourbon = coffee.name === 'Bourbon Rosado';
    const isSpecial = coffee.group === 'Especiales';
    const priceAudit = isPinkBourbon
      ? {
          price: 64000,
          basis: '$64.000 por 250 g para un Bourbon Rosado de Nariño publicado por Típica.',
          source: 'https://cafetipica.com/products/cafe-bourbon-rosado-lavado-250gr'
        }
      : isSpecial
        ? {
            price: 61000,
            basis: '$61.000 por 250 g como referencia minorista comparable para cafés varietales; no corresponde a una subasta.',
            source: 'https://www.cafe18.com.co/tienda/cafe-tostado/varietales'
          }
        : {
            price: 28500,
            basis: '$57.000 por 500 g de café Castillo de Nariño, normalizado a 250 g.',
            source: 'https://cafe18.com.co/tienda/cafe-tostado/regionales/narino'
          };

    return {
      ...coffee,
      price: priceAudit.price,
      priceBasis: priceAudit.basis,
      priceSource: priceAudit.source,
      priceCheckedAt: '12 de agosto de 2026',
      homeImage: index < 3 ? coffee.image : undefined,
      image: PRODUCT_IMAGES[index].url,
      cardImage: PRODUCT_IMAGES[index].url.replace('w=1200&h=1500', 'w=480&h=600'),
      imageCredit: PRODUCT_IMAGES[index].credit,
      imageSource: PRODUCT_IMAGES[index].source
    };
  });
