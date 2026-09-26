# Kakul Sarma — Personal Domain & Portfolio
**Live Site URL:** [https://kakul232.github.io/](https://kakul232.github.io/)

A modern, high-performance personal portfolio website for **Kakul Sarma** (`kakul232`), Creative Full-Stack Developer and Software Engineer at IBM.

## ✨ Highlights & Features
- **Modern Neon Glassmorphism Aesthetics:** Obsidian dark mode, subtle ambient glows, responsive card layouts, and polished micro-interactions.
- **Interactive Particle Background:** Reactive constellation canvas responding to cursor movements and window viewport sizing.
- **Interactive Developer Console / CLI:** Command-line terminal supporting `bio`, `skills`, `projects`, `stats`, `contact`, and `clear`.
- **Dynamic Project Showcase:** Filter open-source works across Web Architecture, Video Tools, CMS Modules, and Full-Stack systems.
- **Live GitHub Metrics:** Real-time integration with the GitHub API for `@kakul232`.
- **Procedural Waveform Playground:** Interactive real-time audio-visual canvas with speed, harmonic frequency, and chroma spectrum controls.
- **Theme Switcher:** Seamlessly switch between **Neon Cyber**, **Aurora Violet**, and **Cyberpunk Amber** themes.
- **Direct Connect & Email Copy:** One-click copy for `Kakul.Sarma@ibm.com` and interactive message form.
- **Zero-Dependency Fast Loading:** Built with pure semantic HTML5, Vanilla CSS3, and modern JavaScript for maximum speed and 100/100 Lighthouse scores.

---

## 🚀 How to Publish to GitHub Pages

### Step 1: Create the GitHub Repository
1. Go to [https://github.com/new](https://github.com/new).
2. Set the repository name to:
   ```
   kakul232.github.io
   ```
3. Set visibility to **Public**.
4. Leave all initialization options (README, .gitignore, license) unchecked (since we already have them).
5. Click **Create repository**.

### Step 2: Push Your Local Repository
Run the following commands in PowerShell from `c:\project7\PERSONAL-DOMAIN`:
```bash
git remote add origin https://github.com/kakul232/kakul232.github.io.git
git branch -M main
git push -u origin main
```

### Step 3: Verify GitHub Pages
1. Go to your repository on GitHub: `https://github.com/kakul232/kakul232.github.io`
2. Click **Settings** &rarr; **Pages** (under Code and automation in the left sidebar).
3. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** `main` / `/ (root)`
   - Click **Save**.
4. Within 1-2 minutes, your website will be live at:
   **[https://kakul232.github.io/](https://kakul232.github.io/)**

---

## 🛠 Local Preview
You can preview locally with any web server (or Python):
```bash
python -m http.server 8080
```
Then navigate to `http://localhost:8080` in your web browser.
