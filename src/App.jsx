import React, { useEffect, useMemo, useRef, useState } from 'react'
import useTypewriter from "./hooks/useTypewriter"; 

export default function App() {
  useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light'
    if (saved === 'dark') document.body.classList.add('dark')
    requestAnimationFrame(() => document.body.classList.add('loaded'))
  }, [])

  const [current, setCurrent] = useState('about')
  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('section[id]')
      let cur = ''
      sections.forEach((s) => {
        const top = s.offsetTop
        if (scrollY >= top - 200) cur = s.getAttribute('id')
      })
      setCurrent(cur || 'about')
    }
    window.addEventListener('scroll', onScroll)
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const opts = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible'))
    }, opts)

    document.querySelectorAll('.fade-in').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const heroRef = useRef(null)
  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.pageYOffset
      if (heroRef.current) heroRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // ===== Lightbox state =====
  const [lbOpen, setLbOpen] = useState(false)
  const [lbSrc, setLbSrc] = useState('')
  const openLB = (src) => { setLbSrc(src); setLbOpen(true); document.body.style.overflow = 'hidden' }
  const closeLB = () => { setLbOpen(false); setLbSrc(''); document.body.style.overflow = '' }

  return (
    <>
      <Header current={current} />
      <main style={{ marginTop: 80 }}>
        <section className="hero section" id="about" ref={heroRef}>
          <Hero openLB={openLB} />
        </section>

        <section className="section fade-in" id="experience">
          <Experience />
        </section>

        <section className="section fade-in" id="projects">
          <h2 className="section-title">Featured Projects</h2>
          <Projects openLB={openLB} />
        </section>

        <section className="section fade-in" id="skills">
          <h2 className="section-title">Skills &amp; Expertise</h2>
          <Skills />
        </section>

        <section className="section fade-in" id="organizations">
          <h2 className="section-title">Organizations &amp; Activities</h2>
          <Organizations />
        </section>
      </main>

      <Footer />

      {lbOpen && (
        <div className="lightbox open" onClick={(e) => e.target.classList.contains('lightbox') && closeLB()}>
          <button className="close" aria-label="Tutup" onClick={closeLB}>&times;</button>
          <img src={lbSrc} alt="preview" />
        </div>
      )}
    </>
  )
}

function Header({ current }) {
  const [open, setOpen] = useState(false)

  const toggleTheme = () => {
    const isDark = document.body.classList.toggle('dark')
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }

  const onNavClick = (e, id) => {
    e.preventDefault()
    const target = document.querySelector(id)
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    setOpen(false)
  }

  useEffect(() => {
    const onClick = (e) => {
      const nav = document.getElementById('navMenu')
      const ham = document.getElementById('hamburger')
      if (!nav || !ham) return
      if (!nav.contains(e.target) && !ham.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <header>
      <div className="nav-container">
        <div className="logo">Portofolio</div>
        <nav>
          <ul className={`nav-menu ${open ? 'active' : ''}`} id="navMenu">
            {[
              ['#about', 'About'],
              ['#experience', 'Experience'],
              ['#projects', 'Projects'],
              ['#skills', 'Skills'],
              ['#organizations', 'Organizations'],
              ['#contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <a
                  href={href}
                  className={`nav-link ${href === `#${current}` ? 'active' : ''}`}
                  onClick={(e) => onNavClick(e, href)}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="nav-controls">
          <button className="theme-toggle" id="themeToggle" onClick={toggleTheme}>
            <i className="fas fa-moon"></i>
          </button>
          <div
            className={`hamburger ${open ? 'active' : ''}`}
            id="hamburger"
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </header>
  )
}

function Hero({ openLB }) {
  const typedName = useTypewriter("Damar\u00A0Wahyu\u00A0P", { speed: 85, startDelay: 300 });

  return (
    <div className="hero-content fade-in">
      <div className="hero-text slide-enter">
        <h1 className="hero-title">
          <span>Hi, I'm&nbsp;</span>
          <span className="no-wrap">
            <span className="gradient-text">{typedName}</span>
            <span className="type-cursor">|</span>
          </span>
        </h1>

        <p className="subtitle">Frontend Developer &amp; Backend Developer</p>
        <p>
          Sebagai lulusan dari CEP-CCIT FTUI yang tertarik pada front-end dan back-end, saya senang mengubah ide menjadi produk nyata.
          Saya berfokus pada performa dan aksesibilitas, dipadukan dengan desain yang rapi agar setiap interaksi terasa
          intuitif. Saya memiliki pengalaman dengan HTML, CSS, dan JavaScript, serta dasar yang kuat pada jQuery,
          Node.js/Express, dan MySQL. Pernah terlibat dalam proyek UI/UX dasar dan berkesempatan menjadi MC di acara
          tingkat nasional—pengalaman yang meningkatkan kepercayaan diri dan komunikasi publik. Terbuka untuk kesempatan
          magang, kolaborasi, atau diskusi seputar teknologi web.
        </p>

        <div className="cta-buttons">
          <a href="#projects" className="btn btn-primary">
            <i className="fas fa-rocket"></i>
            View My Work
          </a>
          <a href="/Resume-Damar-Wahyu-Putra.pdf" download className="btn btn-secondary">
            <i className="fas fa-download"></i>
            Download CV
          </a>
        </div>
      </div>

      <div className="hero-image floating">
        <img
          src="/img/WhatsApp Image 2025-06-10 at 14.45.46_c012ae3e.jpg"
          alt="Damar Wahyu Putra"
          onClick={(e) => openLB(e.target.src)}
        />
      </div>
    </div>
  );
}


const Experience = () => {
  const [selectedExperience, setSelectedExperience] = useState(null);

  const experiences = [
    {
      title: 'Staff Event Stock-Summit UI',
      date: '2024',
      image: '/img/IMG_3833.jpg',
      description: 'Berperan sebagai staff divisi event dan MC pada acara Seminar Stock-Summit UI. Mengelola koordinasi acara dan memfasilitasi jalannya seminar dengan audience yang besar, memastikan semua sesi berjalan lancar dan profesional.',
      responsibilities: [
        'Mengelola koordinasi teknis dan logistik acara seminar',
        'Menjadi MC untuk membawakan acara di hadapan ratusan peserta',
        'Memfasilitasi sesi Q&A dan interaksi dengan pembicara',
        'Berkoordinasi dengan tim untuk memastikan timeline acara berjalan sesuai rencana',
        'Membantu registrasi dan handling peserta seminar'
      ]
    },
    {
      title: 'BPJS Ketenagakerjaan Internship',
      date: 'Agustus 2025 - November 2025',
      image: '/img/bpjs.jpg',
      description: 'Magang sebagai Full-Stack Developer di BPJS Ketenagakerjaan, bertanggung jawab dalam pengembangan aplikasi internal perusahaan. Terlibat dalam seluruh siklus pengembangan dari desain UI/UX hingga implementasi backend dan database.',
      responsibilities: [
        'Mempelajari dan menguasai Vue.js, PHP, dan VMS sebagai teknologi inti untuk proyek',
        'Menggunakan Figma untuk mendesain antarmuka pengguna (UI) situs web internal, termasuk tata letak dan komponen yang akan digunakan oleh tim di kemudian hari',
        'Bekerja sama dengan tim di Figma untuk mendesain fitur situs web internal, mengikuti pedoman perusahaan dan standar desain',
        'Mengambil peran sebagai Insinyur Back End, fokus pada logika sisi server dan integrasi dengan frontend',
        'Membuat desain UI mockup Figma untuk aplikasi internal dengan persyaratan khusus dari perusahaan',
        'Merancang dan membangun bagian struktur database serta melakukan tugas-tugas engineering backend sesuai peran yang ditugaskan',
        'Membuat REST APIs menggunakan Node.js (Express.js) dan PHP, termasuk struktur endpoint, validasi input, dan penanganan kesalahan',
        'Menerapkan integrasi frontend: menghubungkan APIs dengan formulir, tombol, fungsi pencarian, dan validasi berdasarkan desain Figma',
        'Mengembangkan komponen backend dan beberapa komponen frontend menggunakan Node.js (Express.js) dan PHP',
        'Bekerja dalam sesi kolaborasi dan tinjauan rutin dengan tim untuk menyempurnakan, memprioritaskan, dan menyelesaikan fitur internal yang penting',
        'Menerapkan alur create, read, dan update antara Database ⇄ API ⇄ Frontend untuk aplikasi internal'
      ]
    }
  ];

  const showDetail = (index) => {
    setSelectedExperience(index);
    setTimeout(() => {
      scrollToCard();
    }, 0);
  };

  const backToList = () => {
    setSelectedExperience(null);
    setTimeout(() => {
      scrollToCard();
    }, 0);
  };

  const scrollToCard = () => {
    const cardWrapper = document.querySelector('.experience-card-wrapper');
    if (cardWrapper) {
      cardWrapper.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleEscape = (event) => {
    if (event.key === 'Escape' && selectedExperience !== null) {
      backToList();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    );

    const items = document.querySelectorAll('.experience-list-item');
    items.forEach(item => {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'all 0.6s ease';
      observer.observe(item);
    });

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleEscape);
      items.forEach(item => observer.unobserve(item));
    };
  }, [selectedExperience]);

  return (
    <section id="experience" className="section">
      <h2 className="section-title">Professional Experience</h2>
      
      <div className="experience-container">
        <div className="experience-card-wrapper">
          
          {/* LIST VIEW (Default) */}
          <div 
            className={`experience-list-view ${selectedExperience !== null ? 'hidden' : ''}`}
          >
            <div className="experience-list-header">
              <h3>My Journey</h3>
            </div>
            
            <div className="experience-list">
              {experiences.map((exp, index) => (
                <div 
                  key={index}
                  className="experience-list-item"
                  onClick={() => showDetail(index)}
                >
                  <div className="experience-list-item-image">
                    <img src={exp.image} alt={exp.title} />
                  </div>
                  <div className="experience-list-item-content">
                    <h4>{exp.title}</h4>
                    <span className="experience-list-item-date">{exp.date}</span>
                  </div>
                  <div className="experience-list-item-arrow">→</div>
                </div>
              ))}
            </div>
          </div>

          {/* DETAIL VIEW */}
          {experiences.map((exp, index) => (
            <div 
              key={`detail-${index}`}
              className={`experience-detail-view ${selectedExperience === index ? 'active' : ''}`}
            >
              <button className="experience-back-button" onClick={backToList}>
                ← Kembali ke Daftar
              </button>
              
              <div className="experience-detail-content">
                <div className="experience-detail-image">
                  <img src={exp.image} alt={exp.title} />
                </div>
                
                <div className="experience-detail-info">
                  <h3>{exp.title}</h3>
                  <span className="experience-detail-date">{exp.date}</span>
                  
                  <p>{exp.description}</p>
                  
                  <h4>Tanggung Jawab & Pencapaian:</h4>
                  <ul>
                    {exp.responsibilities.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
};

function Projects({ openLB }) {
  const slides = useMemo(() => [
    {
      hero: '/img/Screenshot 2025-06-11 110328.png',
      title: 'Website Responsive Workshop',
      desc: 'Mengembangkan website interaktif dan responsive untuk booking dan pembelian perlengkapan motor. Dibangun dengan HTML, CSS, dan JavaScript dengan fokus pada user experience yang optimal.',
      thumbs: [
        '/img/Screenshot 2025-06-11 110826.png',
        '/img/Screenshot 2025-06-11 110850.png',
        '/img/Screenshot 2025-06-11 110859.png',
        '/img/Screenshot 2025-06-11 110909.png',
      ],
    },
    {
      hero: '/img/project2_img/Screenshot 2025-06-17 193256.png',
      title: 'Website BM FKKP Forum Komunitas',
      desc: 'Terdapat isi seperti landing page, yang di mana memiliki about me, struktur, kegiatan, contact, footer.',
      thumbs: [
        '/img/project2_img/Screenshot 2025-06-17 193312.png',
        '/img/project2_img/Screenshot 2025-06-17 193321.png',
        '/img/project2_img/Screenshot 2025-06-17 193332.png',
        '/img/project2_img/Screenshot 2025-06-17 193341.png',
        '/img/project2_img/Screenshot 2025-06-17 193348.png',
      ],
    },
    {
      hero: '/img/project_wbks_img/Screenshot 2025-10-22 093802.png',
      title: 'PT. Wins House',
      desc: 'Company profile untuk PT. Wins House—menampilkan layanan, portofolio proyek, spesifikasi, pengalaman, metode instalasi, serta kontak dalam satu alur yang rapi.',
      thumbs: [
        '/img/project_wbks_img/Screenshot 2025-10-22 093802.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093814.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093820.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093830.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093839.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093857.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093905.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093912.png',
        '/img/project_wbks_img/Screenshot 2025-10-22 093920.png',
      ],
    },
    {
      hero: '/img/project3_img/slide 1.png',
      title: 'UI/UX Workshop Mobile App',
      desc: 'Merancang aplikasi mobile untuk peminjaman dan pencarian buku menggunakan Figma. Membuat wireframe, prototype interaktif, dan user flow yang komprehensif.',
      thumbs: [
        '/img/project3_img/homescreen.png',
        '/img/project3_img/profile.png',
        '/img/project3_img/notif,dll.png',
        '/img/project3_img/profile.png',
        '/img/project3_img/bank.png',
        '/img/project3_img/top-up.png',
        '/img/project3_img/detail-page.png',
        '/img/project3_img/cart.png',
        '/img/project3_img/checkout.png',
        '/img/project3_img/history.png',
      ],
    },
    {
      hero: '/img/project4_img/Screenshot 2025-07-05 231124.png',
      title: 'Jus Kabita',
      desc: 'Terdapat isi seperti landing page, yang di mana memiliki Title, menu Jus, contact alamat dan jam operasional. Serta responsive mobile, tab, laptop, pc.',
      thumbs: [
        '/img/project4_img/Screenshot 2025-07-05 231124.png',
        '/img/project4_img/Screenshot 2025-07-05 231133.png',
        '/img/project4_img/Screenshot 2025-07-05 231146.png',
        '/img/project4_img/Screenshot 2025-07-05 231154.png',
      ],
    },
  ], [])

  const [index, setIndex] = useState(0)
  const total = slides.length

  const next = () => setIndex((i) => Math.min(i + 1, total - 1))
  const prev = () => setIndex((i) => Math.max(i - 1, 0))
  const goTo = (i) => setIndex(i)

  // Touch swipe
  const gridRef = useRef(null)
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    let startX = 0
    const onStart = (e) => (startX = e.changedTouches[0].screenX)
    const onEnd = (e) => {
      const endX = e.changedTouches[0].screenX
      if (endX < startX - 50) next()
      if (endX > startX + 50) prev()
    }
    grid.addEventListener('touchstart', onStart)
    grid.addEventListener('touchend', onEnd)
    return () => {
      grid.removeEventListener('touchstart', onStart)
      grid.removeEventListener('touchend', onEnd)
    }
  }, [gridRef.current])

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <div className="projects-grid" id="projectsGrid" ref={gridRef} style={{ transform: `translateX(${-index * 100}%)` }}>
          {slides.map((s, i) => (
            <div className="card-inline" key={i}>
              <div className="project-card">
                <div className="project-image">
                  <img src={s.hero} alt={s.title} onClick={(e) => openLB(e.target.src)} />
                </div>
                <div className="project-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="project-gallery">
                    {s.thumbs.map((t, j) => (
                      <img key={j} src={t} alt={`Screenshot ${j + 1}`} onClick={(e) => openLB(e.target.src)} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="carousel-controls">
        <div className="carousel-nav">
          <button className="nav-btn" id="prevBtn" onClick={prev} disabled={index === 0}>←</button>
          <button className="nav-btn" id="nextBtn" onClick={next} disabled={index === total - 1}>→</button>
        </div>
        <div className="pagination" id="pagination">
          {Array.from({ length: total }).map((_, i) => (
            <div key={i} className={`pagination-dot ${i === index ? 'active' : ''}`} onClick={() => goTo(i)}></div>
          ))}
        </div>
      </div>
    </div>
  )
}

function Skills() {
  const items = [
    { icon: 'fab fa-figma', title: 'UI/UX Design', text: 'Figma, Prototyping' },
    { icon: 'fas fa-code', title: 'Front-End Development', text: 'HTML, CSS, JavaScript, Responsive Design' },
    { icon: 'fas fa-code', title: 'Backend Development', text: 'Node.js/Express.js' },
    { icon: 'fas fa-lightbulb', title: 'Problem Solving', text: 'Creative Solutions, Critical Thinking' },
    { icon: 'fas fa-users', title: 'Teamwork', text: 'Collaboration, Communication, Leadership' },
  ]
  return (
    <div className="card">
      <div className="skills-grid">
        {items.map((it, i) => (
          <div className="skill-item" key={i} style={{ ['--i']: i + 1 }}>
            <div className="skill-icon"><i className={it.icon}></i></div>
            <div>
              <h4>{it.title}</h4>
              <p>{it.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function Organizations() {
  return (
    <div className="org-grid">
      <div className="card org-item">
        <img src="/img/oragnization/indorelawan/WhatsApp Image 2025-07-04 at 14.34.22_76452a2d.jpg" alt="Indorelawan Activity" />
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '.5rem' }}>Ketua Grup Indorelawan</h3>
          <p style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Generasi Bebas Plastik</p>
          <p>
            Memimpin kampanye edukasi lingkungan dan mengorganisasi aksi bersih-bersih di berbagai lokasi. Menginisiasi program awareness tentang pengurangan penggunaan plastik di komunitas.
          </p>
        </div>
      </div>

      <div className="card org-item">
        <img src="/img/oragnization/novoclub/WhatsApp Image 2025-07-04 at 14.34.23_1a9c2079.jpg" alt="Novo Club Activity" />
        <div>
          <h3 style={{ color: 'var(--primary)', marginBottom: '.5rem' }}>Member Novo Club</h3>
          <p style={{ color: 'var(--secondary)', marginBottom: '1rem' }}>Technology Community</p>
          <p>
            Aktif berpartisipasi dalam diskusi teknologi dan pengembangan diri. Membantu mengorganisasi event komunitas digital dan workshop pengembangan skill.
          </p>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer id="contact">
      <h2 style={{ marginBottom: '1rem' }}>Let's Connect!</h2>
      <p>Ready to create something amazing together?</p>
      <div className="contact-links">
        <a href="mailto:damarwahyup160@gmail.com" className="contact-link">
          <i className="fas fa-envelope"></i>
          damarwahyup160@gmail.com
        </a>
        <a href="https://linkedin.com/in/damarwahyuputra" className="contact-link" target="_blank" rel="noreferrer">
          <i className="fab fa-linkedin"></i>
          LinkedIn
        </a>
        <a href="https://instagram.com/d.ptra._" className="contact-link" target="_blank" rel="noreferrer">
          <i className="fab fa-instagram"></i>
          @d.ptra._
        </a>
      </div>
      <p style={{ marginTop: '2rem', color: 'var(--text-muted-light)' }}>© 2025 Damar Wahyu Putra. Made with ❤️ and lots of ☕</p>
    </footer>
  )
}