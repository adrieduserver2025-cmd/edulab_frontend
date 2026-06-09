import {
  Send,
  ArrowLeft,
  ArrowRight,
  Award,
  Brain,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Globe2,
  Globe,
  HandHeart,
  HeartHandshake,
  House,
  Languages,
  MapPin,
  MessageCircle,
  Network,
  School,
  ScrollText,
  Sparkles,
  Bot,
  Sprout,
  Bookmark,
  Share2,
  UsersRound,
  Wrench,
  Check,
  Play,
  ClipboardCheck,
  Gift,
  Settings,
  CircleCheckBig,
  Video,
  X,
  Building2,
  ExternalLink,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import '../../styles/volunteer/volunteer-detail.css'
import { useState } from 'react'
import {
  FaInstagram,
  FaLinkedin,
  FaFacebook,
  FaTiktok
} from 'react-icons/fa'

const iconMap = {
  globe: Globe2,
  brain: Brain,
  message: MessageCircle,
  network: Network,
  certificate: ScrollText,
  sparkles: Sparkles,
  handHeart: HandHeart,
  heartHandshake: HeartHandshake,
  users: UsersRound,
  award: Award,
  school: School,
  sprout: Sprout,
  wrench: Wrench,
  house: House,
  clipboard: ClipboardList,
}
const socialIconMap = {
  facebook: FaFacebook,
  tiktok: FaTiktok,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  web: Globe,
}
function VolunteerHero({ volunteer }) {
  const details = [
    { icon: <MapPin size={17} />, label: volunteer.pais },
    { icon: <UsersRound size={17} />, label: volunteer.modalidad },
    { icon: <Clock size={17} />, label: volunteer.duracion },
    { icon: <Languages size={17} />, label: volunteer.idioma },
    { icon: <CalendarDays size={17} />, label: volunteer.edad },
  ]
  const [isSaved, setIsSaved] = useState(false)
  const [shareStatus, setShareStatus] = useState('idle')
  const [selectedActivity, setSelectedActivity] = useState(null)
  const [selectedBenefit, setSelectedBenefit] = useState(null)

  function handleSave() {
    setIsSaved((prev) => !prev)
  }
  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setShareStatus('copied')

      window.setTimeout(() => {
        setShareStatus('idle')
      }, 1800)
    } catch {
      setShareStatus('error')

      window.setTimeout(() => {
        setShareStatus('idle')
      }, 1800)
    }
  }
  return (
    <main className='bg-[#fffaf0]'>
      <section className='relative overflow-hidden bg-[#04113a] text-white'>
        <div className='absolute inset-0'>
          <img
            src={volunteer.imagen_portada}
            alt={volunteer.titulo}
            className='h-full w-full object-cover'
          />
          <div className='absolute inset-0 bg-[linear-gradient(90deg,rgba(4,17,58,0.95)_0%,rgba(4,17,58,0.82)_34%,rgba(4,17,58,0.38)_58%,rgba(4,17,58,0.12)_78%,rgba(4,17,58,0.03)_100%)]' />
          <div className='absolute inset-0 bg-[linear-gradient(180deg,rgba(4,17,58,0.12)_0%,rgba(4,17,58,0.42)_62%,rgba(4,17,58,0.72)_100%)]' />
        </div>

        <div className='edulab-container relative z-10 pb-10 pt-5 sm:pb-12 sm:pt-7 lg:pb-16 lg:pt-8'>
          <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
            <a
              href={`/${volunteer.modulo}`}
              className='inline-flex items-center gap-2 text-sm font-bold text-white/90 transition hover:text-[#F8B733]'
            >
              <ArrowLeft size={18} />
              Volver a {volunteer.modulo}
            </a>

            {/* Share button */}
            <div className='flex items-center gap-3'>
              <button
                type='button'
                onClick={handleSave}
                className={`save-action gold-premium inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-black transition hover:-translate-y-0.5 sm:px-5 sm:py-3 sm:text-sm ${isSaved ? 'is-saved' : ''
                  }`}
              >
                <span className='save-icon'>
                  {isSaved ? (
                    <Check size={18} strokeWidth={2.4} />
                  ) : (
                    <Bookmark size={18} strokeWidth={2.2} />
                  )}
                </span>

                <span>{isSaved ? 'Guardado' : 'Guardar para después'}</span>
              </button>

              <button
                type='button'
                onClick={handleShare}
                className={`share-action relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition hover:-translate-y-0.5 hover:border-[#F8B733] hover:bg-white/15 hover:text-[#F8B733] sm:h-12 sm:w-12 ${shareStatus !== 'idle' ? 'is-shared' : ''
                  }`}
                aria-label='Copiar enlace de la oportunidad'
                title={shareStatus === 'copied' ? 'Copiado' : 'Copiar enlace'}
              >
                {shareStatus === 'copied' ? (
                  <Check size={20} strokeWidth={2.4} />
                ) : (
                  <Share2 size={20} strokeWidth={2.2} />
                )}

                {shareStatus === 'copied' && (
                  <span className='share-tooltip'>Copiado</span>
                )}
              </button>
            </div>
          </div>

          <div className='mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-end'>
            <div className='max-w-3xl'>
              <span className='gold-premium-static inline-flex w-fit items-center rounded-full px-4 py-2 text-xs font-black uppercase tracking-wide shadow-lg shadow-black/20'>
                {volunteer.estado}
              </span>

              <h1 className='mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl'>
                Voluntariado en{' '}
                <span className='gold-text block font-serif'>
                  {volunteer.organizacion.nombre}
                </span>
              </h1>

              <p className='mt-5 max-w-2xl text-lg font-semibold leading-8 text-white sm:text-xl'>
                {volunteer.frase_principal}
              </p>

              <p className='mt-4 max-w-2xl text-sm leading-7 text-white/82 sm:text-base'>
                {volunteer.resumen_corto}
              </p>

              <div className='mt-8 flex flex-wrap gap-4 text-sm text-white/90'>
                {details.map((item) => (
                  <div key={item.label} className='flex items-center gap-2'>
                    <span className='text-[#F4B83E]'>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>

              <div className='mt-8 flex flex-col gap-3 sm:flex-row'>
                <a
                  href='https://aiesec.org/search?programmes=7'
                  className='gold-premium inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black transition hover:-translate-y-0.5'
                >
                  {volunteer.texto_cta}
                  <ArrowRight size={18} />
                </a>

                {volunteer.requisitos?.length > 0 && (
                  <a
                    href='#requisitos'
                    className='inline-flex items-center justify-center rounded-2xl border border-white/25 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/10'
                  >
                    Ver requisitos
                  </a>
                )}
              </div>
            </div>

            <div className='hidden lg:block'>
              <WelcomeVideoCard video={volunteer.video_bienvenida} />
            </div>
          </div>

        </div>

      </section>

      <VolunteerTabs volunteer={volunteer} />
      <section className='edulab-container grid gap-6 py-8 lg:grid-cols-[1fr_340px] lg:py-8'>
        <div className='space-y-6'>
          <ContentCard id='descripcion'>
            <SectionEyebrow>Descripción</SectionEyebrow>
            <SectionTitle>¿De qué se trata este voluntariado?</SectionTitle>

            <div className='mt-5 space-y-4 text-sm leading-7 text-slate-700 sm:text-base'>
              {volunteer.descripcion_larga.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className='mt-6 rounded-2xl border border-[#F4B83E]/25 bg-[#FFF8EA] p-4 text-sm font-bold text-[#061A33]'>
              {volunteer.mensaje_destacado}
            </div>
          </ContentCard>

          <ContentCard id='beneficios'>
            <SectionTitle>Lo que ganarás con esta experiencia</SectionTitle>

            <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6'>
              {volunteer.beneficios.map((item) => {
                const Icon = iconMap[item.icono] || Sparkles

                return (
                  <button
                    key={item.titulo}
                    type='button'
                    onClick={() => setSelectedBenefit(item)}
                    className='group rounded-2xl border border-[#EBDDC5] bg-white p-5 text-center transition hover:-translate-y-1 hover:border-[#F8B733] hover:bg-[#FFF3D8] hover:shadow-[0_14px_30px_rgba(3,26,51,0.08)]'
                  >
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF9EF] text-[#D89B1D] transition group-hover:scale-105 group-hover:bg-[#F8B733] group-hover:text-[#04113A]'>
                      <Icon size={24} strokeWidth={1.9} />
                    </div>

                    <p className='mt-4 text-sm font-black leading-6 text-[#04113A]'>
                      {item.titulo}
                    </p>

                    <span className='mt-2 inline-block text-xs font-bold text-[#C88412] opacity-0 transition group-hover:opacity-100'>
                      Ver detalle
                    </span>
                  </button>
                )
              })}


            </div>
          </ContentCard>

          <ContentCard id='actividades'>
            <SectionTitle>¿Qué harás?</SectionTitle>

            <div className='mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5'>
              {volunteer.actividades.map((item) => {
                const Icon = iconMap[item.icono] || Sparkles

                return (
                  <button
                    key={item.titulo}
                    type='button'
                    onClick={() => setSelectedActivity(item)}
                    className='group rounded-2xl border border-[#EBDDC5] bg-[#FFF9EF] p-5 text-center transition hover:-translate-y-1 hover:border-[#F8B733] hover:bg-[#FFF3D8] hover:shadow-[0_14px_30px_rgba(3,26,51,0.08)]'
                  >
                    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#D89B1D] transition group-hover:scale-105 group-hover:bg-[#F8B733] group-hover:text-[#04113A]'>
                      <Icon size={24} strokeWidth={1.9} />
                    </div>

                    <p className='mt-4 text-sm font-black leading-6 text-[#04113A]'>
                      {item.titulo}
                    </p>

                    <span className='mt-2 inline-block text-xs font-bold text-[#C88412] opacity-0 transition group-hover:opacity-100'>
                      Ver detalle
                    </span>
                  </button>
                )
              })}
            </div>
          </ContentCard>

          {volunteer.requisitos?.length > 0 && (
            <ContentCard id='requisitos'>
              <SectionEyebrow>Requisitos</SectionEyebrow>
              <SectionTitle>Lo que necesitas para participar</SectionTitle>

              <div className='mt-6 grid gap-3 sm:grid-cols-2'>
                {volunteer.requisitos.map((requirement) => (
                  <div
                    key={requirement}
                    className='flex gap-3 rounded-2xl border border-[#F4B83E]/20 bg-[#FFF8EA] p-4 text-sm font-bold text-[#061A33]'
                  >
                    <CheckCircle2 className='mt-0.5 shrink-0 text-[#D99413]' size={18} />
                    <span>{requirement}</span>
                  </div>
                ))}
              </div>
            </ContentCard>
          )}
          <ContentCard id='testimonios'>
            <div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
              <div>
                <SectionEyebrow>Testimonios</SectionEyebrow>
                <SectionTitle>Historias de voluntarios</SectionTitle>
              </div>
            </div>

            <div className='mt-6 grid gap-4 md:grid-cols-2'>
              {volunteer.testimonios?.map((item) => (
                <a
                  key={item.titulo}
                  href={item.url_video}
                  target='_blank'
                  rel='noreferrer'
                  className='group overflow-hidden rounded-[1.5rem] border border-[#F4B83E]/20 bg-[#fffaf0] shadow-sm transition hover:-translate-y-1 hover:shadow-xl'
                >
                  <div className='relative aspect-video overflow-hidden'>
                    <img
                      src={item.thumbnail}
                      alt={item.titulo}
                      className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
                    />

                    <div className='absolute inset-0 bg-gradient-to-t from-[#04113a]/90 via-[#04113a]/25 to-transparent' />

                    <div className='absolute inset-0 flex items-center justify-center'>
                      <div className='flex h-16 w-16 items-center justify-center rounded-full bg-[#F4B83E] text-xl font-black text-[#061A33] shadow-xl'>
                        ▶
                      </div>
                    </div>

                    <div className='absolute bottom-4 left-4 right-4'>
                      <p className='text-lg font-black text-white'>{item.titulo}</p>
                    </div>
                  </div>

                  <div className='p-5'>
                    <p className='text-sm leading-7 text-slate-700'>{item.contenido}</p>
                    <p className='mt-4 inline-flex items-center gap-2 text-sm font-black text-[#D99413]'>
                      Ver video
                      <span>→</span>
                    </p>
                  </div>
                </a>
              ))}
            </div>
          </ContentCard>
        </div>

        {/* barra lateral */}
        <aside className='space-y-6 lg:sticky lg:top-28 lg:self-start'>

          <OrganizationCard organizacion={volunteer.organizacion} />

          <SidebarCard title='Acompañamiento EDULAB'>
            <p className='mt-4 text-sm leading-7 text-white/85'>
              Te ayudamos a prepararte mejor antes de aplicar, ordenando tu perfil,
              tu motivación y preguntas frecuentes en entrevistas.
            </p>

            <ul className='mt-5 space-y-4'>
              {[
                'Construir tu perfil como voluntario',
                'Organizar tus motivaciones',
                'Prepararte para entrevistas',
              ].map((item) => (
                <li key={item} className='flex gap-3 text-sm leading-6 text-white/90'>
                  <CheckCircle2 className='mt-0.5 shrink-0 text-[#F4B83E]' size={18} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <a
              href='#como-postular'
              className="fx-neon mt-6 inline-flex items-center justify-center rounded-xl bg-[#F8B733] px-5 py-3 text-sm font-bold text-[#061A33]"
            >
              Preparar postulación
              <ArrowRight size={17} />
            </a>
          </SidebarCard>
        </aside>
      </section>

      <section className='edulab-container pb-0'>
        <section className='overflow-hidden rounded-[2rem] bg-[#04113a] p-5 text-white shadow-xl shadow-[#04113a]/15 sm:p-6'>
          <div className='grid gap-5 lg:grid-cols-3 lg:items-stretch'>
            <div className='flex min-h-[190px] flex-col justify-center rounded-[1.5rem] border border-white/10 bg-white/5 p-5'>
              <p className='text-xs font-black uppercase tracking-[0.22em] text-[#F4B83E]'>
                Próximo paso
              </p>

              <h2 className='mt-3 text-2xl font-black leading-tight sm:text-3xl'>
                ¿Listo para generar impacto?
              </h2>

              <p className='mt-3 text-sm leading-6 text-white/80'>
                Da el primer paso para participar en este voluntariado y aportar a una causa con propósito.
              </p>
            </div>

            <div
              href='#'
              className='group flex min-h-[170px] flex-col justify-between rounded-[1.5rem] bg-[#F4B83E] p-5 text-[#061A33] transition hover:-translate-y-1 hover:bg-[#FFD166]'
            >
              <div className='flex items-center gap-5'>
                <div className='shrink-0'>
                  <Send
                    size={58}
                    strokeWidth={1.9}
                    className='rotate-[-12deg] text-[#061A33] transition group-hover:translate-x-1 group-hover:-translate-y-1'
                  />
                </div>

                <div>
                  <h3 className='text-xl font-bold leading-tight'>
                    Comenzar postulación
                  </h3>

                  <p className='mt-2 text-sm font-medium leading-6 text-[#061A33]/75'>
                    Da el primer paso para vivir una experiencia que te transformará.
                  </p>
                </div>
              </div>

              <a
                href='https://aiesec.org/global-volunteer'
                className='mt-6 inline-flex min-h-[64px] w-full items-center justify-center gap-4 rounded-2xl bg-[#04113A] px-8 py-5 text-lg font-black text-white shadow-[0_16px_34px_rgba(4,17,58,0.28)] transition hover:-translate-y-0.5 hover:bg-[#071B5D]'
              >
                Quiero postular ahora
                <ArrowRight size={25} strokeWidth={2.4} />
              </a>
            </div>

            <a
              href='#'
              className='group flex min-h-[170px] flex-col justify-between rounded-[1.5rem] border border-white/15 bg-white/10 p-5 text-white transition hover:-translate-y-1 hover:bg-white/15'
            >
              <div>
                <div className='flex h-14 w-14 items-center justify-center rounded-2xl bg-[#04113a] text-[#F4B83E] ring-1 ring-[#F4B83E]/30 mx-auto'>
                  <Bot
                    size={38}
                    strokeWidth={1.8}
                    className='transition group-hover:scale-110'
                  />
                </div>

                <h3 className='mt-4 text-xl font-bold text-center'>
                  ¿Tienes dudas?
                </h3>

                <p className='mt-2 text-sm leading-6 text-white/75 text-center'>
                  Chatea con nuestro chatbot y recibe orientación antes de postular.
                </p>
              </div>

              <span className="fx-neon inline-flex items-center justify-center rounded-xl bg-[#F8B733] px-5 py-3 text-sm font-bold text-[#061A33]"
              >
                Chatear ahora
                <ArrowRight size={20} />
              </span>
            </a>

          </div>
          <ActivityMediaModal
            activity={selectedActivity}
            onClose={() => setSelectedActivity(null)}
          />

          <BenefitMediaModal
            benefit={selectedBenefit}
            onClose={() => setSelectedBenefit(null)}
          />
        </section>
      </section>
    </main>

  )
}

function GoldenIcon({ name, size = 26 }) {
  const Icon = iconMap[name] || Sparkles

  return (
    <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF8EA] text-[#D99413]'>
      <Icon size={size} strokeWidth={1.9} />
    </div>
  )
}

function VolunteerTabs({ volunteer }) {
  const tabs = [
    {
      label: 'Descripción',
      href: '#descripcion',
      icon: ClipboardCheck,
      show: true,
    },
    {
      label: 'Beneficios',
      href: '#beneficios',
      icon: Gift,
      show: volunteer.beneficios?.length > 0,
    },
    {
      label: 'Actividades',
      href: '#actividades',
      icon: Settings,
      show: volunteer.actividades?.length > 0,
    },
    {
      label: 'Requisitos',
      href: '#requisitos',
      icon: CircleCheckBig,
      show: volunteer.requisitos?.length > 0,
    },
    {
      label: 'Testimonios',
      href: '#testimonios',
      icon: Video,
      show: volunteer.testimonios?.length > 0,
    },
  ]

  return (
    <div className='sticky top-0 z-20 border-b border-[#F4B83E]/15 bg-white/95 backdrop-blur'>
      <div className='edulab-container overflow-x-auto'>
        <nav className='flex min-w-max gap-8 py-3'>
          {tabs
            .filter((tab) => tab.show)
            .map((tab, index) => {
              const Icon = tab.icon
              const isActive = index === 0

              return (
                <a
                  key={tab.href}
                  href={tab.href}
                  className={`group relative flex min-w-[96px] flex-col items-center gap-2 px-4 py-4 text-sm font-semibold transition ${isActive
                    ? 'text-[#D89B1D]'
                    : 'text-[#404B61] hover:text-[#D89B1D]'
                    }`}
                >
                  <Icon
                    size={21}
                    strokeWidth={1.8}
                    className={`transition ${isActive
                      ? 'text-[#D89B1D]'
                      : 'text-[#8C8F97] group-hover:text-[#D89B1D]'
                      }`}
                  />

                  <span className='whitespace-nowrap'>{tab.label}</span>

                  <span
                    className={`absolute bottom-0 left-1/2 h-[3px] -translate-x-1/2 rounded-full transition-all ${isActive
                      ? 'w-20 bg-[#D89B1D]'
                      : 'w-0 bg-transparent group-hover:w-12 group-hover:bg-[#D89B1D]/40'
                      }`}
                  />
                </a>
              )
            })}
        </nav>
      </div>
    </div>
  )
}

/*video de bienvenida */
function WelcomeVideoCard({ video }) {
  if (!video) return null

  return (
    <a
      href={video.url}
      target='_blank'
      rel='noreferrer'
      className='group relative block overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 shadow-2xl shadow-black/25 backdrop-blur-md transition hover:-translate-y-1 hover:border-[#F8B733]/70'
    >
      <div className='relative aspect-video overflow-hidden'>
        <img
          src={video.thumbnail}
          alt={video.titulo}
          className='h-full w-full object-cover transition duration-500 group-hover:scale-105'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-[#04113A]/95 via-[#04113A]/35 to-transparent' />

        <div className='absolute inset-0 flex items-center justify-center'>
          <div className='gold-premium flex h-16 w-16 items-center justify-center rounded-full transition group-hover:scale-110'>
            <Play size={30} fill='currentColor' strokeWidth={2.2} />
          </div>
        </div>

        <div className='absolute left-5 top-5 rounded-full border border-white/20 bg-white/15 px-4 py-2 text-xs font-black uppercase tracking-wide text-white backdrop-blur-md'>
          Video de bienvenida
        </div>
      </div>

      <div className='p-5'>
        <h3 className='text-xl font-black text-white'>
          {video.titulo}
        </h3>

        <p className='mt-2 text-sm leading-6 text-white/75'>
          {video.descripcion}
        </p>

        <span className='mt-4 inline-flex items-center gap-2 text-sm font-black text-[#F8B733]'>
          Ver video
          <ArrowRight size={17} />
        </span>
      </div>
    </a>
  )
}


function ContentCard({ id, children }) {
  return (
    <section
      id={id}
      className='scroll-mt-16 rounded-3xl border border-[#EBDDC5] bg-white p-6 shadow-[0_12px_35px_rgba(3,26,51,0.05)] sm:p-8 lg:scroll-mt-28'
    >
      {children}
    </section>
  )
}

function SidebarCard({ id, title, children }) {
  return (
    <section
      id={id}
      className='rounded-[2rem] bg-[#04113a] p-6 text-white shadow-xl shadow-[#04113a]/10'
    >
      <h3 className='font-serif text-2xl font-black text-[#F4B83E]'>{title}</h3>
      {children}
    </section>
  )
}

function SectionEyebrow({ children }) {
  return (
    <p className='text-xs font-bold uppercase tracking-[0.24em] text-[#C88412]'>
      {children}
    </p>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 className='text-2xl font-bold tracking-tight text-[#061A33] sm:text-3xl'>
      {children}
    </h2>
  )
}

function ActivityMediaModal({ activity, onClose }) {
  if (!activity) return null

  const isVideo = activity.tipo_media === 'video'

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-[#04113A]/80 px-4 py-6 backdrop-blur-sm'>
      <button
        type='button'
        className='absolute inset-0 cursor-default'
        onClick={onClose}
        aria-label='Cerrar modal'
      />

      <article className='relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl shadow-black/30'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#04113A]/75 text-white backdrop-blur-md transition hover:bg-[#04113A]'
          aria-label='Cerrar'
        >
          <X size={22} />
        </button>

        <div className='grid lg:grid-cols-[1.25fr_0.75fr]'>
          <div className='relative min-h-[280px] bg-[#04113A]'>
            {isVideo ? (
              <iframe
                src={activity.media}
                title={activity.titulo}
                className='h-full min-h-[320px] w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={activity.media}
                  alt={activity.titulo}
                  className='h-full min-h-[320px] w-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#04113A]/50 to-transparent' />
              </>
            )}
          </div>

          <div className='p-7 sm:p-8'>
            <p className='text-xs font-black uppercase tracking-[0.22em] text-[#C88412]'>
              Actividad del voluntariado
            </p>

            <h3 className='mt-3 text-3xl font-black leading-tight text-[#04113A]'>
              {activity.titulo}
            </h3>

            <p className='mt-5 text-base leading-8 text-[#53677D]'>
              {activity.descripcion ||
                'Conoce más sobre esta actividad y cómo forma parte de la experiencia del voluntariado.'}
            </p>

            <div className='mt-7 rounded-2xl border border-[#EBDDC5] bg-[#FFF9EF] p-4'>
              <p className='text-sm font-bold leading-6 text-[#04113A]'>
                Esta actividad puede variar según el país, proyecto y
                organización anfitriona.
              </p>
            </div>

            <button
              type='button'
              onClick={onClose}
              className='gold-premium mt-7 inline-flex rounded-2xl px-5 py-3 text-sm font-black transition hover:-translate-y-0.5'
            >
              Entendido
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}


function OrganizationCard({ organizacion }) {
  if (!organizacion) return null

  return (
    <aside className='rounded-[2rem] bg-[#04113a] p-6 text-white shadow-xl shadow-[#04113a]/10'>
      <div className='flex items-start justify-between gap-4'>
        <div>
          <h3 className='font-serif text-2xl font-black text-[#F4B83E]'>
            Organización
          </h3>

          {organizacion.alcance && (
            <div className='mt-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs font-bold text-white/80'>
              <MapPin size={14} className='text-[#F4B83E]' />
              {organizacion.alcance}
            </div>
          )}
        </div>

        <div className='flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-[#F4B83E]'>
          <Building2 size={22} />
        </div>
      </div>

      <div className='mt-6 flex items-center gap-4'>
        <div className='flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white'>
          {organizacion.logo ? (
            <img
              src={organizacion.logo}
              alt={organizacion.nombre}
              className='max-h-full max-w-full object-contain'
            />
          ) : (
            <span className='text-lg font-black text-[#04113a]'>
              {organizacion.logoTexto || organizacion.nombre}
            </span>
          )}
        </div>

        <div className='min-w-0'>
          <p className='truncate text-xl font-black text-white'>
            {organizacion.nombre}
          </p>

          <p className='mt-1 text-sm font-semibold text-white/55'>
            Organización aliada
          </p>
        </div>
      </div>

      <p className='mt-5 text-sm leading-7 text-white/78'>
        {organizacion.descripcion}
      </p>

      {organizacion.redes?.length > 0 && (
        <div className='mt-6 border-t border-white/10 pt-3'>
          <p className='text-xs font-black uppercase tracking-[0.2em] text-[#F4B83E]'>
            Redes oficiales
          </p>

          <div className='mt-4 flex flex-wrap gap-3'>
            {organizacion.redes.map((red) => {
              const Icon = socialIconMap[red.icono] || ExternalLink

              return (
                <a
                  key={red.nombre}
                  href={red.url}
                  target='_blank'
                  rel='noreferrer'
                  aria-label={red.nombre}
                  title={red.nombre}
                  className='group flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-white transition hover:-translate-y-0.5 hover:border-[#F4B83E]/60 hover:bg-[#F4B83E] hover:text-[#04113a]'
                >
                  <Icon size={18} strokeWidth={2.1} />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </aside>
  )
}

function BenefitMediaModal({ benefit, onClose }) {
  if (!benefit) return null

  const isVideo = benefit.tipo_media === 'video'

  return (
    <div className='fixed inset-0 z-[100] flex items-center justify-center bg-[#04113A]/80 px-4 py-6 backdrop-blur-sm'>
      <button
        type='button'
        className='absolute inset-0 cursor-default'
        onClick={onClose}
        aria-label='Cerrar modal'
      />

      <article className='relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/15 bg-white shadow-2xl shadow-black/30'>
        <button
          type='button'
          onClick={onClose}
          className='absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-[#04113A]/75 text-white backdrop-blur-md transition hover:bg-[#04113A]'
          aria-label='Cerrar'
        >
          <X size={22} />
        </button>

        <div className='grid lg:grid-cols-[1.25fr_0.75fr]'>
          <div className='relative min-h-[280px] bg-[#04113A]'>
            {isVideo ? (
              <iframe
                src={benefit.media}
                title={benefit.titulo}
                className='h-full min-h-[320px] w-full'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
            ) : (
              <>
                <img
                  src={benefit.media}
                  alt={benefit.titulo}
                  className='h-full min-h-[320px] w-full object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-[#04113A]/50 to-transparent' />
              </>
            )}
          </div>

          <div className='p-7 sm:p-8'>
            <p className='text-xs font-black uppercase tracking-[0.22em] text-[#C88412]'>
              Beneficio de la experiencia
            </p>

            <h3 className='mt-3 text-3xl font-black leading-tight text-[#04113A]'>
              {benefit.titulo}
            </h3>

            <p className='mt-5 text-base leading-8 text-[#53677D]'>
              {benefit.descripcion ||
                'Este beneficio forma parte del valor que aporta la experiencia al perfil personal, académico o profesional del participante.'}
            </p>

            <div className='mt-7 rounded-2xl border border-[#EBDDC5] bg-[#FFF9EF] p-4'>
              <p className='text-sm font-bold leading-6 text-[#04113A]'>
                Los beneficios pueden variar según la organización, país,
                programa y condiciones específicas de cada convocatoria.
              </p>
            </div>

            <button
              type='button'
              onClick={onClose}
              className='gold-premium mt-7 inline-flex rounded-2xl px-5 py-3 text-sm font-black transition hover:-translate-y-0.5'
            >
              Entendido
            </button>
          </div>
        </div>
      </article>
    </div>
  )
}

export default VolunteerHero