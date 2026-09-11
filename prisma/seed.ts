import { PrismaClient, RoomMode, LeadStatus, ArticleStatus, AdGroup } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { scryptSync, randomBytes } from "node:crypto";

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL }) });

const slugify = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const pic = (seed: string, w = 900, h = 640) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const categories = [
  { name: "Clínicas médicas", slug: "clinicas-medicas", kind: "COMPANY", icon: "stethoscope", order: 1 },
  { name: "Odontologia", slug: "odontologia", kind: "COMPANY", icon: "smile", order: 2 },
  { name: "Diagnóstico e exames", slug: "diagnostico-exames", kind: "COMPANY", icon: "scan", order: 3 },
  { name: "Terapias e reabilitação", slug: "terapias-reabilitacao", kind: "COMPANY", icon: "heart-pulse", order: 4 },
  { name: "Saúde mental", slug: "saude-mental", kind: "COMPANY", icon: "brain", order: 5 },
  { name: "Estética e bem-estar", slug: "estetica-bem-estar", kind: "COMPANY", icon: "sparkles", order: 6 },
  { name: "Lojas", slug: "lojas", kind: "SERVICE", icon: "shopping-bag", order: 7 },
  { name: "Escritórios", slug: "escritorios", kind: "SERVICE", icon: "briefcase", order: 8 },
  { name: "Estacionamento", slug: "estacionamento", kind: "SERVICE", icon: "car", order: 9 },
  { name: "Lava-car", slug: "lava-car", kind: "SERVICE", icon: "droplets", order: 10 },
  { name: "Auditório", slug: "auditorio", kind: "SERVICE", icon: "presentation", order: 11 },
] as const;

const specialties = [
  "Cardiologia", "Dermatologia", "Pediatria", "Ortopedia", "Ginecologia e Obstetrícia",
  "Endocrinologia", "Oftalmologia", "Otorrinolaringologia", "Neurologia", "Clínica Geral",
  "Ortodontia", "Implantodontia", "Odontopediatria", "Periodontia", "Fisioterapia",
  "Nutrição", "Psicologia", "Psiquiatria", "Fonoaudiologia", "Radiologia",
  "Análises Clínicas", "Dermatologia Estética", "Geriatria", "Reumatologia",
];

type CompanySeed = {
  ext: string; name: string; cat: string; specs: string[]; room: string; floor: number;
  hours: string; phone: string; whatsapp: string; instagram?: string; website?: string;
  description: string; featured?: boolean; active?: boolean;
};

const companies: CompanySeed[] = [
  { ext: "EMP-001", name: "CardioVita Centro do Coração", cat: "clinicas-medicas", specs: ["Cardiologia", "Clínica Geral"], room: "701", floor: 7, hours: "Seg a Sex 7h às 19h, Sáb 8h às 12h", phone: "(11) 3045-7001", whatsapp: "5511987007001", instagram: "cardiovita", website: "https://cardiovita.example", description: "Consultas cardiológicas, ecocardiograma, teste ergométrico, Holter e MAPA no mesmo andar. Atendimento a convênios e particular, com laudos entregues em até 48 horas.", featured: true },
  { ext: "EMP-002", name: "Clínica Aurora Pediatria", cat: "clinicas-medicas", specs: ["Pediatria"], room: "502", floor: 5, hours: "Seg a Sex 8h às 18h", phone: "(11) 3045-5002", whatsapp: "5511987005002", instagram: "clinicaaurorakids", description: "Pediatria geral, puericultura e acompanhamento do desenvolvimento. Sala de espera lúdica, atendimento sem agendamento para casos de urgência leve.", featured: true },
  { ext: "EMP-003", name: "DermaSense", cat: "clinicas-medicas", specs: ["Dermatologia", "Dermatologia Estética"], room: "604", floor: 6, hours: "Seg a Sex 9h às 20h", phone: "(11) 3045-6004", whatsapp: "5511987006004", instagram: "dermasense.sp", description: "Dermatologia clínica e cirúrgica, mapeamento de pintas com dermatoscopia digital e tratamentos a laser.", featured: true },
  { ext: "EMP-004", name: "OrtoMov Ortopedia e Coluna", cat: "clinicas-medicas", specs: ["Ortopedia", "Reumatologia"], room: "703", floor: 7, hours: "Seg a Sex 7h30 às 19h", phone: "(11) 3045-7003", whatsapp: "5511987007003", description: "Ortopedia geral, coluna, joelho e ombro. Infiltrações guiadas por ultrassom e integração com a fisioterapia do 4º andar." },
  { ext: "EMP-005", name: "Femina Saúde da Mulher", cat: "clinicas-medicas", specs: ["Ginecologia e Obstetrícia", "Endocrinologia"], room: "503", floor: 5, hours: "Seg a Sex 8h às 19h", phone: "(11) 3045-5003", whatsapp: "5511987005003", instagram: "feminasaude", description: "Ginecologia, pré-natal, climatério e endocrinologia feminina. Ultrassonografia obstétrica na própria clínica." },
  { ext: "EMP-006", name: "Visão Plena Oftalmologia", cat: "clinicas-medicas", specs: ["Oftalmologia"], room: "605", floor: 6, hours: "Seg a Sex 8h às 18h, Sáb 8h às 13h", phone: "(11) 3045-6005", whatsapp: "5511987006005", description: "Consultas, exames de refração, mapeamento de retina, topografia e adaptação de lentes de contato." },
  { ext: "EMP-007", name: "Otoclin", cat: "clinicas-medicas", specs: ["Otorrinolaringologia", "Fonoaudiologia"], room: "606", floor: 6, hours: "Seg a Sex 8h às 18h", phone: "(11) 3045-6006", whatsapp: "5511987006006", description: "Otorrinolaringologia adulta e infantil, audiometria e videolaringoscopia." },
  { ext: "EMP-008", name: "NeuroCentro Paulista", cat: "clinicas-medicas", specs: ["Neurologia", "Geriatria"], room: "702", floor: 7, hours: "Seg a Sex 8h às 18h", phone: "(11) 3045-7002", whatsapp: "5511987007002", description: "Neurologia clínica, cefaleias, epilepsia, distúrbios de memória e avaliação geriátrica ampla." },
  { ext: "EMP-009", name: "Sorriso Prime Odontologia", cat: "odontologia", specs: ["Ortodontia", "Implantodontia", "Periodontia"], room: "301", floor: 3, hours: "Seg a Sex 8h às 20h, Sáb 8h às 14h", phone: "(11) 3045-3001", whatsapp: "5511987003001", instagram: "sorrisoprime", description: "Clínica odontológica completa: ortodontia com alinhadores, implantes guiados por tomografia e periodontia.", featured: true },
  { ext: "EMP-010", name: "Kids Dental", cat: "odontologia", specs: ["Odontopediatria", "Ortodontia"], room: "302", floor: 3, hours: "Seg a Sex 8h às 18h", phone: "(11) 3045-3002", whatsapp: "5511987003002", description: "Odontopediatria com ambiente pensado para crianças, ortodontia preventiva e interceptativa." },
  { ext: "EMP-011", name: "Dental Art Studio", cat: "odontologia", specs: ["Implantodontia"], room: "304", floor: 3, hours: "Seg a Sex 9h às 19h", phone: "(11) 3045-3004", whatsapp: "5511987003004", description: "Reabilitação oral, lentes de contato dentais e implantes com escaneamento digital." },
  { ext: "EMP-012", name: "Laboratório Diagnose", cat: "diagnostico-exames", specs: ["Análises Clínicas"], room: "201", floor: 2, hours: "Seg a Sex 6h30 às 17h, Sáb 7h às 12h", phone: "(11) 3045-2001", whatsapp: "5511987002001", website: "https://diagnose.example", description: "Coleta de exames laboratoriais a partir das 6h30, resultados on-line e coleta domiciliar.", featured: true },
  { ext: "EMP-013", name: "Imagem Central", cat: "diagnostico-exames", specs: ["Radiologia"], room: "202", floor: 2, hours: "Seg a Sex 7h às 20h, Sáb 7h às 14h", phone: "(11) 3045-2002", whatsapp: "5511987002002", description: "Ultrassonografia, raio-X digital, mamografia e densitometria óssea. Laudos em 24 horas." },
  { ext: "EMP-014", name: "Fisio Ativa Reabilitação", cat: "terapias-reabilitacao", specs: ["Fisioterapia"], room: "401", floor: 4, hours: "Seg a Sex 7h às 21h", phone: "(11) 3045-4001", whatsapp: "5511987004001", instagram: "fisioativa", description: "Fisioterapia ortopédica, esportiva e pélvica, pilates clínico e RPG em ambiente de 180 m²." },
  { ext: "EMP-015", name: "Nutrir Consultório de Nutrição", cat: "terapias-reabilitacao", specs: ["Nutrição"], room: "402", floor: 4, hours: "Seg a Sex 8h às 19h", phone: "(11) 3045-4002", whatsapp: "5511987004002", description: "Nutrição clínica, esportiva e comportamental, com bioimpedância e acompanhamento por aplicativo." },
  { ext: "EMP-016", name: "Fala & Escuta Fonoaudiologia", cat: "terapias-reabilitacao", specs: ["Fonoaudiologia"], room: "403", floor: 4, hours: "Seg a Sex 8h às 18h", phone: "(11) 3045-4003", whatsapp: "5511987004003", description: "Fonoaudiologia infantil e adulta, audiologia e terapia de voz." },
  { ext: "EMP-017", name: "Espaço Mente Aberta", cat: "saude-mental", specs: ["Psicologia", "Psiquiatria"], room: "801", floor: 8, hours: "Seg a Sex 8h às 21h, Sáb 9h às 14h", phone: "(11) 3045-8001", whatsapp: "5511987008001", instagram: "espacomenteaberta", description: "Psicologia e psiquiatria integradas, atendimento presencial e on-line, grupos terapêuticos aos sábados.", featured: true },
  { ext: "EMP-018", name: "Consultório Dra. Helena Prado", cat: "saude-mental", specs: ["Psiquiatria"], room: "803", floor: 8, hours: "Ter, Qui e Sex 9h às 18h", phone: "(11) 3045-8003", whatsapp: "5511987008003", description: "Psiquiatria adulta com foco em ansiedade, depressão e transtornos do sono." },
  { ext: "EMP-019", name: "Lumière Estética Avançada", cat: "estetica-bem-estar", specs: ["Dermatologia Estética"], room: "601", floor: 6, hours: "Seg a Sáb 9h às 20h", phone: "(11) 3045-6001", whatsapp: "5511987006001", instagram: "lumiere.estetica", description: "Procedimentos estéticos com supervisão médica: laser, bioestimuladores e protocolos faciais." },
  { ext: "EMP-020", name: "Farmácia Bem Viver", cat: "lojas", specs: [], room: "L01", floor: 0, hours: "Seg a Sáb 7h às 22h, Dom 8h às 20h", phone: "(11) 3045-0101", whatsapp: "5511987000101", description: "Farmácia com manipulação, entrega no prédio e aferição de pressão gratuita." },
  { ext: "EMP-021", name: "Ótica Foco", cat: "lojas", specs: [], room: "L02", floor: 0, hours: "Seg a Sex 9h às 19h, Sáb 9h às 14h", phone: "(11) 3045-0102", whatsapp: "5511987000102", description: "Óculos de grau e de sol, lentes de contato e ajuste de armações no mesmo dia." },
  { ext: "EMP-022", name: "Café Andar Zero", cat: "lojas", specs: [], room: "L03", floor: 0, hours: "Seg a Sex 6h30 às 20h, Sáb 7h às 14h", phone: "(11) 3045-0103", whatsapp: "5511987000103", instagram: "cafeandarzero", description: "Café de especialidade, lanches leves e opções sem glúten e sem lactose." },
  { ext: "EMP-023", name: "Ortopedia & Cia", cat: "lojas", specs: [], room: "L04", floor: 0, hours: "Seg a Sex 8h às 19h, Sáb 8h às 13h", phone: "(11) 3045-0104", whatsapp: "5511987000104", description: "Produtos ortopédicos, órteses, meias de compressão e cadeiras de rodas." },
  { ext: "EMP-024", name: "Ribeiro & Tavares Contabilidade", cat: "escritorios", specs: [], room: "902", floor: 9, hours: "Seg a Sex 9h às 18h", phone: "(11) 3045-9002", whatsapp: "5511987009002", description: "Contabilidade especializada em clínicas e profissionais de saúde, abertura de PJ médica." },
  { ext: "EMP-025", name: "Bastos Advocacia em Saúde", cat: "escritorios", specs: [], room: "903", floor: 9, hours: "Seg a Sex 9h às 18h", phone: "(11) 3045-9003", whatsapp: "5511987009003", description: "Direito médico e da saúde, contratos com operadoras e compliance para clínicas." },
  { ext: "EMP-026", name: "Estacionamento Vitalis Park", cat: "estacionamento", specs: [], room: "SS1", floor: -1, hours: "Todos os dias 6h às 23h", phone: "(11) 3045-0001", whatsapp: "5511987000001", description: "320 vagas cobertas em dois subsolos, vagas para PCD e idosos, validação de ticket nas clínicas." },
  { ext: "EMP-027", name: "Lava-car Cristal", cat: "lava-car", specs: [], room: "SS2", floor: -2, hours: "Seg a Sáb 8h às 19h", phone: "(11) 3045-0002", whatsapp: "5511987000002", description: "Lavagem simples e completa enquanto você está na consulta. Retire o carro pronto." },
  { ext: "EMP-028", name: "Auditório Vitalis", cat: "auditorio", specs: [], room: "A01", floor: 1, hours: "Sob agenda", phone: "(11) 3045-1001", whatsapp: "5511987001001", description: "Auditório com 120 lugares, projeção 4K, som e apoio para eventos científicos e corporativos. Reservas direto com a administração." },
  { ext: "EMP-029", name: "Clínica Renovar (em reforma)", cat: "clinicas-medicas", specs: ["Clínica Geral"], room: "504", floor: 5, hours: "Em breve", phone: "(11) 3045-5004", whatsapp: "5511987005004", description: "Clínica geral e check-up executivo. Inauguração prevista para o próximo trimestre.", active: false },
];

type ProSeed = { ext: string; name: string; council: string; reg: string; uf: string; specs: string[]; companies: string[]; bio?: string; active?: boolean };

const professionals: ProSeed[] = [
  { ext: "PRO-001", name: "Dr. Rafael Nogueira", council: "CRM", reg: "112.345", uf: "SP", specs: ["Cardiologia"], companies: ["EMP-001"], bio: "Cardiologista clínico e ecocardiografista, mestre pela USP." },
  { ext: "PRO-002", name: "Dra. Camila Duarte", council: "CRM", reg: "128.774", uf: "SP", specs: ["Cardiologia", "Clínica Geral"], companies: ["EMP-001", "EMP-029"] },
  { ext: "PRO-003", name: "Dra. Beatriz Andrade", council: "CRM", reg: "134.210", uf: "SP", specs: ["Pediatria"], companies: ["EMP-002"], bio: "Pediatra com atuação em puericultura e amamentação." },
  { ext: "PRO-004", name: "Dr. Thiago Sales", council: "CRM", reg: "119.980", uf: "SP", specs: ["Pediatria"], companies: ["EMP-002"] },
  { ext: "PRO-005", name: "Dra. Luana Ferraz", council: "CRM", reg: "121.556", uf: "SP", specs: ["Dermatologia", "Dermatologia Estética"], companies: ["EMP-003", "EMP-019"], bio: "Dermatologista, membro da SBD, atua em dermatologia clínica e estética." },
  { ext: "PRO-006", name: "Dr. Marcos Vinícius Reis", council: "CRM", reg: "98.712", uf: "SP", specs: ["Dermatologia"], companies: ["EMP-003"] },
  { ext: "PRO-007", name: "Dr. André Camargo", council: "CRM", reg: "105.433", uf: "SP", specs: ["Ortopedia"], companies: ["EMP-004"], bio: "Ortopedista especialista em joelho e medicina esportiva." },
  { ext: "PRO-008", name: "Dra. Patrícia Lemos", council: "CRM", reg: "110.221", uf: "SP", specs: ["Reumatologia"], companies: ["EMP-004"] },
  { ext: "PRO-009", name: "Dra. Fernanda Maciel", council: "CRM", reg: "115.890", uf: "SP", specs: ["Ginecologia e Obstetrícia"], companies: ["EMP-005"] },
  { ext: "PRO-010", name: "Dra. Juliana Sato", council: "CRM", reg: "130.004", uf: "SP", specs: ["Endocrinologia"], companies: ["EMP-005", "EMP-015"], bio: "Endocrinologista, atua com diabetes, tireoide e obesidade." },
  { ext: "PRO-011", name: "Dr. Henrique Barros", council: "CRM", reg: "101.777", uf: "SP", specs: ["Oftalmologia"], companies: ["EMP-006"] },
  { ext: "PRO-012", name: "Dra. Mariana Queiroz", council: "CRM", reg: "126.341", uf: "SP", specs: ["Otorrinolaringologia"], companies: ["EMP-007"] },
  { ext: "PRO-013", name: "Dr. Paulo Sérgio Lima", council: "CRM", reg: "88.902", uf: "SP", specs: ["Neurologia"], companies: ["EMP-008"], bio: "Neurologista com foco em cefaleias e distúrbios do sono." },
  { ext: "PRO-014", name: "Dra. Sônia Ribeiro", council: "CRM", reg: "76.115", uf: "SP", specs: ["Geriatria", "Clínica Geral"], companies: ["EMP-008"] },
  { ext: "PRO-015", name: "Dr. Gustavo Amaral", council: "CRO", reg: "78.410", uf: "SP", specs: ["Ortodontia"], companies: ["EMP-009", "EMP-010"] },
  { ext: "PRO-016", name: "Dra. Renata Kuhn", council: "CRO", reg: "81.203", uf: "SP", specs: ["Implantodontia", "Periodontia"], companies: ["EMP-009"], bio: "Implantodontista com especialização em cirurgia guiada." },
  { ext: "PRO-017", name: "Dra. Carla Menezes", council: "CRO", reg: "90.554", uf: "SP", specs: ["Odontopediatria"], companies: ["EMP-010"] },
  { ext: "PRO-018", name: "Dr. Felipe Torres", council: "CRO", reg: "85.877", uf: "SP", specs: ["Implantodontia"], companies: ["EMP-011"] },
  { ext: "PRO-019", name: "Dra. Aline Castro", council: "CRM", reg: "118.640", uf: "SP", specs: ["Radiologia"], companies: ["EMP-013"] },
  { ext: "PRO-020", name: "Dr. Roberto Nunes", council: "CRM", reg: "93.208", uf: "SP", specs: ["Radiologia"], companies: ["EMP-013"] },
  { ext: "PRO-021", name: "Bruno Pacheco", council: "CREFITO", reg: "3/145.220-F", uf: "SP", specs: ["Fisioterapia"], companies: ["EMP-014"], bio: "Fisioterapeuta esportivo e instrutor de pilates clínico." },
  { ext: "PRO-022", name: "Larissa Moura", council: "CREFITO", reg: "3/162.018-F", uf: "SP", specs: ["Fisioterapia"], companies: ["EMP-014", "EMP-004"] },
  { ext: "PRO-023", name: "Tatiane Oliveira", council: "CRN", reg: "3/32.771", uf: "SP", specs: ["Nutrição"], companies: ["EMP-015"] },
  { ext: "PRO-024", name: "Vanessa Cardoso", council: "CRFa", reg: "2/14.560", uf: "SP", specs: ["Fonoaudiologia"], companies: ["EMP-016", "EMP-007"] },
  { ext: "PRO-025", name: "Daniel Fontes", council: "CRP", reg: "06/112.980", uf: "SP", specs: ["Psicologia"], companies: ["EMP-017"], bio: "Psicólogo clínico, abordagem cognitivo-comportamental." },
  { ext: "PRO-026", name: "Isabela Rocha", council: "CRP", reg: "06/98.114", uf: "SP", specs: ["Psicologia"], companies: ["EMP-017"] },
  { ext: "PRO-027", name: "Dra. Helena Prado", council: "CRM", reg: "104.332", uf: "SP", specs: ["Psiquiatria"], companies: ["EMP-018", "EMP-017"], bio: "Psiquiatra, doutora em ciências pela UNIFESP." },
  { ext: "PRO-028", name: "Dr. Eduardo Villela", council: "CRM", reg: "138.901", uf: "SP", specs: ["Psiquiatria"], companies: ["EMP-017"] },
  { ext: "PRO-029", name: "Dra. Priscila Antunes", council: "CRM", reg: "121.007", uf: "RJ", specs: ["Dermatologia Estética"], companies: ["EMP-019"] },
  { ext: "PRO-030", name: "Dr. Otávio Brandão", council: "CRM", reg: "99.410", uf: "SP", specs: ["Clínica Geral"], companies: ["EMP-029"], active: false },
];

async function main() {
  // Clean everything (demo database only)
  await prisma.$transaction([
    prisma.activityLog.deleteMany(),
    prisma.importBatch.deleteMany(),
    prisma.adInquiry.deleteMany(),
    prisma.ad.deleteMany(),
    prisma.banner.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.article.deleteMany(),
    prisma.roomLead.deleteMany(),
    prisma.room.deleteMany(),
    prisma.professionalCompany.deleteMany(),
    prisma.professional.deleteMany(),
    prisma.company.deleteMany(),
    prisma.specialty.deleteMany(),
    prisma.category.deleteMany(),
    prisma.adminUser.deleteMany(),
  ]);

  const catMap = new Map<string, string>();
  for (const c of categories) {
    const row = await prisma.category.create({ data: { name: c.name, slug: c.slug, kind: c.kind, icon: c.icon, order: c.order } });
    catMap.set(c.slug, row.id);
  }

  const specMap = new Map<string, string>();
  for (const s of specialties) {
    const row = await prisma.specialty.create({ data: { name: s, slug: slugify(s) } });
    specMap.set(s, row.id);
  }

  const companyMap = new Map<string, string>();
  for (const c of companies) {
    const row = await prisma.company.create({
      data: {
        externalId: c.ext,
        name: c.name,
        slug: slugify(c.name),
        description: c.description,
        photos: [pic(`${c.ext}-a`, 1200, 800), pic(`${c.ext}-b`, 1200, 800), pic(`${c.ext}-c`, 1200, 800)],
        categoryId: catMap.get(c.cat)!,
        specialties: { connect: c.specs.map((s) => ({ id: specMap.get(s)! })) },
        room: c.room,
        floor: c.floor,
        hours: c.hours,
        phone: c.phone,
        whatsapp: c.whatsapp,
        instagram: c.instagram,
        website: c.website,
        featured: c.featured ?? false,
        active: c.active ?? true,
      },
    });
    companyMap.set(c.ext, row.id);
  }

  for (const p of professionals) {
    await prisma.professional.create({
      data: {
        externalId: p.ext,
        name: p.name,
        slug: slugify(p.name),
        council: p.council,
        registration: p.reg,
        uf: p.uf,
        bio: p.bio,
        active: p.active ?? true,
        specialties: { connect: p.specs.map((s) => ({ id: specMap.get(s)! })) },
        companies: {
          create: p.companies.map((ext, i) => ({
            companyId: companyMap.get(ext)!,
            contactWhatsapp: i === 0 ? companies.find((c) => c.ext === ext)!.whatsapp : undefined,
            contactPhone: companies.find((c) => c.ext === ext)!.phone,
          })),
        },
      },
    });
  }

  await prisma.room.createMany({
    data: [
      { code: "805", title: "Conjunto 805 · Vista para o parque", floor: 8, areaM2: 62, mode: RoomMode.RENT, available: true, description: "Conjunto com duas salas de atendimento, recepção própria, copa e banheiro privativo. Piso vinílico, ar-condicionado split e infraestrutura de rede pronta.", features: ["2 salas de atendimento", "Recepção própria", "Banheiro privativo", "Copa", "Ar-condicionado", "1 vaga de garagem"], photos: [pic("room-805-a"), pic("room-805-b"), pic("room-805-c")], contactName: "Administração Vitalis Hub", contactPhone: "(11) 3045-0010", contactWhatsapp: "5511987000010" },
      { code: "506", title: "Sala 506 · Consultório pronto", floor: 5, areaM2: 34, mode: RoomMode.BOTH, available: true, description: "Consultório individual com pia, armários planejados e sala de espera compartilhada no andar. Ideal para profissional autônomo.", features: ["Pia e armários", "Espera compartilhada", "Ar-condicionado", "Ponto para maca"], photos: [pic("room-506-a"), pic("room-506-b")], contactName: "Administração Vitalis Hub", contactPhone: "(11) 3045-0010", contactWhatsapp: "5511987000010" },
      { code: "904", title: "Conjunto 904 · Andar corporativo", floor: 9, areaM2: 88, mode: RoomMode.SALE, available: false, description: "Conjunto amplo em planta livre, ideal para escritório ou clínica multiprofissional.", features: ["Planta livre", "2 banheiros", "2 vagas de garagem"], photos: [pic("room-904-a")], contactName: "Administração Vitalis Hub", contactPhone: "(11) 3045-0010", contactWhatsapp: "5511987000010" },
      { code: "404", title: "Sala 404 · Terapias", floor: 4, areaM2: 28, mode: RoomMode.RENT, available: false, description: "Sala tratada acusticamente, próxima às clínicas de reabilitação.", features: ["Tratamento acústico", "Ar-condicionado"], photos: [pic("room-404-a")], contactName: "Administração Vitalis Hub", contactPhone: "(11) 3045-0010", contactWhatsapp: "5511987000010" },
    ],
  });

  const daysAgo = (d: number, h = 10) => { const x = new Date(); x.setDate(x.getDate() - d); x.setHours(h, 0, 0, 0); return x; };

  await prisma.roomLead.createMany({
    data: [
      { name: "Dra. Lívia Monteiro", email: "livia.monteiro@example.com", whatsapp: "(11) 99812-3344", mode: RoomMode.RENT, desiredArea: "30 a 40 m²", activityArea: "Dermatologia", notes: "Prefiro andares altos, atendimento 3x por semana.", consent: true, status: LeadStatus.NEW, createdAt: daysAgo(1) },
      { name: "Clínica Bem-Estar Integrado", email: "contato@bemestarintegrado.example", whatsapp: "(11) 98111-2020", mode: RoomMode.RENT, desiredArea: "80 a 120 m²", activityArea: "Multiprofissional", notes: "Precisamos de 4 salas e recepção.", consent: true, status: LeadStatus.NEW, createdAt: daysAgo(2, 15) },
      { name: "Dr. Caio Fernandes", email: "caio.f@example.com", whatsapp: "(11) 97777-0909", mode: RoomMode.SALE, desiredArea: "Acima de 60 m²", activityArea: "Odontologia", consent: true, status: LeadStatus.CONTACTED, createdAt: daysAgo(6) },
      { name: "Marina Lopes", email: "marina.lopes@example.com", whatsapp: "(11) 96666-1212", mode: RoomMode.RENT, desiredArea: "Até 30 m²", activityArea: "Psicologia", notes: "Meio período.", consent: true, status: LeadStatus.CONTACTED, createdAt: daysAgo(9, 9) },
      { name: "Grupo Diagnósticos Sul", email: "expansao@gds.example", whatsapp: "(11) 95555-4545", mode: RoomMode.BOTH, desiredArea: "Acima de 150 m²", activityArea: "Diagnóstico por imagem", consent: true, status: LeadStatus.CLOSED, createdAt: daysAgo(21) },
      { name: "Dra. Renata Silveira", email: "renata.s@example.com", whatsapp: "(11) 94444-8787", mode: RoomMode.RENT, desiredArea: "30 a 40 m²", activityArea: "Nutrição", consent: true, status: LeadStatus.NEW, createdAt: daysAgo(0, 8) },
      { name: "Pedro Assis", email: "pedro.assis@example.com", whatsapp: "(11) 93333-6161", mode: RoomMode.SALE, desiredArea: "40 a 60 m²", activityArea: "Investimento", consent: false, status: LeadStatus.CLOSED, createdAt: daysAgo(34) },
      { name: "Dra. Yasmin Haddad", email: "yasmin.h@example.com", whatsapp: "(11) 92222-7070", mode: RoomMode.RENT, desiredArea: "Até 30 m²", activityArea: "Fonoaudiologia", consent: true, status: LeadStatus.CONTACTED, createdAt: daysAgo(13, 17) },
    ],
  });

  const article = (title: string, category: string, author: string, days: number, cover: string, status: ArticleStatus = ArticleStatus.PUBLISHED) => ({
    title,
    slug: slugify(title),
    excerpt: `${title}. Entenda o que muda na prática e como se preparar antes da consulta.`,
    coverUrl: pic(cover, 1400, 900),
    author,
    category,
    status,
    publishedAt: status === ArticleStatus.PUBLISHED ? daysAgo(days) : null,
    body: [
      `## Por que isso importa`,
      `Cuidar da saúde de forma preventiva reduz visitas de urgência e melhora a qualidade de vida. Neste artigo reunimos orientações práticas dos profissionais que atendem no Vitalis Hub sobre ${title.toLowerCase()}.`,
      `## O que observar`,
      `Sinais leves costumam ser ignorados. Registre quando começaram, com que frequência aparecem e o que parece piorar ou aliviar. Levar essas anotações para a consulta ajuda o profissional a chegar mais rápido a um diagnóstico.`,
      `## Como se preparar para a consulta`,
      `Separe exames anteriores, a lista de medicamentos em uso e as dúvidas que quer esclarecer. Chegue com dez minutos de antecedência: o estacionamento do prédio tem validação de ticket nas clínicas.`,
      `## Quando procurar ajuda`,
      `Se houver piora rápida, dor intensa ou sintomas novos, procure atendimento sem esperar a próxima consulta agendada. Os telefones e o WhatsApp de cada clínica estão no diretório do site.`,
    ].join("\n\n"),
  });

  await prisma.article.createMany({
    data: [
      article("Check-up cardiológico: quais exames fazer a cada idade", "Cardiologia", "Dr. Rafael Nogueira", 3, "art-1"),
      article("Proteção solar no dia a dia da cidade", "Dermatologia", "Dra. Luana Ferraz", 9, "art-2"),
      article("Aparelho invisível: para quem os alinhadores funcionam", "Odontologia", "Dr. Gustavo Amaral", 16, "art-3"),
      article("Dor nas costas no home office: 5 ajustes que resolvem", "Fisioterapia", "Bruno Pacheco", 24, "art-4"),
      article("Ansiedade: quando o acompanhamento psicológico ajuda", "Saúde mental", "Daniel Fontes", 31, "art-5"),
      article("Vacinas do adulto: o calendário que quase ninguém segue", "Clínica Geral", "Dra. Sônia Ribeiro", 0, "art-6", ArticleStatus.DRAFT),
    ],
  });

  await prisma.faq.createMany({
    data: [
      { order: 1, question: "Como agendo uma consulta?", answer: "O agendamento é feito diretamente com cada clínica ou profissional, por telefone ou WhatsApp. Os contatos estão no cartão de cada empresa no diretório.", active: true },
      { order: 2, question: "O estacionamento é gratuito?", answer: "O estacionamento é pago, com validação de ticket na maioria das clínicas. A primeira meia hora é cortesia.", active: true },
      { order: 3, question: "Quais convênios são aceitos?", answer: "Cada clínica define os convênios que atende. Consulte a clínica antes de agendar.", active: true },
      { order: 4, question: "Há acessibilidade para cadeirantes?", answer: "Sim. O prédio tem rampas, elevadores com sinalização em braile, banheiros adaptados em todos os andares e vagas reservadas no estacionamento.", active: true },
      { order: 5, question: "Como faço para alugar ou comprar uma sala?", answer: "Veja as salas disponíveis na página Salas. Se não houver oferta no momento, cadastre seu interesse e a administração entra em contato quando surgir uma sala com o seu perfil.", active: true },
      { order: 6, question: "O auditório pode ser reservado?", answer: "Sim, para eventos científicos e corporativos. A reserva é feita diretamente com a administração pelo telefone (11) 3045-1001.", active: true },
      { order: 7, question: "Qual o horário de funcionamento do prédio?", answer: "O acesso ao prédio é liberado de segunda a sábado das 6h às 22h. Cada clínica tem seu próprio horário de atendimento.", active: true },
      { order: 8, question: "Vocês fazem exames laboratoriais?", answer: "O Laboratório Diagnose, no 2º andar, faz coleta a partir das 6h30.", active: false },
    ],
  });

  await prisma.banner.createMany({
    data: [
      { order: 1, title: "Tudo de saúde em um só endereço", subtitle: "Mais de 25 clínicas, laboratório, exames de imagem e farmácia no mesmo prédio.", imageUrl: pic("banner-1", 1600, 900), link: "/empresas", active: true },
      { order: 2, title: "Salas para o seu consultório", subtitle: "Conjuntos de 28 a 88 m² com infraestrutura pronta para atender.", imageUrl: pic("banner-2", 1600, 900), link: "/salas", active: true },
      { order: 3, title: "Coleta de exames a partir das 6h30", subtitle: "Laboratório Diagnose, 2º andar, resultados on-line.", imageUrl: pic("banner-3", 1600, 900), link: "/empresas?busca=diagnose", active: true },
    ],
  });

  await prisma.ad.createMany({
    data: [
      { advertiser: "Plano Saúde Ideal", imageDesktop: pic("ad-1-d", 1200, 200), imageMobile: pic("ad-1-m", 640, 320), link: "https://example.com/saude-ideal", group: AdGroup.HOME, position: 1, active: true, clicks: 142 },
      { advertiser: "Farmácia Bem Viver", imageDesktop: pic("ad-2-d", 1200, 200), imageMobile: pic("ad-2-m", 640, 320), link: "https://example.com/bem-viver", group: AdGroup.HOME, position: 1, active: true, clicks: 87 },
      { advertiser: "Ótica Foco", imageDesktop: pic("ad-3-d", 1200, 200), imageMobile: pic("ad-3-m", 640, 320), link: "https://example.com/otica-foco", group: AdGroup.DIRECTORY, position: 1, active: true, clicks: 53 },
      { advertiser: "Seguros Vida Plena", imageDesktop: pic("ad-4-d", 1200, 200), imageMobile: pic("ad-4-m", 640, 320), link: "https://example.com/vida-plena", group: AdGroup.DIRECTORY, position: 1, active: true, clicks: 31 },
      { advertiser: "Academia Corpo Livre", imageDesktop: pic("ad-5-d", 1200, 200), imageMobile: pic("ad-5-m", 640, 320), link: "https://example.com/corpo-livre", group: AdGroup.HOME, position: 2, active: false, endsAt: daysAgo(4), clicks: 210 },
    ],
  });

  await prisma.adInquiry.createMany({
    data: [
      { name: "Marcelo Pires", company: "Labs Nutrição Esportiva", email: "marcelo@labsnutri.example", whatsapp: "(11) 98888-1010", message: "Gostaria de anunciar na home por 3 meses.", createdAt: daysAgo(2) },
      { name: "Ana Paula Reis", company: "Seguros Vida Plena", email: "ana@vidaplena.example", whatsapp: "(11) 97777-2020", message: "Queremos renovar a faixa nos diretórios.", createdAt: daysAgo(8) },
      { name: "Júlio Mendes", company: "Clínica de Olhos Mendes", email: "julio@olhosmendes.example", whatsapp: "(11) 96666-3030", message: "Quais os valores para faixa nos diretórios?", createdAt: daysAgo(15) },
    ],
  });

  const admin = await prisma.adminUser.create({
    data: {
      name: "Administração Vitalis",
      email: process.env.SEED_ADMIN_EMAIL ?? "admin@vitalishub.com.br",
      passwordHash: hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "demo1234"),
    },
  });
  const admin2 = await prisma.adminUser.create({
    data: { name: "Carla Souza", email: "carla@vitalishub.com.br", passwordHash: hashPassword("demo1234") },
  });

  await prisma.activityLog.createMany({
    data: [
      { userId: admin.id, userName: admin.name, action: "IMPORT", entity: "Company", detail: "Importou 26 empresas (planilha empresas-v3.xlsx)", createdAt: daysAgo(40) },
      { userId: admin.id, userName: admin.name, action: "IMPORT", entity: "Professional", detail: "Importou 30 profissionais (planilha profissionais-v3.xlsx)", createdAt: daysAgo(40, 11) },
      { userId: admin2.id, userName: admin2.name, action: "UPDATE", entity: "Room", entityId: "904", detail: "Marcou conjunto 904 como indisponível", createdAt: daysAgo(12) },
      { userId: admin2.id, userName: admin2.name, action: "UPDATE", entity: "RoomLead", detail: "Alterou status de Grupo Diagnósticos Sul para Encerrado", createdAt: daysAgo(11) },
      { userId: admin.id, userName: admin.name, action: "PUBLISH", entity: "Article", detail: "Publicou 'Check-up cardiológico: quais exames fazer a cada idade'", createdAt: daysAgo(3) },
      { userId: admin.id, userName: admin.name, action: "UPDATE", entity: "Ad", detail: "Desativou anúncio Academia Corpo Livre", createdAt: daysAgo(4) },
      { userId: admin.id, userName: admin.name, action: "LOGIN", entity: "Session", detail: "Acesso ao painel", createdAt: daysAgo(0, 8) },
    ],
  });

  await prisma.importBatch.create({
    data: {
      filename: "profissionais-v3.xlsx",
      kind: "professionals",
      total: 32,
      inserted: 30,
      skipped: 2,
      report: { errors: [{ row: 14, message: "Registro de conselho vazio" }], duplicates: [{ row: 22, externalId: "PRO-005" }] },
      userName: admin.name,
      createdAt: daysAgo(40, 11),
    },
  });

  console.log("Seed concluído: %d empresas, %d profissionais", companies.length, professionals.length);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
