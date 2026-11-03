import { motion } from 'framer-motion'
import { ArrowRight, Download, Tag } from 'lucide-react'

const CREAM = 'bg-[#f2efe6]'
const DEEP_GREEN = 'text-[#006c49]'

interface StickerCard {
  src: string
  title: string
  note: string
  span: string
  imageHeight: string
  rotate: number
}

const IMPACT_STICKERS: StickerCard[] = [
  {
    src: '/stickers/cream/04_community_impact/children_sharing_meal.png',
    title: 'Children sharing a meal',
    note: "School and children's-home lunch programme",
    span: 'lg:col-span-5',
    imageHeight: 'h-56 md:h-72',
    rotate: -1.5,
  },
  {
    src: '/stickers/cream/04_community_impact/volunteer_giving_food.png',
    title: 'Volunteers on the last mile',
    note: 'Doorstep handover, boxed with care',
    span: 'lg:col-span-4',
    imageHeight: 'h-48 md:h-60',
    rotate: 1.2,
  },
  {
    src: '/stickers/cream/04_community_impact/no_food_waste.png',
    title: 'No food waste',
    note: 'The pledge printed on every rescue crate',
    span: 'lg:col-span-3',
    imageHeight: 'h-44 md:h-52',
    rotate: -2,
  },
  {
    src: '/stickers/cream/02_recipient_and_community/food_sharing.png',
    title: 'Food sharing, hand to hand',
    note: 'No plate turned away',
    span: 'lg:col-span-3',
    imageHeight: 'h-44 md:h-52',
    rotate: 1.8,
  },
  {
    src: '/stickers/cream/04_community_impact/senior_citizens_sharing_meal.png',
    title: 'Seniors sharing a meal',
    note: 'Old-age home meal circles',
    span: 'lg:col-span-4',
    imageHeight: 'h-48 md:h-60',
    rotate: -1.2,
  },
  {
    src: '/stickers/cream/04_community_impact/fight_hunger_together.png',
    title: 'Fight hunger together',
    note: 'NGOs, shelters and community kitchens',
    span: 'lg:col-span-5',
    imageHeight: 'h-44 md:h-60',
    rotate: 1.5,
  },
]

const PROCESS_STEPS = [
  {
    src: '/stickers/cream/03_foodbridge_process_and_environment/donate_process.png',
    step: '01',
    title: 'Donate',
    note: 'Surplus is listed in seconds.',
  },
  {
    src: '/stickers/cream/03_foodbridge_process_and_environment/collect_process.png',
    step: '02',
    title: 'Collect',
    note: 'Volunteers pick up the batch.',
  },
  {
    src: '/stickers/cream/03_foodbridge_process_and_environment/cook.png',
    step: '03',
    title: 'Cook',
    note: 'Community kitchens prep it fresh.',
  },
  {
    src: '/stickers/cream/03_foodbridge_process_and_environment/distribute.png',
    step: '04',
    title: 'Distribute',
    note: 'Meals reach the table warm.',
  },
]

const NETWORK = [
  { src: '/stickers/cream/05_dashboard_category_icons/donor_icon.png', label: 'Donor' },
  { src: '/stickers/cream/05_dashboard_category_icons/ngo_icon.png', label: 'NGO' },
  { src: '/stickers/cream/05_dashboard_category_icons/childrens_home_icon.png', label: "Children's Home" },
  { src: '/stickers/cream/05_dashboard_category_icons/old_age_home_icon.png', label: 'Old-Age Home' },
  { src: '/stickers/cream/05_dashboard_category_icons/orphanage_icon.png', label: 'Orphanage' },
  { src: '/stickers/cream/05_dashboard_category_icons/shelter_home_icon.png', label: 'Shelter' },
  { src: '/stickers/cream/05_dashboard_category_icons/volunteer_icon.png', label: 'Volunteer' },
  { src: '/stickers/cream/05_dashboard_category_icons/admin_icon.png', label: 'Admin' },
  { src: '/stickers/cream/05_dashboard_category_icons/fresh_food_icon.png', label: 'Fresh Food' },
  { src: '/stickers/cream/05_dashboard_category_icons/groceries_icon.png', label: 'Groceries' },
  { src: '/stickers/cream/05_dashboard_category_icons/meals_icon.png', label: 'Meals' },
]

function StickerTile({ sticker, index }: { sticker: StickerCard; index: number }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28, rotate: sticker.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: sticker.rotate }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -6, rotate: 0, scale: 1.015 }}
      className={`group relative overflow-hidden rounded-[10px] border-2 border-[#121e16]/15 ${CREAM} p-4 shadow-[6px_6px_0_0_rgba(18,30,22,0.08)] transition-shadow duration-200 hover:shadow-[10px_10px_0_0_rgba(0,108,73,0.22)] ${sticker.span}`}
    >
      <img
        src={sticker.src}
        alt={`${sticker.title} — FoodBridge community sticker`}
        className={`w-full object-contain ${sticker.imageHeight}`}
        loading="lazy"
      />
      <div className="flex items-end justify-between gap-3 border-t-2 border-[#121e16]/10 pt-3">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.06em] text-[#121e16]">
            {sticker.title}
          </h3>
          <p className="mt-0.5 text-[11px] leading-snug text-[#121e16]/60">{sticker.note}</p>
        </div>
        <ArrowRight className="h-4 w-4 shrink-0 -rotate-45 text-[#121e16]/35 transition-all duration-200 group-hover:rotate-0 group-hover:text-[#006c49]" />
      </div>
    </motion.article>
  )
}

export default function CommunityStickerWall() {
  return (
    <section
      id="stickers"
      className={`relative z-20 overflow-hidden border-y-2 border-bone/15 ${CREAM} px-6 py-24 text-[#121e16] md:px-10`}
    >
      <div className="pointer-events-none absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(#121e16 1px, transparent 1px), linear-gradient(90deg, #121e16 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="pointer-events-none absolute -right-24 top-10 h-40 w-40 rounded-[20px] border border-[#6cf8bb]/20 bg-[#6cf8bb]/10" />
      <div className="pointer-events-none absolute -left-24 bottom-24 h-40 w-40 rounded-[20px] border border-[#6cf8bb]/15 bg-[#e0ff00]/08" />

      <div className="relative mx-auto max-w-[1440px]">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
          <span className="mb-5 inline-flex items-center gap-1.5 rounded-full border-2 border-[#121e16] bg-[#6cf8bb] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#003820] shadow-[3px_3px_0_0_#121e16]" style={{ transform: 'rotate(-2deg)' }}>
              <Tag className="h-3.5 w-3.5" /> The sticker wall
            </span>
            <h2 className="display-type text-[clamp(2.6rem,6vw,5rem)] text-[#121e16]">
              Every sticker is
              <br />
              <span className={DEEP_GREEN}>a plate that arrived.</span>
            </h2>
            <p className="mt-5 max-w-xl font-body text-sm leading-relaxed text-[#121e16]/70 md:text-base">
              A rescued meal is never abstract. It is a child&apos;s lunch, a senior&apos;s dinner,
              a volunteer&apos;s route across town. This is the FoodBridge community &mdash; printed,
              cut and pinned to every rescued crate.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5"
          >
            <div className="rotate-[1.5deg] rounded-[10px] border-2 border-[#121e16]/15 bg-[#f2efe6] p-5 shadow-[8px_8px_0_0_rgba(18,30,22,0.1)]">
              <img
                src="/stickers/cream/01_brand_and_donation/foodbridge_logo.png"
                alt="FoodBridge logo sticker with the words Connect, Donate, Feed"
                className="mx-auto h-28 w-auto object-contain md:h-32"
                loading="lazy"
              />
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t-2 border-[#121e16]/10 pt-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#121e16]">
                    Connect &middot; Donate &middot; Feed
                  </p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#121e16]/50">
                    35 stickers &middot; 5 categories
                  </p>
                </div>
                <a
                  href="/stickers/00_full_sticker_sheet.png"
                  download
                  className="inline-flex items-center gap-2 rounded-[10px] border-2 border-[#121e16] bg-[#121e16] px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.14em] text-neon transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[4px_4px_0_0_rgba(0,108,73,0.4)]"
                >
                  <Download className="h-3.5 w-3.5" /> Full sheet
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {IMPACT_STICKERS.map((sticker, i) => (
            <StickerTile key={sticker.title} sticker={sticker} index={i} />
          ))}
        </div>

        <div className="mt-16 rounded-[10px] border-2 border-[#121e16]/15 bg-[#faf7ef] p-5 md:p-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#006c49]">
                The rescue loop
              </p>
              <h3 className="display-type mt-1 text-3xl text-[#121e16] md:text-4xl">
                Donate. Collect. Cook. Deliver.
              </h3>
            </div>
            <p className="max-w-xs text-[11px] leading-relaxed text-[#121e16]/55">
              Four printed steps that run on repeat, every single day, across every FoodBridge
              node.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROCESS_STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08 }}
                whileHover={{ y: -4 }}
                className="group relative rounded-[10px] border-2 border-[#121e16]/10 bg-[#f2efe6] p-4 transition-colors duration-200 hover:border-[#006c49]/50"
              >
                <span className="absolute right-3 top-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[#121e16]/35">
                  / {step.step}
                </span>
                <img
                  src={step.src}
                  alt={`${step.title} step sticker`}
                  className="mx-auto h-28 w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <h4 className="mt-2 text-sm font-black uppercase tracking-[0.08em] text-[#121e16]">
                  {step.title}
                </h4>
                <p className="mt-1 text-[11px] leading-snug text-[#121e16]/60">{step.note}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="mt-12 overflow-hidden border-y-2 border-[#121e16]/10 py-4">
          <div className="marquee-track items-center">
            {[0, 1].map((copy) => (
              <div key={copy} className="flex shrink-0 items-center">
                {NETWORK.map((node) => (
                  <span
                    key={`${copy}-${node.label}`}
                    className="flex items-center gap-2.5 px-4"
                  >
                    <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#121e16]/10 bg-[#f2efe6] p-1.5">
                      <img
                        src={node.src}
                        alt=""
                        aria-hidden="true"
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    </span>
                    <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-[0.18em] text-[#121e16]/70">
                      {node.label}
                    </span>
                    <span className="ml-4 h-1 w-1 rounded-full bg-[#006c49]/50" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#121e16]/40">
          Sticker pack by FoodBridge &middot; illustrations are decorative, not verification
          badges
        </p>
      </div>
    </section>
  )
}
