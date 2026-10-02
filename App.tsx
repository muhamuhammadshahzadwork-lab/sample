import { AnimatePresence, motion, useMotionTemplate, useMotionValue, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";

type Project = {
  id: string;
  title: string;
  category: string;
  year: string;
  image: string;
};

type Service = {
  id: string;
  name: string;
  note: string;
  image: string;
};

const projects: Project[] = [
  {
    id: "01",
    title: "Atelier Noire",
    category: "Brand Strategy / Digital Experience",
    year: "2025",
    image: "/images/project-atelier.jpg",
  },
  {
    id: "02",
    title: "Maison Aurea Hotel",
    category: "Creative Direction / Web Design",
    year: "2024",
    image: "/images/project-hotel.jpg",
  },
  {
    id: "03",
    title: "Vela Private Fleet",
    category: "Luxury Brand Experience",
    year: "2026",
    image: "/images/project-yacht.jpg",
  },
];

const services: Service[] = [
  { id: "01", name: "Strategy", note: "Market positioning and narrative architecture.", image: "/images/project-hotel.jpg" },
  { id: "02", name: "Creative Direction", note: "Visual language with campaign-level precision.", image: "/images/project-atelier.jpg" },
  { id: "03", name: "Brand Identity", note: "Identity systems built for premium recall.", image: "/images/about-portrait.jpg" },
  { id: "04", name: "Web Design", note: "Editorial interfaces with conversion clarity.", image: "/images/hero-studio.jpg" },
  { id: "05", name: "Development", note: "Fast, resilient builds for modern platforms.", image: "/images/project-yacht.jpg" },
  { id: "06", name: "Digital Experiences", note: "Immersive interactions that feel unmistakably custom.", image: "/images/project-hotel.jpg" },
];

const testimonials = [
  {
    quote: "Working with Aureline changed how investors and clients perceive our company in one launch.",
    author: "Elena Voss",
    role: "Founder, Novara Estates",
  },
  {
    quote: "Their team turned a fragmented brand into an experience that feels rare, precise, and instantly trusted.",
    author: "Mikhael Stern",
    role: "CEO, Stern Private Aviation",
  },
  {
    quote: "Every interaction feels intentional. The site now performs like our best sales representative.",
    author: "Ariane Duval",
    role: "CMO, Atelier Noire",
  },
  {
    quote: "Exceptional craft with executive-level discipline. It is the most valuable digital asset we own.",
    author: "Julian Marlowe",
    role: "Managing Partner, Marlowe Capital",
  },
];

function MagneticButton({
  label,
  variant = "solid",
}: {
  label: string;
  variant?: "solid" | "ghost";
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const handleMove = (event: ReactMouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    x.set(offsetX * 0.18);
    y.set(offsetY * 0.18);
  };

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ x, y }}
      className={`group relative overflow-hidden border px-8 py-3 text-xs tracking-[0.24em] uppercase transition-colors duration-300 ${
        variant === "solid"
          ? "border-zinc-900 bg-zinc-900 text-zinc-100 hover:bg-zinc-100 hover:text-zinc-900"
          : "border-zinc-700 text-zinc-200 hover:border-zinc-200 hover:text-zinc-50"
      }`}
    >
      {label}
    </motion.button>
  );
}

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const rowRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: rowRef, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <motion.article
      ref={rowRef}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, delay: index * 0.08 }}
      className="group border-b border-zinc-800/60 py-12 lg:py-16"
    >
      <div className="mb-6 flex items-end justify-between gap-8">
        <div>
          <p className="mb-2 text-xs tracking-[0.28em] text-zinc-400">{project.id}</p>
          <h3 className="text-3xl leading-none tracking-tight text-zinc-100 md:text-5xl">{project.title}</h3>
        </div>
        <div className="hidden text-right text-xs tracking-[0.2em] text-zinc-400 uppercase md:block">
          <p>{project.category}</p>
          <p>{project.year}</p>
        </div>
      </div>
      <div className="relative h-[44vh] min-h-[300px] overflow-hidden">
        <motion.img
          src={project.image}
          alt={`${project.title} project preview`}
          style={{ y }}
          className="h-[120%] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <div className="pointer-events-none absolute inset-0 border border-zinc-100/15" />
      </div>
      <div className="mt-4 text-xs tracking-[0.2em] text-zinc-400 uppercase md:hidden">{project.category} / {project.year}</div>
    </motion.article>
  );
}

function App() {
  const signatureRef = useRef<HTMLDivElement | null>(null);
  const serviceAreaRef = useRef<HTMLDivElement | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [activeService, setActiveService] = useState(0);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [cursorVisible, setCursorVisible] = useState(false);

  const { scrollYProgress } = useScroll({ target: signatureRef, offset: ["start end", "end start"] });
  const layerOne = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const layerTwo = useTransform(scrollYProgress, [0, 1], ["12%", "-12%"]);
  const lineScale = useTransform(scrollYProgress, [0, 1], [0.3, 1]);

  const cursorLeft = useMotionTemplate`${mouseX}px`;
  const cursorTop = useMotionTemplate`${mouseY}px`;

  useEffect(() => {
    const moveCursor = (event: MouseEvent) => {
      mouseX.set(event.clientX);
      mouseY.set(event.clientY);
    };

    const showCursor = () => setCursorVisible(true);
    const hideCursor = () => setCursorVisible(false);

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseenter", showCursor);
    window.addEventListener("mouseleave", hideCursor);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseenter", showCursor);
      window.removeEventListener("mouseleave", hideCursor);
    };
  }, [mouseX, mouseY]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  const activeServiceImage = useMemo(() => services[activeService]?.image, [activeService]);

  return (
    <div className="bg-[#0b0b0a] text-zinc-100 selection:bg-zinc-100 selection:text-zinc-900">
      <AnimatePresence>
        <motion.div
          initial={{ scaleY: 1 }}
          animate={{ scaleY: 0 }}
          exit={{ scaleY: 0 }}
          transition={{ duration: 1.1, ease: [0.85, 0, 0.15, 1] }}
          className="fixed inset-0 z-[60] origin-top bg-[#e8e5df]"
        />
      </AnimatePresence>

      <motion.div
        animate={{ opacity: cursorVisible ? 1 : 0, scale: cursorVisible ? 1 : 0.8 }}
        transition={{ duration: 0.2 }}
        className="custom-cursor"
        style={{ left: cursorLeft, top: cursorTop }}
      />

      <header className="fixed inset-x-0 top-0 z-50 border-b border-zinc-200/10 bg-zinc-950/65 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 md:px-10">
          <p className="font-serif text-2xl tracking-tight text-zinc-100">Aureline</p>
          <nav className="hidden gap-10 text-[11px] tracking-[0.22em] uppercase text-zinc-300 md:flex">
            <a href="#work" className="transition-colors hover:text-white">Work</a>
            <a href="#services" className="transition-colors hover:text-white">Services</a>
            <a href="#process" className="transition-colors hover:text-white">Process</a>
            <a href="#contact" className="transition-colors hover:text-white">Contact</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="relative flex min-h-screen items-end overflow-hidden px-6 pb-16 pt-28 md:px-10 md:pb-20">
          <motion.img
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            src="/images/hero-studio.jpg"
            alt="Aureline creative studio"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/45" />
          <motion.div
            initial="hidden"
            animate="show"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.1, delayChildren: 0.4 } },
            }}
            className="relative z-10 mx-auto w-full max-w-[1400px]"
          >
            <motion.p
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
              className="mb-6 text-xs tracking-[0.28em] text-zinc-200 uppercase"
            >
              Independent Creative Agency
            </motion.p>
            <motion.h1
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
              className="max-w-5xl text-5xl leading-[0.95] tracking-[-0.02em] text-zinc-100 md:text-7xl lg:text-8xl"
            >
              DIGITAL PRESENCE CRAFTED FOR LASTING PRESTIGE.
            </motion.h1>
            <motion.p
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
              className="mt-7 max-w-xl text-base leading-relaxed text-zinc-200/90"
            >
              We shape brand worlds for ambitious companies where trust, rarity, and performance are non-negotiable.
            </motion.p>
            <motion.div
              variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.8 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <MagneticButton label="Start a Project" />
              <MagneticButton label="Explore Our Work" variant="ghost" />
            </motion.div>
          </motion.div>
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-y-10 border-b border-zinc-800 px-6 py-16 md:grid-cols-4 md:px-10">
          {[
            ["120+", "Projects"],
            ["18", "Countries"],
            ["9+", "Years"],
            ["34", "Industry Awards"],
          ].map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.7 }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
            >
              <p className="text-4xl tracking-tight text-zinc-100 md:text-5xl">{value}</p>
              <p className="mt-2 text-xs tracking-[0.22em] text-zinc-400 uppercase">{label}</p>
            </motion.div>
          ))}
        </section>

        <section id="work" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10">
          <p className="mb-5 text-xs tracking-[0.24em] text-zinc-400 uppercase">Featured Work</p>
          <h2 className="max-w-4xl text-4xl leading-tight tracking-tight text-zinc-100 md:text-6xl">
            Signature projects built to outperform in perception and conversion.
          </h2>
          <div className="mt-14">
            {projects.map((project, index) => (
              <ProjectRow key={project.id} project={project} index={index} />
            ))}
          </div>
        </section>

        <section className="mx-auto grid max-w-[1400px] gap-10 border-t border-zinc-800 px-6 py-24 md:grid-cols-[1.15fr_0.85fr] md:px-10">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs tracking-[0.24em] text-zinc-400 uppercase"
            >
              About Aureline
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7 }}
              className="mt-4 max-w-4xl text-5xl leading-[0.95] tracking-tight md:text-7xl"
            >
              WE DON'T BUILD ORDINARY DIGITAL EXPERIENCES.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300"
            >
              Our studio combines strategic depth with art-directed execution. Every decision, from spacing to motion curve,
              is designed to increase credibility and commercial impact.
            </motion.p>
            <div className="mt-10 grid gap-8 text-sm text-zinc-300 md:grid-cols-2">
              <div>
                <p className="text-xs tracking-[0.22em] text-zinc-500 uppercase">Headquarters</p>
                <p className="mt-2">New York / London</p>
              </div>
              <div>
                <p className="text-xs tracking-[0.22em] text-zinc-500 uppercase">Model</p>
                <p className="mt-2">By invitation and referral</p>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8 }}
            className="relative h-[500px] overflow-hidden"
          >
            <img src="/images/about-portrait.jpg" alt="Craft process at Aureline" className="h-full w-full object-cover" loading="lazy" />
            <div className="absolute inset-0 border border-zinc-100/20" />
          </motion.div>
        </section>

        <section id="services" className="mx-auto max-w-[1400px] border-t border-zinc-800 px-6 py-24 md:px-10">
          <p className="mb-8 text-xs tracking-[0.24em] text-zinc-400 uppercase">Services</p>
          <div
            ref={serviceAreaRef}
            onMouseMove={(event) => {
              const rect = serviceAreaRef.current?.getBoundingClientRect();
              if (!rect) return;
              mouseX.set(event.clientX);
              mouseY.set(event.clientY);
            }}
            className="relative"
          >
            <div className="space-y-2">
              {services.map((service, index) => (
                <motion.button
                  key={service.id}
                  onMouseEnter={() => setActiveService(index)}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ duration: 0.6, delay: index * 0.06 }}
                  className={`flex w-full items-center justify-between border-b border-zinc-800 py-6 text-left transition-all duration-300 ${
                    activeService === index ? "text-zinc-100" : "text-zinc-500"
                  }`}
                >
                  <div className="flex items-baseline gap-4 md:gap-8">
                    <span className="text-xs tracking-[0.22em]">{service.id}</span>
                    <span className="text-2xl tracking-tight md:text-4xl">{service.name}</span>
                  </div>
                  <p className="hidden max-w-md text-sm leading-relaxed md:block">{service.note}</p>
                </motion.button>
              ))}
            </div>

            <motion.div
              key={activeServiceImage}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute right-0 top-8 hidden h-64 w-80 overflow-hidden border border-zinc-100/20 lg:block"
            >
              <img src={activeServiceImage} alt="Service preview" className="h-full w-full object-cover" loading="lazy" />
            </motion.div>
          </div>
        </section>

        <section ref={signatureRef} className="relative h-[180vh] border-t border-zinc-800">
          <div className="sticky top-0 flex h-screen items-center overflow-hidden px-6 md:px-10">
            <motion.div style={{ scaleX: lineScale }} className="absolute left-0 right-0 top-1/2 h-px bg-zinc-700" />
            <motion.img
              style={{ y: layerOne }}
              src="/images/project-yacht.jpg"
              alt="Signature experience visual"
              className="absolute right-[8%] top-[14%] h-[34vh] w-[30vw] min-w-[260px] object-cover"
              loading="lazy"
            />
            <motion.img
              style={{ y: layerTwo }}
              src="/images/project-atelier.jpg"
              alt="Creative direction detail"
              className="absolute bottom-[10%] left-[6%] h-[30vh] w-[27vw] min-w-[220px] object-cover"
              loading="lazy"
            />
            <div className="relative z-10 max-w-5xl">
              <p className="text-xs tracking-[0.24em] text-zinc-400 uppercase">Signature Experience</p>
              <h2 className="mt-6 text-5xl leading-[0.88] tracking-tight md:text-8xl">
                MOTION WITH DISCIPLINE.
                <br />
                IMPACT WITHOUT NOISE.
              </h2>
              <p className="mt-8 max-w-xl text-lg text-zinc-300">
                Layered movement, restrained typography, and cinematic pacing combine into a digital story that lingers.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1400px] border-t border-zinc-800 px-6 py-24 md:px-10">
          <p className="mb-8 text-xs tracking-[0.24em] text-zinc-400 uppercase">Testimonials</p>
          <div className="min-h-[250px] max-w-4xl">
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={activeTestimonial}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.5 }}
              >
                <p className="text-3xl leading-tight tracking-tight text-zinc-100 md:text-5xl">"{testimonials[activeTestimonial].quote}"</p>
                <footer className="mt-8 text-sm text-zinc-300">
                  <p className="tracking-wide text-zinc-100">{testimonials[activeTestimonial].author}</p>
                  <p className="mt-1 text-zinc-400">{testimonials[activeTestimonial].role}</p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>
          <div className="mt-8 flex gap-3">
            {testimonials.map((item, index) => (
              <button
                key={item.author}
                onClick={() => setActiveTestimonial(index)}
                className={`h-1.5 w-10 transition-colors ${activeTestimonial === index ? "bg-zinc-100" : "bg-zinc-700"}`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </section>

        <section id="process" className="mx-auto max-w-[1400px] border-t border-zinc-800 px-6 py-24 md:px-10">
          <p className="mb-8 text-xs tracking-[0.24em] text-zinc-400 uppercase">Process</p>
          <div className="space-y-4">
            {["DISCOVER", "DEFINE", "DESIGN", "BUILD", "LAUNCH"].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 26 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: index * 0.08 }}
                className="flex items-center justify-between border-b border-zinc-800 py-6"
              >
                <p className="text-xs tracking-[0.24em] text-zinc-500">0{index + 1}</p>
                <p className="text-2xl tracking-tight md:text-4xl">{step}</p>
                <p className="text-xs tracking-[0.22em] text-zinc-500 uppercase">Phase {index + 1}</p>
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="relative mt-6 min-h-[88vh] overflow-hidden border-t border-zinc-800 px-6 py-24 md:px-10">
          <img src="/images/project-hotel.jpg" alt="Aureline contact backdrop" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-black/60" />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            className="relative z-10 mx-auto flex h-full max-w-[1400px] items-end"
          >
            <div>
              <h2 className="max-w-5xl text-5xl leading-[0.92] tracking-tight text-zinc-100 md:text-8xl">
                LET'S BUILD SOMETHING
                <br />
                WORTH REMEMBERING.
              </h2>
              <p className="mt-8 max-w-2xl text-lg text-zinc-200">
                Have a project that deserves more than an ordinary website?
              </p>
              <div className="mt-10">
                <MagneticButton label="Start a Conversation ->" />
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <footer className="border-t border-zinc-800 px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-wrap items-start justify-between gap-10">
            <div>
              <p className="font-serif text-3xl">Aureline</p>
              <p className="mt-4 max-w-lg text-sm text-zinc-400">Digital craftsmanship for brands that compete on perception.</p>
            </div>
            <div className="grid gap-10 text-sm text-zinc-300 sm:grid-cols-3">
              <div>
                <p className="mb-3 text-xs tracking-[0.22em] text-zinc-500 uppercase">Navigation</p>
                <ul className="space-y-2">
                  <li><a href="#work" className="hover:text-white">Work</a></li>
                  <li><a href="#services" className="hover:text-white">Services</a></li>
                  <li><a href="#process" className="hover:text-white">Process</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs tracking-[0.22em] text-zinc-500 uppercase">Connect</p>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white">Instagram</a></li>
                  <li><a href="#" className="hover:text-white">LinkedIn</a></li>
                  <li><a href="#" className="hover:text-white">Behance</a></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs tracking-[0.22em] text-zinc-500 uppercase">Contact</p>
                <ul className="space-y-2">
                  <li>newbusiness@aureline.studio</li>
                  <li>New York, USA</li>
                  <li>London, UK</li>
                </ul>
              </div>
            </div>
          </div>
          <p className="mt-16 max-w-4xl text-3xl leading-tight tracking-tight text-zinc-200 md:text-5xl">
            Built to be remembered. Designed to be trusted.
          </p>
          <p className="mt-8 text-xs tracking-[0.2em] text-zinc-500 uppercase">© 2026 Aureline Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
