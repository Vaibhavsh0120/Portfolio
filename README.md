<h1 align='center'>🌟 Vaibhav Sharma – Developer Portfolio</h1>

<img src="https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif" width="40%" alt="Coding Animation" align='right'>

A modern, fully responsive portfolio showcasing my work, skills, and journey.
Built with cutting-edge technologies for a smooth user experience, high performance, and a clean, appealing design.

* 📱 **Fully Responsive & PWA** – Installable Web App optimized for all devices
* ⚛️ **Built with Next.js + TypeScript** – Fast, scalable, and maintainable codebase  
* 🌙 **Dark/Light Mode** – Seamless theme switching with adaptive logos
* 📝 **Integrated Headless CMS** – Secure, custom-built admin panel for instant content updates

---

## 🚀 Live Demo

<p align="center">
  <a href="https://vaibhavsh0120.vercel.app/">
    <img src="https://img.shields.io/badge/🚀%20Live%20Portfolio-1f1f1f?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Portfolio">
  </a>
  <br>
  <i>Click to explore the full interactive experience</i>
</p>


---

## ✨ Features

- 🎨 **Modern UI/UX** – Minimal, clean design with smooth animations  
- 🌙 **Dark/Light Mode** – Seamless theme switching via `next-themes`
- 📱 **Progressive Web App (PWA)** – Installable on desktop and mobile with theme-aware icons
- 🔒 **Custom Built CMS (`/admin`)** – Authenticated dashboard to manage portfolio content dynamically
- 🖼️ **Image Management** – Built-in cropping tool and direct Cloudinary integrations for optimized asset delivery
- 💼 **Projects Showcase** – With live demos & GitHub links  
- 📩 **Contact Form** – Validation & status feedback  
- 📄 **Resume Download** – One-click CV download  
- ⚡ **Performance Optimized** – SEO-friendly & blazing fast  

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/), [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)  
- **Database & Auth:** [Firebase](https://firebase.google.com/) (Firestore & Firebase Auth)
- **Asset Hosting:** [Cloudinary](https://cloudinary.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), [Framer Motion](https://www.framer.com/motion/)  
- **Icons:** [Lucide React](https://lucide.dev/)  
- **Deployment:** [Vercel](https://vercel.com/)  

---

## 📂 Architecture & Structure

```
vaibhav-portfolio/
├── app/                      # Next.js Routing
│   ├── admin/                # Secure CMS route
│   ├── api/                  # API endpoints (Auth, Uploads)
│   ├── globals.css           # Global Tailwind styles
│   ├── layout.tsx            # Root layout & Metadata
│   └── page.tsx              # Portfolio entry point
├── components/
│   ├── admin/                # CMS Dashboard components
│   │   ├── core/             # Core CMS logic & hooks
│   │   ├── editors/          # Content specific editor panels
│   │   └── screens/          # Top-level CMS views
│   ├── portfolio/            # Public Portfolio components
│   │   └── sections/         # Feature blocks (Hero, About, Projects)
│   └── ui/                   # Reusable UI building blocks (Buttons, Cards, Loaders)
├── lib/
│   ├── cms/                  # Content modeling & typing
│   ├── cloudinary/           # Image hosting utilities
│   ├── core/                 # Shared generic utilities
│   └── firebase/             # Database and Auth integrations
├── public/                   # Static assets (Logos, Web App Manifest)
├── .env.example              # Environment variables template
├── package.json              # Project dependencies
└── tailwind.config.js        # Tailwind CSS configuration
```

---

## ⚙️ Installation & Setup

1. **Clone the repository**
    ```bash
   git clone https://github.com/Vaibhavsh0120/portfolio.git
   cd portfolio
    ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   * Create a `.env.local` file based on `.env.example`
   * Add your Firebase configuration keys
   * Add your Cloudinary API keys
   * Set your `ADMIN_EMAIL`

4. **Run the development server**

   ```bash
   npm run dev
   ```

5. **Build for production**

   ```bash
   npm run build
   npm start
   ```
---

<p align="center">
  ⭐ If you like this portfolio, please consider giving it a star!
</p>