export const PROFILE_DATA = {
  identity: {
    name: 'Milan Mičieta',
    handle: '@milan-micieta',
    role: 'Full-Stack Software Engineer & UI Architect',
    location: 'Košice, Slovensko · FEI TUKE, Enterprise & Open Source',
    githubUrl: 'https://github.com/milan-micieta',
    gitlabSchool: 'https://git.kpi.fei.tuke.sk/mm613gz',
    email: 'milan.micieta@gmail.com',
    headline:
      'Tvorím premyslené digitálne produkty, 3D priemyselné rozhrania a spoľahlivú systémovú architektúru',
    subhead:
      'Full-stack softvérový inžinier so zameraním na .NET, React, Spring Boot a 3D WebGL. Autor systému DRAVEN na FEI TUKE a prispievateľ do open source.',
    availability: 'Otvorený pre ambiciózne produktové projekty a technickú spoluprácu',
  },

  aboutStory: {
    kicker: '01 / INŽINIERSKY PROFIL & ZÁZEMIE',
    title: 'Zameranie, skúsenosti a technický kontext',
    lead:
      'Pôsobím ako full-stack inžinier so zameraním na architektúru v .NET a Java, aplikovaný výskum na FEI TUKE a webovú 3D grafiku v Three.js. Zaujímajú ma systémy, kde záleží na spoľahlivosti, čistom kóde a presnej práci s dátami.',
  },

  focusAreas: [
    {
      id: 'focus-research',
      kicker: 'Výskum & EdTech',
      title: 'DRAVEN · Automatizované hodnotenie SQL',
      description:
        'Návrh a realizácia hodnotiaceho enginu DRAVEN pre DataGrip. Overené v praxi na 42 študentoch so skóre použiteľnosti SUS 84.5 a publikáciou na IEEE.',
      chips: ['IntelliJ Platform SDK', 'Spring Boot 3.4', 'PostgreSQL Sandbox'],
    },
    {
      id: 'focus-oss',
      kicker: 'Open-Source Príspevky',
      title: 'MudBlazor · Začlenené opravy jadra',
      description:
        'Aktívny prispievateľ do knižnice MudBlazor (.NET Blazor) — začlenené PR #14074 (korekcia pozície popoverov pri CSS zoome) a PR #13946 (životný cyklus dialógov).',
      chips: ['C# / .NET', 'Blazor WebAssembly', 'bUnit Regresie'],
    },
    {
      id: 'focus-enterprise',
      kicker: 'Priemyselný 3D Web & PWA',
      title: 'Digitálne dvojčatá & Offline-first systémy',
      description:
        'Vývoj systémov pre plánovanie výroby, sledovanie prestojov, offline-first PWA a izometrické 3D digitálne dvojča výrobného závodu v Three.js.',
      chips: ['Three.js WebGL', 'Offline-First PWA', 'Kapacitné plánovanie'],
    },
  ],

  categories: [
    { id: 'all', label: 'Všetky projekty' },
    { id: 'research', label: 'Výskum & FEI TUKE' },
    { id: 'work', label: 'Priemysel & Enterprise' },
    { id: 'open-source', label: 'Open Source' },
  ],

  projects: [
    {
      id: 'draven-sql-evaluation',
      index: '01',
      featured: true,
      title: 'DRAVEN — Automatizované vyhodnocovanie SQL riešení v DataGripe',
      category: 'research',
      categoryLabel: 'Výskum & EdTech · JetBrains DataGrip + Spring Boot',
      year: '2025 — 2026',
      role: 'Autor architektúry, pluginu, backendu a IEEE štúdie',
      summary:
        'Kompletná platforma integrujúca zadávanie skúšok a okamžité vyhodnocovanie SQL dopytov priamo v prostredí JetBrains DataGrip.',
      metrics: {
        primaryLabel: 'Overenie v praxi (42 študentov)',
        primaryValue: 'SUS 84.5 / 100',
        comparison: '90 % študentov chce systém znova',
      },
      stack: ['Java 17', 'Spring Boot 3.4', 'IntelliJ Platform SDK', 'React 18', 'PostgreSQL'],
      repoUrl: 'https://github.com/milan-micieta/DRAVEN-Server',
      artifact: {
        file: 'evaluate_query.sql',
        badge: 'PostgreSQL Read-Only Sandbox',
        code: `-- Izolovaný sandbox: Read-Only transakcia s automatickým rollbackom
SELECT student_id, task_id, execution_time_ms
FROM evaluate_submission(attempt_no => 1);
-- Overenie: Zhoda stĺpcov a riadkov (LinkedHashMap) · 0ms rollback`,
        tags: ['Read-Only Sandbox', '10s Query Guard', 'LinkedHashMap Diff', 'SUS 84.5 / 100'],
      },
      highlights: [
        'Vyhodnocovací engine porovnávajúci dátové množiny (LinkedHashMap) namiesto textovej zhody SQL.',
        'Izolovaný read-only sandbox s automatickým rollbackom transakcie a 10s timeoutom.',
        'DataGrip plugin s časovačom skúšky, sťahovaním úloh a JWT autentifikáciou.',
      ],
    },
    {
      id: 'industrial-digital-twin',
      index: '02',
      featured: true,
      title: 'Interaktívne 3D digitálne dvojča výrobného závodu',
      category: 'work',
      categoryLabel: 'Priemyselná 3D vizualizácia · Three.js & WebGL',
      year: '2026',
      role: 'Autor 3D WebGL scény, procedurálnych modelov a kamerovej logiky',
      summary:
        'Izometrická 3D aplikácia zobrazujúca digitálne dvojča strojárskeho závodu so sledovaním stavu pracovísk v reálnom čase.',
      metrics: {
        primaryLabel: 'Modelovaný pôdorys a navigácia',
        primaryValue: '3422 × 1382 px',
        comparison: 'Dvojúrovňový ortografický zoom',
      },
      stack: ['Three.js', 'WebGL', 'JavaScript ES6+', 'CSS2DRenderer', 'Polygon Extrusion'],
      repoUrl: 'https://github.com/milan-micieta',
      artifact: {
        file: 'scene_factory.ts',
        badge: 'Three.js · WebGL Orthographic',
        code: `// Procedurálna extrúzia hál a 2-úrovňový ortografický zoom
const hallGeometry = new THREE.ExtrudeGeometry(hall2DPolygon, { depth: 14 });
const edges = new THREE.EdgesGeometry(hallGeometry);
const label = new CSS2DObject(createMachineTag(machine.type));`,
        tags: ['3422 × 1382 px Pôdorys', '7 typov strojov', 'CSS2DRenderer', '60 FPS Ortho'],
      },
      highlights: [
        'Procedurálne generovanie hál z 2D polygónov so stavovou indikáciou (V norme / Porucha).',
        'Parametrické modely pre 7 typov strojov: CNC, lasery, roboty, dopravníky, regály a lisy.',
        'Raycasting a plynulá interpolácia ortografickej kamery s inšpekčným HUD panelom.',
      ],
    },
    {
      id: 'mudblazor-oss',
      index: '03',
      featured: true,
      title: 'MudBlazor — Open-Source opravy komponentov MudPopover a MudDialog',
      category: 'open-source',
      categoryLabel: 'Open Source · .NET Blazor ekosystém (GitHub)',
      year: '2026',
      role: 'Open-Source Contributor (@milan-micieta)',
      summary:
        'Dva začlenené pull requesty do oficiálneho repozitára MudBlazor riešiace chyby geometrie a životného cyklu dialógov.',
      metrics: {
        primaryLabel: 'Začlenené PRs do MudBlazor Core',
        primaryValue: 'PR #14074 & #13946',
        comparison: '100% schválené a pretestované bUnit',
      },
      stack: ['C#', '.NET', 'Blazor WebAssembly', 'JavaScript', 'bUnit'],
      repoUrl: 'https://github.com/MudBlazor/MudBlazor/pull/14074',
      artifact: {
        file: 'MudPopover.js & MudDialog.cs',
        badge: 'github.com/MudBlazor/MudBlazor · Merged',
        code: `// PR #14074: Korekcia pozície MudPopover pri CSS body { zoom }
var zoom = await _jsRuntime.InvokeAsync<double>("mudWindow.getZoom");
var left = (clientRect.Left / zoom) + windowScrollX;
var maxWidth = (windowWidth / zoom) - left;`,
        tags: ['PR #14074 (Popover Zoom)', 'PR #13946 (Dialog Lifecycle)', 'bUnit Regresie'],
      },
      highlights: [
        'PR #14074: Výpočet left/top pozície MudPopover s kompenzáciou CSS body { zoom }.',
        'PR #13946: Ošetrenie race-condition v MudDialog pri okamžitom znovuotvorení.',
        'Pokrytie regresnými bUnit testami v C# overujúcimi stabilitu stavu.',
      ],
    },
    {
      id: 'stremio-streamcinema',
      index: '04',
      featured: false,
      title: 'Stream Cinema — Serverless doplnok na Vercel Edge',
      category: 'open-source',
      categoryLabel: 'Open Source & Serverless · TypeScript',
      year: '2026',
      role: 'Autor architektúry, streamovacieho routera a konfigurátora',
      summary:
        '100% bezstavový TypeScript addon na Vercel Serverless s priamym presmerovaním HTTP 302 na CDN streamy.',
      metrics: {
        primaryLabel: 'Režim prevádzky & Odozva',
        primaryValue: '< 15 ms',
        comparison: 'Stateless · Zero DB overhead',
      },
      stack: ['TypeScript', 'Node.js 20', 'Vercel Serverless', 'Vitest'],
      repoUrl: 'https://github.com/milan-micieta/stremio-streamcinema',
      artifact: {
        file: 'stream_router.ts',
        badge: 'Vercel Serverless · HTTP 302',
        code: `// Bezstavové vyhodnotenie konfigurácie a priame CDN presmerovanie
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const stream = await resolveBestCdnStream(req.query.imdbId, { preferHevc: true });
  return res.redirect(302, stream.directCdnUrl);
}`,
        tags: ['100% Stateless', 'Zero DB Overhead', '4K HDR HEVC Radenie', 'Vitest'],
      },
      highlights: [
        'Bezstavové odvodzovanie prihlasovacích údajov priamo z URL konfigurátora.',
        'Priame HTTP 302 presmerovanie streamu na CDN bez zbytočného prenosu dát cez server.',
        'Viac-okenné vyhľadávanie a prioritizácia 4K HDR HEVC streamov s CZ/SK dabingom.',
      ],
    },
    {
      id: 'enterprise-planning-pwa',
      index: '05',
      featured: false,
      title: 'Podnikové systémy pre plánovanie výroby a správu aktív (PWA)',
      category: 'work',
      categoryLabel: 'Priemysel & Enterprise · .NET Core & Blazor',
      year: '2025 — 2026',
      role: 'Full-Stack architekt a vývojár podnikových modulov',
      summary:
        'Vývoj rozsiahlych modulov pre kapacitné plánovanie výroby, evidenciu prestojov a terénnu offline-first správu aktív.',
      metrics: {
        primaryLabel: 'Prevádzkový režim aplikácie',
        primaryValue: 'Offline-First PWA',
        comparison: 'Okamžitá synchronizácia po obnovení siete',
      },
      stack: ['C#', 'ASP.NET Core', 'Blazor', 'MudBlazor', 'PWA / Service Worker', 'SQL'],
      repoUrl: 'https://github.com/milan-micieta',
      artifact: {
        file: 'downtime_sync_worker.cs',
        badge: 'ASP.NET Core & Blazor · PWA',
        code: `// Terénna evidencia prestojov s lokálnou IndexedDB frontou
if (!networkService.IsOnline) {
  await localIndexedDb.EnqueueDowntimeEventAsync(report);
} else {
  await mesHub.PublishRealtimeEventAsync(report);
}`,
        tags: ['Plánovanie liniek', 'Offline IndexedDB Queue', 'MudBlazor PWA', 'Audit prestojov'],
      },
      highlights: [
        'Návrh architektúry pre evidenciu prestojov a plánovanie liniek v reálnom čase.',
        'Offline-first synchronizácia formulárov terénnych pracovníkov cez IndexedDB a background sync.',
        'Interaktívne reportingové dashboardy s agregovanými výrobnými metrikami.',
      ],
    },
    {
      id: 'ticketlake-data-platform',
      index: '06',
      featured: false,
      title: 'Ticketlake — Dátová platforma a streaming cien lístkov',
      category: 'research',
      categoryLabel: 'Výskum & Data Platform',
      year: '2025 — 2026',
      role: 'Vývoj scraping workerov a broker pipeline',
      summary:
        'Dátová pipeline pre periodický zber a streaming cien leteniek (VIE, BUD, BTS, KSC) a kultúrnych podujatí.',
      metrics: {
        primaryLabel: 'Protokoly a architektúra streamovania',
        primaryValue: 'Kafka · MQTT · RabbitMQ',
        comparison: 'Viac-uzlová distribuovaná fronta',
      },
      stack: ['Java / Spring Boot', 'Python', 'Playwright', 'Apache Kafka', 'MQTT over TLS', 'PostgreSQL'],
      repoUrl: 'https://github.com/milan-micieta/scraper-for-data-engineering-course',
      artifact: {
        file: 'event_publisher.py',
        badge: 'Kafka · MQTT/TLS · RabbitMQ',
        code: `# Playwright scraper worker -> Kafka topic & MQTT/TLS
for flight in scrape_flight_matrix(["VIE", "BUD", "BTS", "KSC"]):
  kafka_producer.send("flights.price.updates", key=flight.route, value=flight.json())`,
        tags: ['Apache Kafka', 'MQTT over TLS', 'RabbitMQ', 'Playwright Scraper'],
      },
      highlights: [
        'Automatizovaný zber dát cez Playwright a reverzné inžinierstvo interných GraphQL endpointov.',
        'Paralelné publikovanie udalostí do Apache Kafka, MQTT/TLS a RabbitMQ brokerov.',
        'Ukladanie a verifikácia dátových schém v PostgreSQL.',
      ],
    },
    {
      id: 'rails-sails-ml-generator',
      index: '07',
      featured: false,
      title: 'Rails & Sails — Predikcia bodových hodnôt v dopravnej sieti cez Graph ML',
      category: 'open-source',
      categoryLabel: 'Open Source & Graph ML · Python',
      year: '2025',
      role: 'Dátový vedec & Vývojár ML pipeline',
      summary:
        'Predikcia optimálnych hodnôt trás na neorientovaných multierových grafoch s extrakciou 9 topologických príznakov.',
      metrics: {
        primaryLabel: 'Algoritmy & Validácia',
        primaryValue: '7 Regresných modelov',
        comparison: 'Stratified K-Fold krížová validácia',
      },
      stack: ['Python', 'NetworkX', 'scikit-learn', 'pandas', 'matplotlib'],
      repoUrl: 'https://github.com/milan-micieta/Rails-Sails-Generator',
      artifact: {
        file: 'route_predictor.py',
        badge: 'NetworkX & scikit-learn',
        code: `# Extrakcia 9 topologických príznakov z multigrafu trás
features = extract_graph_features(G, node_u, node_v)
score = gradient_boosting_model.predict(features)`,
        tags: ['9 Topologických príznakov', '7 Regresorov (GB, RF, SVR)', 'StratifiedKFold'],
      },
      highlights: [
        'Modelovanie hernej mapy ako neorientovaného multigrafu v NetworkX s 9 topologickými príznakmi.',
        'Porovnanie 7 regresorov (Random Forest, Gradient Boosting, Ridge, SVR) s ladením hyperparametrov.',
        'Kompletná analýza rezíduí a vizualizácia dôležitosti príznakov (feature importance).',
      ],
    },
  ],

  skillMatrix: [
    {
      category: 'Backend & Architektúra',
      skills: ['C# / .NET Core', 'Java 17 / Spring Boot 3.4', 'PostgreSQL & Transakcie', 'Kafka · MQTT · RabbitMQ'],
    },
    {
      category: 'Frontend & 3D Web',
      skills: ['React 18 & TypeScript', 'Blazor & MudBlazor', 'Three.js / WebGL & CSS2D', 'Offline-First PWA'],
    },
    {
      category: 'Tooling & Dátová veda',
      skills: ['IntelliJ Platform SDK', 'Python (NetworkX, scikit-learn)', 'Playwright & Selenium', 'Docker & Vercel Edge'],
    },
  ],

  timeline: [
    {
      period: '2025 — Súčasnosť',
      badge: 'Enterprise Vývoj',
      role: 'Full-Stack Software Engineer',
      org: 'Priemyselné podnikové systémy, 3D vizualizácie & Offline PWA',
    },
    {
      period: '2025 — 2026',
      badge: 'Výskum & Publikácia',
      role: 'Autor systému DRAVEN & IEEE štúdie',
      org: 'KPI FEI Technická univerzita v Košiciach',
    },
    {
      period: '2026',
      badge: 'Open-Source',
      role: 'Core Contributor (@milan-micieta)',
      org: 'MudBlazor — komponentový ekosystém pre .NET Blazor',
    },
  ],
};
