# 🎨 ITom Dev | Interactive 3D WebGL Portfolio

<div align="center">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Three.js-0.182-black?style=for-the-badge&logo=threedotjs" alt="Three.js" />
  <img src="https://img.shields.io/badge/R3F-9.4-purple?style=for-the-badge&logo=react" alt="React Three Fiber" />
  <img src="https://img.shields.io/badge/GSAP-3.14-green?style=for-the-badge&logo=greensock" alt="GSAP" />
  <img src="https://img.shields.io/badge/Vite-7.2-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
</div>

<br/>

Welcome to the open-source repository of **Tomasz "ITom" Szmajda's** interactive 3D Web Developer portfolio. This project pushes the limits of modern web technologies by blending spatial WebGL computing, complex React ecosystems, and highly optimized frontend engineering.

> [!NOTE]
> Ensure hardware acceleration is enabled in your browser settings to experience the smooth 60 FPS high-tier rendering of this application.

## 🚀 Key Performance Architectures (2026 Standards)

This application is strictly optimized for cross-device operability, achieving zero lag spikes even on mobile processors through several bespoke architectural implementations:

1. **Invisible Semantic SEO Fallback:** Bypasses WebGL canvas SEO limitations via strategic `sr-only-seo` indexing DOM injections, rendering fully visible semantic trees to native search-engine crawlers without mounting heavy bundles.
2. **Asynchronous Shader Compilation:** Enforces `gl.compileAsync` during the Preloading phase inside a hidden `RoomWarmup` Suspense boundary. This allows Three.js to pre-compile complex materials asynchronously without blocking the main React update thread.
3. **Baked Global Tinting & Lighing Extraction:** Replaced real-time WebGL shadow maps and infinite light rays with baked-in global textures (`apply_global_tint.js`), dropping the GPU compute overhead entirely while maintaining visual depth.
4. **DOM Mutation Bypassing:** Critical animation properties (like SVG preloader states tracking 130+ concurrent HTTP texture requests) write directly to the `ref.current.style`, intentionally bypassing React’s `setState` render cycles to conserve CPU.
5. **Adaptive Device Tiering:** Auto-detects `navigator.deviceMemory`, hardware concurrency, and viewport sizes to scale WebGL resolutions (`dpr`), antialiasing algorithms, and texture loading strictness on the fly.

---

## 🏗️ 3D Scene Architecture

```mermaid
graph TD;
    A[App.jsx] --> B[SceneProvider Context];
    A --> C[canvas];
    A --> D[2D DOM / SEO / HUD];
    
    C --> E[Experience.jsx];
    E --> F[RoomWarmup Pre-compiler];
    E --> G[Infinite Corridor Manager];
    
    G --> H[Gallery Room];
    G --> I[Studio Room];
    G --> J[Contact Room];
    G --> K[About Room];
    
    H -.-> L{useTexture & useGLTF};
    L -.-> M(GPU Memory);
```

---

## 🛠️ Local Development Setup

To run this application natively on your local machine:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ITomPoland/portfolio-itom.git
   cd portfolio-itom
   ```

2. **Install dependencies:**
   Make sure you are on Node.js v20+.
   ```bash
   npm install
   ```

3. **Start the local Dev Server:**
   ```bash
   npm run dev
   ```

> [!IMPORTANT]
> Since this project heavily utilizes `vite-plugin-compression` and hundreds of high-res textures, your initial local load might take a few seconds as the dev-server buffers asset delivery. For performance testing, always run `npm run build && npm run preview`.

## 🤝 Contributing & Feedback

All PRs improving the shader physics, 3D math logic, or component memoization runtimes are welcome. Please refer to our new `.github` Issue and Pull Request templates when submitting!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingRoom`)


## License

The code in this repository is licensed under the [MIT License](LICENSE). 
**Note:** All personal assets, 3D textures, images, and copywriting are copyright of Tomasz Szmajda and may not be reused or reproduced without explicit permission.
3. Commit your Changes (`git commit -m 'feat: Added realistic liquid simulation to Contact Room'`)
4. Push to the Branch (`git push origin feature/AmazingRoom`)
5. Open a Pull Request

---

*Designed and Developed by [Tomasz Szmajda (ITom Dev)](https://itomdev.com).*
