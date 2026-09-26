/* ==========================================================================
   KAKUL SARMA - PORTFOLIO INTERACTIVITY SCRIPT
   Features: Particle Constellation, Interactive Dev Console, GitHub Stats,
             Interactive Procedural Playground, Filtering & Theme Switcher
   Updated: Resume details, IBM Watsonx AI, Credly verification & Experience
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initParticleBackground();
  initTypewriter();
  initTerminal();
  initProjectFiltering();
  initGitHubMetrics();
  initPlaygroundDemo();
  initThemeSwitcher();
  initNavigation();
  initContactForm();
});

/* ==========================================================================
   1. PARTICLE CONSTELLATION CANVAS BACKGROUND
   ========================================================================== */
function initParticleBackground() {
  const canvas = document.getElementById('canvas-bg');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const particles = [];
  const particleCount = Math.min(Math.floor((width * height) / 14000), 85);
  const maxDistance = 140;
  let mouse = { x: -1000, y: -1000, radius: 160 };

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.baseColor = Math.random() > 0.4 ? 'rgba(0, 242, 254, ' : 'rgba(157, 78, 221, ';
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0) this.x = width;
      if (this.x > width) this.x = 0;
      if (this.y < 0) this.y = height;
      if (this.y > height) this.y = 0;

      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        const force = (mouse.radius - dist) / mouse.radius;
        this.x -= (dx / dist) * force * 3;
        this.y -= (dy / dist) * force * 3;
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.baseColor + '0.75)';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 242, 254, ${alpha})`;
          ctx.lineWidth = 0.85;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

/* ==========================================================================
   2. TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const roles = [
    'Senior Full-Stack Engineer',
    'Application Consultant @ IBM',
    'GenAI & watsonx.ai Specialist',
    'Micro-Frontend & Next.js Architect',
    'Open Source Creator (@kakul232)'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  const typeSpeed = 70;
  const deleteSpeed = 35;
  const pauseTime = 1800;

  function type() {
    const current = roles[roleIdx];
    if (isDeleting) {
      el.textContent = current.substring(0, charIdx - 1);
      charIdx--;
    } else {
      el.textContent = current.substring(0, charIdx + 1);
      charIdx++;
    }

    let delay = isDeleting ? deleteSpeed : typeSpeed;

    if (!isDeleting && charIdx === current.length) {
      delay = pauseTime;
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  type();
}

/* ==========================================================================
   3. INTERACTIVE DEVELOPER CONSOLE / TERMINAL
   ========================================================================== */
function initTerminal() {
  const termBody = document.getElementById('terminal-body');
  const termInput = document.getElementById('term-input');
  if (!termBody || !termInput) return;

  const commands = {
    help: `Available commands:
  • <span class="term-highlight">bio</span>            : Professional summary & 8+ yrs experience
  • <span class="term-highlight">experience</span>     : Timeline: IBM, Glowderma, T9L, BitGiving
  • <span class="term-highlight">ai</span>             : watsonx.ai, LLM agents & RAG architecture
  • <span class="term-highlight">badges</span>         : Verified Credly & IBM certifications
  • <span class="term-highlight">skills</span>         : Tech stack & frontend/backend matrix
  • <span class="term-highlight">projects</span>       : Open source & architectural repositories
  • <span class="term-highlight">education</span>      : B.Tech in IT (GGSCET) & Academics
  • <span class="term-highlight">contact</span>        : Direct phone, email, LinkedIn, Credly
  • <span class="term-highlight">clear</span>          : Clear terminal screen`,

    bio: `Kakul Sarma is a Senior Full-Stack Engineer and Application Consultant with over 8 years of comprehensive experience architecting, developing, and deploying scalable enterprise systems and modern AI-driven integrations. Expertise across modern JavaScript ecosystems (Next.js SSR/App Router, React, Angular), Micro-Frontend architectures (Module Federation), and intelligent GenAI/LLM middleware at IBM.`,

    experience: `Career Milestones:
  • <span class="term-highlight">Application Consultant (JS Full-Stack)</span> | IBM India Pvt Ltd (Oct 2024 – Present)
    Architecting enterprise web systems with Next.js full-stack & distributed micro-frontends.
  • <span class="term-highlight">Application Developer (JS Frontend)</span> | IBM India Pvt Ltd (June 2021 – Oct 2024)
    Module Federation micro-frontends, Next.js SSR, React, Section 508 accessibility.
  • <span class="term-highlight">Software Engineer</span> | Glowderma Pvt Ltd, Mumbai (May 2020 – May 2021)
    MERN (MongoDB, Express, React, Node.js) full-stack ecosystem.
  • <span class="term-highlight">Software Engineer</span> | T9L, Delhi (Sep 2018 – May 2020)
  • <span class="term-highlight">Software Engineer</span> | BitGiving, Delhi (Jan 2016 – Aug 2018)`,

    ai: `AI & Intelligent Middleware Stack:
  • <span class="term-highlight">watsonx.ai</span> (IBM Essentials & Deep Dive Certified)
  • <span class="term-highlight">LLM Integration</span> (OpenAI, Anthropic, watsonx)
  • <span class="term-highlight">RAG Architectures</span> (Retrieval-Augmented Generation, Vector Embeddings)
  • <span class="term-highlight">Prompt Engineering</span> & Autonomous Agent Orchestration`,

    badges: `Verified Professional Badges (IBM / Credly):
  1. Application Consultant - Cloud Full Stack (IBM)
  2. IBM watsonx Essentials (IBM)
  3. Generative AI Engineering Foundations (IBM)
  4. JavaScript Application Developer Architect (IBM / Credly)
  5. Artificial Intelligence Foundations (IBM)
  6. IBM watsonx.ai Deep Dive (IBM / Credly)
  7. Enterprise Design Thinking Practitioner (IBM)
  8. IBM Agile Explorer (IBM)
  Profile: <a href="https://www.credly.com/users/kakul-sarma.a09a1b12" target="_blank" class="term-highlight">credly.com/users/kakul-sarma.a09a1b12</a>`,

    skills: `Core Competencies:
  [Frontend]   Next.js (App Router/SSR), React, Redux, Angular 2+, TypeScript, Micro-Frontends
  [AI / Data]  watsonx.ai, OpenAI, Prompt Engineering, RAG Architectures, Vector Embeddings
  [Backend]    Node.js, Express, PHP 5.6+, RESTful APIs, MongoDB, MySQL, Firebase
  [Cloud]      AWS Serverless, GCP, Git, CI/CD Pipelines, Linux
  [Specs]      Section 508 Accessibility Compliance, Ionic 4, PhoneGap`,

    projects: `Open Source & Architecture Works:
  1. <a href="https://github.com/kakul232/angular-js-mvc" target="_blank" class="term-highlight">angular-js-mvc</a> - Architectural MVC web application engine
  2. <a href="https://github.com/kakul232/joomla_video_comment" target="_blank" class="term-highlight">joomla_video_comment</a> - Embedded interactive video feedback widget
  3. <a href="https://github.com/kakul232/joomla_frankly_tools" target="_blank" class="term-highlight">joomla_frankly_tools</a> - Frankly ME embedded video widget
  4. <a href="https://github.com/kakul232/wordpress_videopress" target="_blank" class="term-highlight">wordpress_videopress</a> - VideoPress delivery engine
  5. <a href="https://github.com/kakul232/drupal_video_tools" target="_blank" class="term-highlight">drupal_video_tools</a> - Video streaming toolchain
  6. <a href="https://github.com/kakul232/wordpress_team" target="_blank" class="term-highlight">wordpress_team</a> - Modular team showcase directory`,

    education: `Academics & Certifications:
  • <span class="term-highlight">B.Tech in Information Technology</span> | GGSCET, Talwandi Sabo (Punjab) [2010 – 2015]
  • <span class="term-highlight">Higher Secondary</span> | Nalbari College, Nalbari (Assam)
  • AWS Serverless Training (AWS)
  • Angular 2+ Core Certification (UC-9WAWTYP9)
  • Advanced JS Game Development (UC-BMMPV9OM)`,

    contact: `Direct Contact Channels:
  Email:    <span class="term-highlight">kakulsarma@gmail.com</span> / <span class="term-highlight">Kakul.Sarma@ibm.com</span>
  Phone:    <span class="term-highlight">(+91) 9871229599</span>
  Location: Nalbari, Assam, India - 781306
  LinkedIn: <a href="https://linkedin.com/in/kakulsarma" target="_blank" class="term-highlight">linkedin.com/in/kakulsarma</a>
  Credly:   <a href="https://www.credly.com/users/kakul-sarma.a09a1b12" target="_blank" class="term-highlight">credly.com/users/kakul-sarma.a09a1b12</a>
  GitHub:   <a href="https://github.com/kakul232" target="_blank" class="term-highlight">github.com/kakul232</a>`
  };

  function executeCommand(rawCmd) {
    const cmd = rawCmd.trim().toLowerCase();
    if (!cmd) return;

    const userLine = document.createElement('div');
    userLine.className = 'term-line';
    userLine.innerHTML = `<span class="term-prompt">kakul@terminal:~$</span> ${escapeHTML(rawCmd)}`;
    termBody.insertBefore(userLine, termInput.parentElement);

    if (cmd === 'clear') {
      const inputs = termInput.parentElement;
      termBody.innerHTML = '';
      termBody.appendChild(inputs);
    } else if (commands[cmd]) {
      const outLine = document.createElement('div');
      outLine.className = 'term-output';
      outLine.innerHTML = commands[cmd].replace(/\n/g, '<br>');
      termBody.insertBefore(outLine, termInput.parentElement);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-output';
      errLine.innerHTML = `Command not recognized: '<span style="color:#f87171">${escapeHTML(cmd)}</span>'. Type <span class="term-highlight">help</span> for valid options.`;
      termBody.insertBefore(errLine, termInput.parentElement);
    }

    termBody.scrollTop = termBody.scrollHeight;
  }

  termInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = termInput.value;
      termInput.value = '';
      executeCommand(val);
    }
  });

  document.querySelectorAll('.cmd-chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      termInput.value = cmd;
      executeCommand(cmd);
      termInput.value = '';
    });
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* ==========================================================================
   4. PROJECT FILTERING
   ========================================================================== */
function initProjectFiltering() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category') || '';
        if (filter === 'all' || categories.includes(filter)) {
          card.style.display = 'flex';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. GITHUB METRICS INTEGRATION (kakul232)
   ========================================================================== */
async function initGitHubMetrics() {
  const username = 'kakul232';
  const repoCountEl = document.getElementById('gh-repos-count');
  const starsCountEl = document.getElementById('gh-stars-count');
  const followersCountEl = document.getElementById('gh-followers-count');

  try {
    const res = await fetch(`https://api.github.com/users/${username}`);
    if (res.ok) {
      const data = await res.json();
      if (repoCountEl) repoCountEl.textContent = data.public_repos || '6+';
      if (followersCountEl) followersCountEl.textContent = data.followers || '1';
      
      const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=100`);
      if (reposRes.ok) {
        const repos = await reposRes.json();
        const stars = repos.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
        if (starsCountEl) starsCountEl.textContent = stars || '15+';
      }
    }
  } catch (err) {
    if (repoCountEl) repoCountEl.textContent = '6+';
    if (starsCountEl) starsCountEl.textContent = '15+';
    if (followersCountEl) followersCountEl.textContent = '1+';
  }
}

/* ==========================================================================
   6. INTERACTIVE PROCEDURAL PLAYGROUND DEMO
   ========================================================================== */
function initPlaygroundDemo() {
  const canvas = document.getElementById('demo-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const speedSlider = document.getElementById('demo-speed');
  const freqSlider = document.getElementById('demo-freq');
  const hueSlider = document.getElementById('demo-hue');

  let width = (canvas.width = canvas.parentElement.clientWidth);
  let height = (canvas.height = canvas.parentElement.clientHeight);

  window.addEventListener('resize', () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  });

  let time = 0;

  function renderWave() {
    ctx.fillStyle = 'rgba(6, 9, 17, 0.2)';
    ctx.fillRect(0, 0, width, height);

    const speed = speedSlider ? parseFloat(speedSlider.value) : 1;
    const freq = freqSlider ? parseFloat(freqSlider.value) : 0.02;
    const hue = hueSlider ? parseInt(hueSlider.value) : 185;

    time += 0.03 * speed;

    const lines = 4;
    for (let l = 0; l < lines; l++) {
      ctx.beginPath();
      ctx.lineWidth = 2.2;
      const currentHue = (hue + l * 25) % 360;
      ctx.strokeStyle = `hsla(${currentHue}, 90%, 60%, 0.8)`;
      ctx.shadowColor = `hsla(${currentHue}, 90%, 60%, 0.5)`;
      ctx.shadowBlur = 12;

      for (let x = 0; x < width; x += 4) {
        const y =
          height / 2 +
          Math.sin(x * freq + time + l * 0.8) * 45 * Math.sin(time * 0.5 + l);
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    requestAnimationFrame(renderWave);
  }
  renderWave();
}

/* ==========================================================================
   7. THEME SWITCHER
   ========================================================================== */
function initThemeSwitcher() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  const themes = ['neon', 'aurora', 'cyberpunk'];
  let currentIdx = 0;

  toggleBtn.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % themes.length;
    const theme = themes[currentIdx];
    
    if (theme === 'neon') {
      document.body.removeAttribute('data-theme');
    } else {
      document.body.setAttribute('data-theme', theme);
    }

    const icon = toggleBtn.querySelector('svg') || toggleBtn;
    icon.style.transform = 'scale(0.8) rotate(45deg)';
    setTimeout(() => {
      icon.style.transform = 'scale(1) rotate(0deg)';
    }, 200);
  });
}

/* ==========================================================================
   8. NAVIGATION & MOBILE MENU
   ========================================================================== */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  mobileBtn?.addEventListener('click', () => {
    navMenu?.classList.toggle('open');
    const isOpen = navMenu?.classList.contains('open');
    mobileBtn.setAttribute('aria-expanded', isOpen);
    mobileBtn.innerHTML = isOpen ? '&#10005;' : '&#9776;';
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navMenu?.classList.remove('open');
      if (mobileBtn) mobileBtn.innerHTML = '&#9776;';
    });
  });
}

/* ==========================================================================
   9. CONTACT FORM & INSTANT EMAIL COPY
   ========================================================================== */
function initContactForm() {
  const copyBtn = document.getElementById('copy-email-btn');
  const copyIbmBtn = document.getElementById('copy-ibm-email-btn');

  function setupCopy(btn, emailText) {
    btn?.addEventListener('click', (e) => {
      e.preventDefault();
      navigator.clipboard.writeText(emailText).then(() => {
        const badge = btn.querySelector('.copy-badge');
        if (badge) {
          const original = badge.textContent;
          badge.textContent = 'Copied!';
          badge.style.background = 'rgba(16, 185, 129, 0.2)';
          badge.style.color = '#34d399';
          setTimeout(() => {
            badge.textContent = original;
            badge.style.background = '';
            badge.style.color = '';
          }, 2200);
        }
      });
    });
  }

  setupCopy(copyBtn, 'kakulsarma@gmail.com');
  setupCopy(copyIbmBtn, 'Kakul.Sarma@ibm.com');

  const contactForm = document.getElementById('portfolio-contact-form');
  const alertEl = document.getElementById('contact-alert');

  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    if (alertEl) {
      alertEl.className = 'form-alert success';
      alertEl.textContent = 'Thank you! Your message inquiry has been received. Kakul will connect with you promptly.';
      contactForm.reset();
      setTimeout(() => {
        alertEl.style.display = 'none';
      }, 5000);
    }
  });
}
