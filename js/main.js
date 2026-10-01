/* ==========================================================================
   KAKUL SARMA - PORTFOLIO INTERACTIVITY SCRIPT
   Features: Particle Constellation, Interactive Dev Console, GitHub Stats,
             Interactive Procedural Playground, Filtering & Theme Switcher
   Updated: Resume details, IBM Watsonx AI, Credly verification & Experience
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initExperienceCalculator();
  initParticleBackground();
  initTypewriter();
  initTerminal();
  initArticles();
  initBadges();
  initRecommendations();
  initProjectFiltering();
  initGitHubMetrics();
  initPlaygroundDemo();
  initThemeSwitcher();
  initNavigation();
  initContactForm();
  initMaterialRipple();
  initFabScroll();
  initServiceWorker();
});

/* Service Worker Registration for Offline Caching & Repeat Visitor Speed */
function initServiceWorker() {
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => console.log('[Service Worker] Registered:', reg.scope))
        .catch((err) => console.warn('[Service Worker] Failed:', err.message));
    });
  }
}

/* ==========================================================================
   0. ENTERPRISE & RELEVANT EXPERIENCE CALCULATOR
   ========================================================================== */
function initExperienceCalculator() {
  const now = new Date();

  function calcTenure(startYear, startMonth) {
    // startMonth is 1-indexed (1 = Jan, 5 = May, 9 = Sep, 10 = Oct)
    const startDate = new Date(startYear, startMonth - 1, 1);
    const diffMs = now.getTime() - startDate.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const yearsFloat = diffDays / 365.2425;
    const floorYears = Math.max(1, Math.floor(yearsFloat));
    const remainingMonths = Math.floor((yearsFloat - floorYears) * 12);

    let formatted = `${floorYears}+ Years`;
    let shortFormatted = `${floorYears}+ Yrs`;
    if (floorYears < 3 && remainingMonths >= 6) {
      formatted = `${floorYears}.5+ Years`;
      shortFormatted = `${floorYears}.5+ Yrs`;
    }

    return {
      years: floorYears,
      months: remainingMonths,
      exactYears: yearsFloat.toFixed(1),
      formatted: formatted,
      short: shortFormatted
    };
  }

  // Anchor career milestones directly from resume:
  // - BitGiving (Enterprise start): Jan 2016
  // - Python (FastAPI, AI microservices, data scripting): May 2020
  // - AI (watsonx.ai, Generative AI Foundations, Agentic AI, RAG): Oct 2022
  // - React (T9L, Glowderma MERN, Next.js at IBM): Sep 2018
  // - Angular (Angular 2+ Certified UC-9WAWTYP9, SPAs at IBM): Jan 2019
  // - NodeJs (Express, REST APIs, Microservices, Next.js server): Sep 2018
  const expData = {
    total: calcTenure(2016, 1),
    python: calcTenure(2020, 5),
    ai: calcTenure(2022, 10),
    react: calcTenure(2018, 9),
    angular: calcTenure(2019, 1),
    nodejs: calcTenure(2018, 9)
  };

  window.autoCalculatedExperience = expData;

  // 1. Update Hero Status Badge
  const heroBadge = document.getElementById('auto-total-exp');
  if (heroBadge) {
    heroBadge.textContent = `${expData.total.formatted} Enterprise Experience`;
  }

  // 2. Update Hero Quick Stat
  const heroStatTotal = document.getElementById('hero-stat-total-exp');
  if (heroStatTotal) {
    heroStatTotal.textContent = expData.total.short;
  }

  // 3. Update Relevant Exp Cards
  const valMap = {
    'exp-val-python': expData.python.formatted,
    'exp-val-ai': expData.ai.formatted,
    'exp-val-react': expData.react.formatted,
    'exp-val-angular': expData.angular.formatted,
    'exp-val-nodejs': expData.nodejs.formatted
  };

  Object.entries(valMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });

  // 4. Update Experience Section Subtitle
  const expSummary = document.getElementById('exp-total-years-summary');
  if (expSummary) {
    expSummary.textContent = expData.total.formatted;
  }

  // 5. Update Skill Matrix Tenure Badges
  const skillTenureMap = {
    'skill-tenure-python': expData.python.short,
    'skill-tenure-ai': expData.ai.short,
    'skill-tenure-react': expData.react.short,
    'skill-tenure-angular': expData.angular.short,
    'skill-tenure-nodejs': expData.nodejs.short
  };

  Object.entries(skillTenureMap).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  });
}

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
      this.baseColor = Math.random() > 0.4 ? 'rgba(252, 163, 17, ' : 'rgba(229, 229, 229, ';
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
          ctx.strokeStyle = `rgba(252, 163, 17, ${alpha})`;
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
    'Python | JavaScript | GenAI & Agentic AI',
    'Core Architecture & Systems',
    'AI Cybersecurity (OWASP • NIST)',
    'Senior Full-Stack Engineer',
    'Application Consultant @ IBM',
    'Micro-Frontend & Next.js Architect'
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
  • <span class="term-highlight">bio</span>            : Senior Full-Stack Engineer & Consultant summary
  • <span class="term-highlight">experience</span>     : Timeline: IBM, Glowderma, T9L, BitGiving
  • <span class="term-highlight">relexp</span>         : Live auto-calculated experience (Python, AI, React, Angular, NodeJs)
  • <span class="term-highlight">ai</span>             : Python, Agentic AI, MCP Servers, watsonx.ai
  • <span class="term-highlight">security</span>       : AI Cybersecurity (OWASP Top 10 for LLMs, NIST AI RMF)
  • <span class="term-highlight">badges</span>         : Verified Credly & IBM certifications
  • <span class="term-highlight">articles</span>       : Technical publications & LinkedIn articles
  • <span class="term-highlight">recommendations</span>: Peer & leadership endorsements from IBM
  • <span class="term-highlight">skills</span>         : Tech stack & frontend/backend/AI matrix
  • <span class="term-highlight">projects</span>       : Open source & architectural repositories
  • <span class="term-highlight">education</span>      : B.Tech in IT (GGSCET) & Academics
  • <span class="term-highlight">contact</span>        : Direct phone, email, LinkedIn, ORCID
  • <span class="term-highlight">clear</span>          : Clear terminal screen`,

    relexp: () => {
      const exp = window.autoCalculatedExperience;
      if (!exp) return 'Experience data initializing...';
      return `# RELEVANT EXPERIENCE (Live Auto-Calculated):
  • <span class="term-highlight">Enterprise Total</span> : ${exp.total.formatted} (Started Jan 2016 at BitGiving)
  -------------------------------------------------------------
  • <span class="term-highlight">Python</span>           : ${exp.python.formatted} (FastAPI &bull; AI Middleware &bull; Data Scripting)
  • <span class="term-highlight">AI / GenAI</span>       : ${exp.ai.formatted} (watsonx.ai &bull; Agentic AI &bull; RAG &bull; MCP)
  • <span class="term-highlight">React</span>            : ${exp.react.formatted} (Next.js SSR/App Router &bull; Module Federation)
  • <span class="term-highlight">Angular</span>          : ${exp.angular.formatted} (Angular 2+ Certified UC-9WAWTYP9 &bull; SPAs)
  • <span class="term-highlight">NodeJs</span>           : ${exp.nodejs.formatted} (Express &bull; REST APIs &bull; Backend Runtime)`;
    },

    calculate: () => commands.relexp(),

    recommendations: `Peer & Leadership Recommendations (LinkedIn):
  1. Senior Engineering Manager (IBM Consulting)
     "Kakul is an outstanding Senior Full-Stack & AI Engineer. His leadership in architecting decoupled Next.js micro-frontends with Module Federation and operationalizing watsonx.ai LLM pipelines substantially accelerated our delivery velocity."
  2. Lead Enterprise AI Architect (IBM Client Engineering)
     "Collaborating with Kakul on generative AI workflows was a pleasure. He spearheaded the design of dynamic RAG retrieval pipelines, LLM guardrails, and secure API gateways."
  3. Senior Full-Stack Consultant (Enterprise Global Delivery)
     "In high-pressure hackathons like the Bobathon and multi-squad enterprise releases, his technical clarity and supportive mentorship kept the squad firing on all cylinders."
  LinkedIn: <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">linkedin.com/in/kakulsarma</a>`,
    recs: () => commands.recommendations,

    articles: `Published Technical Articles & Insights on LinkedIn:
  1. <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">Architecting Scalable Micro-Frontends with Module Federation in Enterprise Next.js</a>
     - Decoupling autonomous business domains & eliminating global bundle overhead.
  2. <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">Operationalizing watsonx.ai & RAG Pipelines in Production JavaScript Backends</a>
     - Enterprise LLM integration, vector embeddings & context chunking with Node.js.
  3. <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">Section 508 Compliance & High-Performance Rendering in Large-Scale SPAs</a>
     - Inclusive accessibility engineering without compromising rendering velocity.
  Follow: <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">linkedin.com/in/kakulsarma</a>`,

    publications: `(Alias for articles) Type <span class="term-highlight">articles</span> for full publication list.`,

    bio: () => {
      const exp = window.autoCalculatedExperience;
      const totalStr = exp ? exp.total.formatted : '8+ Years';
      return `Dynamic and results-driven Senior Full-Stack Engineer and Application Consultant with extensive background across modern Python, JavaScript ecosystems (Next.js SSR/App Router, React, Angular 2+), distributed Micro-Frontend architectures (Module Federation), and intelligent GenAI/LLM middleware at IBM. Over ${totalStr} of enterprise architectural excellence.`;
    },

    experience: () => {
      const exp = window.autoCalculatedExperience;
      const totalStr = exp ? exp.total.formatted : '8+ Years';
      return `Career Milestones (${totalStr} Enterprise Experience):
  • <span class="term-highlight">Application Consultant (JS Full-Stack)</span> | IBM India Pvt Ltd (Oct 2024 – Present)
    Architecting enterprise web systems with Next.js full-stack & distributed micro-frontends.
  • <span class="term-highlight">Application Developer (JS Frontend)</span> | IBM India Pvt Ltd (June 2021 – Oct 2024)
    Module Federation micro-frontends, Next.js SSR, React, Section 508 accessibility.
  • <span class="term-highlight">Software Engineer</span> | Glowderma Pvt Ltd, Mumbai (May 2020 – May 2021)
    MERN (MongoDB, Express, React, Node.js) full-stack ecosystem.
  • <span class="term-highlight">Software Engineer</span> | T9L, Delhi (Sep 2018 – May 2020)
  • <span class="term-highlight">Software Engineer</span> | BitGiving, Delhi (Jan 2016 – Aug 2018)
  -------------------------------------------------------------
  Type <span class="term-highlight">relexp</span> to view auto-calculated tenure across Python, AI, React, Angular, NodeJs.`;
    },

    ai: `AI & Intelligent Middleware Stack:
  • <span class="term-highlight">Core Domain</span>: Python | JavaScript | GenAI & Agentic AI | Core Architecture
  • <span class="term-highlight">watsonx.ai</span> (IBM Essentials & Deep Dive Certified)
  • <span class="term-highlight">MCP Servers</span> (Model Context Protocol & Custom Tool Calling)
  • <span class="term-highlight">Python & FastAPI</span> (Autonomous Agentic AI, Tool Chains & Middleware)
  • <span class="term-highlight">LLM Integration</span> (OpenAI, Anthropic Claude, IBM Granite, watsonx)
  • <span class="term-highlight">RAG Architectures</span> (Vector Embeddings, Hybrid Search, Milvus/Chroma)
  • <span class="term-highlight">AI Cybersecurity</span> (OWASP Top 10 for LLMs, NIST AI RMF)`,

    security: `AI Cybersecurity & Governance Frameworks:
  • <span class="term-highlight">OWASP Top 10 for LLMs</span>:
    - LLM01: Prompt Injection mitigation (input sanitization, dual-LLM arbiters, prompt firewalls)
    - LLM02: Insecure Output Handling & context leakage prevention
    - LLM06: Sensitive Information Disclosure & PII stripping filters
    - LLM08: Vector & Embedding poisoning defense
  • <span class="term-highlight">NIST AI RMF (Risk Management Framework)</span>:
    - GOVERN, MAP, MEASURE, MANAGE lifecycle controls
    - Threat modeling for autonomous agentic loops & tool calling
  • <span class="term-highlight">Agent Sandboxing & MCP Security</span>:
    - Principle of least privilege for Model Context Protocol (MCP) tool execution
    - Human-in-the-loop (HITL) gates for high-impact API integrations`,

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

    skills: () => {
      const exp = window.autoCalculatedExperience;
      const pyYrs = exp ? exp.python.formatted : '4+ Years';
      const aiYrs = exp ? exp.ai.formatted : '3+ Years';
      const reactYrs = exp ? exp.react.formatted : '7+ Years';
      const angYrs = exp ? exp.angular.formatted : '5+ Years';
      const nodeYrs = exp ? exp.nodejs.formatted : '7+ Years';
      return `Core Competencies & Auto-Calculated Tech Matrix:
  [Python (${pyYrs})]    FastAPI, Flask, Scripting, AI Microservices & Agents
  [AI / GenAI (${aiYrs})] watsonx.ai, MCP Servers, LangChain, RAG Pipelines, Prompt Eng.
  [React (${reactYrs})]    Next.js (App Router/SSR), React, Redux, Micro-Frontends
  [Angular (${angYrs})]  Angular 2+ (Certified UC-9WAWTYP9), Component Architecture
  [NodeJs (${nodeYrs})]   Express, REST APIs, Microservices, Async Event Loops
  [Security]             OWASP Top 10 for LLMs, NIST AI RMF, Secure Agent Sandboxing
  [Cloud & Data]         MongoDB, MySQL, PostgreSQL, Vector DBs, AWS Serverless, Docker`;
    },

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
  LinkedIn: <a href="https://linkedin.com/in/kakulsarma" target="_blank" class="term-highlight">linkedin.com/in/kakulsarma</a>
  ORCID:    <a href="https://orcid.org/0009-0004-4327-501X" target="_blank" class="term-highlight">0009-0004-4327-501X</a>
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
    } else if (cmd === 'articles' && globalArticlesData.length > 0) {
      let list = 'Published Technical Articles & Insights on LinkedIn:\n';
      globalArticlesData.slice(0, 6).forEach((a, i) => {
        list += `  ${i + 1}. <a href="${a.url}" target="_blank" class="term-highlight">${escapeHTML(a.title)}</a>\n     - ${escapeHTML(a.snippet.substring(0, 100))}...\n`;
      });
      list += `  Follow: <a href="https://www.linkedin.com/in/kakulsarma/" target="_blank" class="term-highlight">linkedin.com/in/kakulsarma</a>`;
      const outLine = document.createElement('div');
      outLine.className = 'term-output';
      outLine.innerHTML = list.replace(/\n/g, '<br>');
      termBody.insertBefore(outLine, termInput.parentElement);
    } else if (commands[cmd]) {
      const outLine = document.createElement('div');
      outLine.className = 'term-output';
      const outputText = typeof commands[cmd] === 'function' ? commands[cmd]() : commands[cmd];
      outLine.innerHTML = outputText.replace(/\n/g, '<br>');
      termBody.insertBefore(outLine, termInput.parentElement);
    } else {
      const errLine = document.createElement('div');
      errLine.className = 'term-output';
      errLine.innerHTML = `Command not recognized: '<span style="color:#fca311">${escapeHTML(cmd)}</span>'. Type <span class="term-highlight">help</span> for valid options.`;
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

let globalArticlesData = [];

/* ==========================================================================
   3.5 DYNAMIC ARTICLES DATA LOADER (30-DAY CRON INTEGRATION)
   ========================================================================== */
async function initArticles() {
  const container = document.getElementById('articles-container');
  if (!container) return;

  try {
    const res = await fetch('assets/data/articles.json');
    if (res.ok) {
      const articles = await res.json();
      if (Array.isArray(articles) && articles.length > 0) {
        globalArticlesData = articles;
        renderArticles(articles, container);
      }
    }
  } catch (err) {
    console.log('[Articles] Using static fallback articles:', err);
  }
}

function renderArticles(articles, container) {
  container.innerHTML = '';
  articles.slice(0, 6).forEach((art) => {
    const card = document.createElement('a');
    card.href = art.url || 'https://www.linkedin.com/in/kakulsarma/';
    card.target = '_blank';
    card.rel = 'noopener noreferrer';
    card.className = 'article-card';
    if (art.id) card.id = art.id;

    card.innerHTML = `
      <div class="article-meta-top">
        <span class="article-tag">${escapeHTML(art.tag || 'Tech Insight')}</span>
        <span class="article-read-time">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          ${escapeHTML(art.readTime || '6 min read')}
        </span>
      </div>
      <h3 class="article-title">${escapeHTML(art.title)}</h3>
      <p class="article-snippet">${escapeHTML(art.snippet)}</p>
      <div class="article-footer">
        <span class="article-linkedin-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          Read on LinkedIn
        </span>
        <span>&rarr;</span>
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   3.5 DYNAMIC PEER RECOMMENDATIONS LOADER
   ========================================================================== */
async function initRecommendations() {
  const container = document.getElementById('recommendations-container');
  if (!container) return;

  try {
    const res = await fetch('assets/data/recommendations.json');
    if (res.ok) {
      const recs = await res.json();
      if (Array.isArray(recs) && recs.length > 0) {
        renderRecommendations(recs, container);
      }
    }
  } catch (err) {
    console.log('[Recommendations] Using static fallback recommendations:', err);
  }
}

function renderRecommendations(recs, container) {
  container.innerHTML = '';
  recs.forEach((rec) => {
    const card = document.createElement('div');
    card.className = 'recommendation-card';
    if (rec.id) card.id = rec.id;

    const skillsHtml = Array.isArray(rec.skills) && rec.skills.length > 0
      ? `<div class="rec-skills-wrap">${rec.skills.map((s) => `<span class="rec-skill-pill">${escapeHTML(s)}</span>`).join('')}</div>`
      : '';

    card.innerHTML = `
      <div class="rec-card-top">
        <div class="rec-quote-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
          </svg>
        </div>
        <span class="rec-verified-pill">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          Verified Peer
        </span>
      </div>
      <p class="rec-quote-text">&ldquo;${escapeHTML(rec.text)}&rdquo;</p>
      ${skillsHtml}
      <div class="rec-author-container">
        <div class="rec-author-row">
          <div class="rec-avatar" style="background:${rec.avatarGradient || 'linear-gradient(135deg, #14213d 0%, #fca311 100%)'};">
            ${escapeHTML(rec.initials || 'KS')}
          </div>
          <div class="rec-author-meta">
            <div class="rec-author-name">${escapeHTML(rec.name)}</div>
            <div class="rec-author-role">${escapeHTML(rec.role)} &bull; <strong class="rec-company">${escapeHTML(rec.company)}</strong></div>
          </div>
        </div>
        <div class="rec-author-footer">
          <span class="rec-author-rel">${escapeHTML(rec.relationship || 'LinkedIn Endorsement')}</span>
          <a href="${escapeHTML(rec.linkedinUrl || 'https://www.linkedin.com/in/kakulsarma/')}" target="_blank" rel="noopener noreferrer" class="rec-linkedin-link" title="View Kakul on LinkedIn">LinkedIn &#x2197;</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function escapeHTML(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

const BADGES_PER_PAGE = 8;
let currentBadgesPage = 1;
let currentBadgesFilter = 'all';
let globalBadgesData = [];

/* ==========================================================================
   3.6 DYNAMIC CREDLY VERIFIED BADGES LOADER, PAGINATION & FILTER (LIVE SYNC)
   ========================================================================== */
async function initBadges() {
  const container = document.getElementById('badges-container');
  if (!container) return;

  try {
    const res = await fetch('assets/data/badges.json');
    if (res.ok) {
      const badges = await res.json();
      if (Array.isArray(badges) && badges.length > 0) {
        globalBadgesData = badges;
        setupBadgeFilters();
        renderBadgesView();
      }
    }
  } catch (err) {
    console.log('[Badges] Using static fallback badges:', err);
  }
}

function getFilteredBadges() {
  if (currentBadgesFilter === 'all') {
    return globalBadgesData;
  }
  return globalBadgesData.filter((b) => b.category === currentBadgesFilter);
}

function renderBadgeSkills(skills) {
  if (!Array.isArray(skills) || skills.length === 0) return '';
  const clean = skills.filter((s) => s && !s.startsWith('PWID-') && s.length < 32);
  if (clean.length === 0) return '';

  const maxToShow = clean[0].length > 14 ? 2 : 3;
  const display = clean.slice(0, maxToShow);
  const remaining = clean.length - display.length;

  let html = `<div class="badge-skills-wrap">`;
  display.forEach((skill) => {
    html += `<span class="badge-skill-tag" title="${escapeHTML(skill)}">${escapeHTML(skill)}</span>`;
  });
  if (remaining > 0) {
    const moreText = clean.slice(maxToShow).map((s) => escapeHTML(s)).join(', ');
    html += `<span class="badge-skill-tag badge-skill-more" title="${moreText}">+${remaining}</span>`;
  }
  html += `</div>`;
  return html;
}

function renderBadgesView() {
  const container = document.getElementById('badges-container');
  const paginationContainer = document.getElementById('badges-pagination');
  if (!container) return;

  const filtered = getFilteredBadges();
  const totalPages = Math.ceil(filtered.length / BADGES_PER_PAGE) || 1;

  if (currentBadgesPage > totalPages) {
    currentBadgesPage = totalPages;
  }
  if (currentBadgesPage < 1) {
    currentBadgesPage = 1;
  }

  const startIndex = (currentBadgesPage - 1) * BADGES_PER_PAGE;
  const pageBadges = filtered.slice(startIndex, startIndex + BADGES_PER_PAGE);

  container.innerHTML = '';
  pageBadges.forEach((b) => {
    const card = document.createElement('div');
    card.className = 'badge-card';
    card.setAttribute('data-category', b.category || 'all');
    if (b.id) card.id = `badge-${b.id}`;

    const credlyUrl = b.credlyUrl || `https://www.credly.com/badges/${b.id}`;

    const imgMarkup = b.imageUrl
      ? `<img src="${escapeHTML(b.imageUrl)}" alt="${escapeHTML(b.title)}" class="badge-credly-img" width="84" height="84" loading="lazy" onerror="this.onerror=null; this.src='assets/favicon.svg';">`
      : `<div class="badge-icon-wrap">&#x1F3C5;</div>`;

    card.innerHTML = `
      <div class="badge-header-row">
        <div class="badge-img-wrap">
          ${imgMarkup}
        </div>
        ${renderBadgeSkills(b.skills)}
      </div>
      <h3 class="badge-title">${escapeHTML(b.title)}</h3>
      <div class="badge-issuer">
        <span class="badge-issuer-text">Issued by <strong class="issuer-name">${escapeHTML(b.issuer || 'IBM')}</strong></span>
        <a href="${escapeHTML(credlyUrl)}" target="_blank" rel="noopener noreferrer" class="credly-verify-tag" title="Verify on Credly (opens in new tab)" aria-label="Verify ${escapeHTML(b.title)} on Credly">&#x2713; Verified &#x2197;</a>
      </div>
    `;
    container.appendChild(card);
  });

  renderBadgePagination(paginationContainer, totalPages, filtered.length);
}

function renderBadgePagination(paginationContainer, totalPages, totalItems) {
  if (!paginationContainer) return;
  paginationContainer.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.type = 'button';
  prevBtn.className = 'badge-page-btn';
  prevBtn.innerHTML = '&larr; Prev';
  prevBtn.disabled = currentBadgesPage === 1;
  prevBtn.setAttribute('aria-label', 'Previous Page');
  prevBtn.addEventListener('click', () => {
    if (currentBadgesPage > 1) {
      currentBadgesPage--;
      renderBadgesView();
      scrollToBadges();
    }
  });
  paginationContainer.appendChild(prevBtn);

  // Page Numbers
  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement('button');
    pageBtn.type = 'button';
    pageBtn.className = `badge-page-btn ${p === currentBadgesPage ? 'active' : ''}`;
    pageBtn.textContent = p;
    pageBtn.setAttribute('aria-label', `Page ${p}`);
    pageBtn.addEventListener('click', () => {
      if (currentBadgesPage !== p) {
        currentBadgesPage = p;
        renderBadgesView();
        scrollToBadges();
      }
    });
    paginationContainer.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.type = 'button';
  nextBtn.className = 'badge-page-btn';
  nextBtn.innerHTML = 'Next &rarr;';
  nextBtn.disabled = currentBadgesPage === totalPages;
  nextBtn.setAttribute('aria-label', 'Next Page');
  nextBtn.addEventListener('click', () => {
    if (currentBadgesPage < totalPages) {
      currentBadgesPage++;
      renderBadgesView();
      scrollToBadges();
    }
  });
  paginationContainer.appendChild(nextBtn);

  // Info label
  const infoSpan = document.createElement('span');
  infoSpan.className = 'badge-page-info';
  const startIdx = (currentBadgesPage - 1) * BADGES_PER_PAGE + 1;
  const endIdx = Math.min(currentBadgesPage * BADGES_PER_PAGE, totalItems);
  infoSpan.textContent = `(${startIdx}–${endIdx} of ${totalItems})`;
  paginationContainer.appendChild(infoSpan);
}

function scrollToBadges() {
  const badgeSection = document.getElementById('badges');
  if (badgeSection) {
    badgeSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function setupBadgeFilters() {
  const filterBtns = document.querySelectorAll('.badge-filter-btn');
  if (!filterBtns.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentBadgesFilter = btn.getAttribute('data-filter') || 'all';
      currentBadgesPage = 1;
      renderBadgesView();
    });
  });
}

function renderBadges(badges, container) {
  if (Array.isArray(badges)) {
    globalBadgesData = badges;
  }
  renderBadgesView();
}
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
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
          badge.style.background = 'rgba(252, 163, 17, 0.2)';
          badge.style.color = '#fca311';
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
  const submitBtn = document.getElementById('btn-submit-message');

  contactForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');

    const name = nameInput ? nameInput.value.trim() : '';
    const email = emailInput ? emailInput.value.trim() : '';
    const message = messageInput ? messageInput.value.trim() : '';

    if (!name || !email || !message) return;

    const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Sending to kakulsarma@gmail.com...</span>';
    }

    try {
      const response = await fetch('https://formsubmit.co/ajax/kakulsarma@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          message: message,
          _subject: `New Portfolio Consulting Inquiry from ${name}`
        })
      });

      const result = await response.json();

      if (response.ok && (result.success === 'true' || result.success === true || response.status === 200)) {
        if (alertEl) {
          alertEl.className = 'form-alert success';
          alertEl.style.display = 'block';
          alertEl.textContent = 'Thank you! Your message inquiry has been successfully sent to kakulsarma@gmail.com. Kakul will connect with you promptly.';
        }
        contactForm.reset();
      } else {
        throw new Error('Failed to send via FormSubmit API');
      }
    } catch (err) {
      // Fallback: Open prefilled mailto directly addressed to kakulsarma@gmail.com
      const mailtoUrl = `mailto:kakulsarma@gmail.com?subject=${encodeURIComponent('Consulting Inquiry from ' + name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\nMessage:\n' + message)}`;
      window.location.href = mailtoUrl;

      if (alertEl) {
        alertEl.className = 'form-alert success';
        alertEl.style.display = 'block';
        alertEl.textContent = 'Opening your email client to send inquiry directly to kakulsarma@gmail.com...';
      }
      contactForm.reset();
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHtml;
      }
      setTimeout(() => {
        if (alertEl) alertEl.style.display = 'none';
      }, 7000);
    }
  });
}

/* ==========================================================================
   10. MATERIAL DESIGN 3 RIPPLE TOUCH EFFECT
   ========================================================================== */
function initMaterialRipple() {
  document.addEventListener('pointerdown', (e) => {
    const target = e.target.closest(
      '.btn-primary, .btn-secondary, .btn-nav-hire, .badge-filter-btn, .filter-btn, .cmd-chip, .badge-page-btn, .social-btn, .theme-toggle-btn, .md-fab, .rec-linkedin-link, .credly-verify-tag'
    );
    if (!target) return;

    target.classList.add('md-ripple');
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    const ink = document.createElement('span');
    ink.className = 'md-ripple-ink';
    ink.style.width = `${size}px`;
    ink.style.height = `${size}px`;
    ink.style.left = `${x}px`;
    ink.style.top = `${y}px`;

    target.appendChild(ink);
    setTimeout(() => {
      ink.remove();
    }, 650);
  });
}

/* ==========================================================================
   11. MATERIAL DESIGN 3 FAB BACK-TO-TOP CONTROLLER
   ========================================================================== */
function initFabScroll() {
  const fab = document.getElementById('md-fab-top');
  if (!fab) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      fab.classList.add('show');
    } else {
      fab.classList.remove('show');
    }
  });

  fab.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

