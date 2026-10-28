export const PROFILE = {
  name: 'Gustavo Agudo',
  github: 'https://github.com/gustavoagudo',
  linkedin: 'https://www.linkedin.com/in/gustavo-agudo-gomes-5125b2281/',
  smartprice: 'https://smartprice.twostack.com.br',
  location: 'Brasil',
}

export const NAV = [
  { id: 'sobre', label: 'Sobre' },
  { id: 'stack', label: 'Stack' },
  { id: 'experiencia', label: 'Experiência' },
  { id: 'projetos', label: 'Projetos' },
  { id: 'contato', label: 'Contato' },
]

export const FACTS = [
  ['Cargo atual', 'Full stack developer'],
  ['Foco', 'Backend · APIs · integrações'],
  ['Setor', 'Financeiro · crédito'],
  ['Formação', 'Ciência da Computação — último semestre'],
] as const

export const ABOUT = {
  title: 'O backend é onde a responsabilidade mora.',
  paragraphs: [
    'Comecei como full stack e continuo entregando as duas pontas, mas o que me prende é o servidor: modelar o domínio, desenhar o contrato da API, decidir o que acontece quando a integração de um banco devolve um formato que ninguém documentou.',
    'Na prática isso significa tratar erro como caminho previsto, não exceção; deixar o fluxo operacional avançando sozinho, com estado explícito e rastro de cada transição; e escrever código que o próximo desenvolvedor — inclusive eu, seis meses depois — consiga ler sem susto.',
    'Estou no último semestre de Ciência da Computação e uso a formação para o que ela serve melhor: entender o custo das decisões antes de tomá-las.',
  ],
}

export const STACKS = [
  { name: 'TypeScript', note: 'Tipagem estrita no front e no back', color: '#3178C6' },
  { name: 'Node.js', note: 'Runtime principal dos serviços', color: '#5FA04E' },
  { name: 'Express', note: 'Camada HTTP e middlewares', color: '#B7BDC2' },
  { name: 'APIs REST', note: 'Contratos versionados e previsíveis', color: '#9AA3AA' },
  { name: 'PostgreSQL', note: 'Banco relacional de referência', color: '#4F7BF0' },
  { name: 'Prisma', note: 'Schema, migrations e acesso a dados', color: '#7C8CA6' },
  { name: 'Redis', note: 'Cache e controle de fila', color: '#FF4438' },
  { name: 'MongoDB', note: 'Documentos e payloads de integração', color: '#47A248' },
  { name: 'Docker', note: 'Ambientes iguais em dev e produção', color: '#2496ED' },
  { name: 'AWS', note: 'Infraestrutura e serviços gerenciados', color: '#FF9900' },
  { name: 'React', note: 'Interfaces com TypeScript', color: '#3FB6DA' },
  { name: 'Playwright', note: 'Testes e coleta de páginas dinâmicas', color: '#2EAD33' },
]

export const EXPERIENCE = {
  title: 'CRM de propostas de crédito',
  role: 'Full stack developer · empresa do setor financeiro · há mais de um ano',
  summary:
    'Plataforma de gestão de propostas de empréstimo, da entrada do cliente até a resposta do banco. Sou responsável pela automação dos fluxos operacionais e por toda a camada de integração bancária.',
  metrics: [
    { value: 8, suffix: '+', label: 'bancos integrados por API' },
    { value: 200, suffix: '+', label: 'usuários contratando simultaneamente' },
    { value: 2, suffix: ' mil+', label: 'contratos por dia' },
  ],
  items: [
    {
      title: 'Integração com mais de 8 bancos',
      text: 'Cada instituição com seu próprio contrato, autenticação e vocabulário. Construí a camada que fala com todas elas e devolve uma forma só para o resto do sistema.',
    },
    {
      title: 'Análise e proposta sem backoffice',
      text: 'A análise de dados e a geração de propostas passaram a ser automáticas, dispensando a equipe de backoffice que antes fazia esse trabalho à mão.',
    },
    {
      title: 'Horas economizadas por proposta',
      text: 'Cada proposta que antes esperava conferência humana agora avança sozinha — funcionários e parceiros de negócio contratam em paralelo, sem fila.',
    },
    {
      title: 'Dados heterogêneos normalizados',
      text: 'Respostas em formatos, unidades e estruturas diferentes são tratadas e validadas na borda, para que a regra de negócio nunca precise adivinhar.',
    },
  ],
}

export const PROJECT = {
  title: 'SmartPrice',
  tagline: 'Comparação de preços entre mercados locais',
  summary:
    'Coleta preços de mercados da região, identifica quando dois anúncios são o mesmo produto e devolve a comparação por uma API. O trabalho difícil não é a tela: é o dado.',
  host: 'smartprice.twostack.com.br',
  features: [
    {
      title: 'Web scraping e coleta',
      text: 'Rotinas de coleta resistentes a mudança de layout, com Playwright onde a página só existe depois do JavaScript.',
    },
    {
      title: 'Matching de produtos',
      text: 'Nomes escritos de formas diferentes, embalagens em unidades diferentes, códigos ausentes — o casamento entre anúncios é o núcleo do problema.',
    },
    {
      title: 'Tratamento e exposição',
      text: 'Dados limpos, versionados e servidos por uma API REST — a mesma disciplina de borda do CRM, em outro domínio.',
    },
  ],
}

export const CONTACT_TITLE = 'Onde me encontrar.'
