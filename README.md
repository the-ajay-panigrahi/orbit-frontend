# Orbit | Frontend

A modern developer networking and collaboration platform for tech founders, software engineers, and builders to discover peers, exchange connection requests, and message in real time.

---

## Live Deployment

- **Production URL:** [https://withorbit.tech/](https://withorbit.tech/)
- **API Base URL:** `https://withorbit.tech/api`

---

## Interface Walkthrough

### 1. Landing Experience (Caramellatte Theme)
Warm aesthetic landing page featuring the hero card deck, feature journey, and interactive theme preview studio.

![Landing Page - Caramellatte Theme](./screenshots/landing-caramellatte.png)

---

### 2. Dark Roast Experience (Coffee Theme)
Rich, high-contrast dark theme variant highlighting the adaptive design system across all UI elements.

![Landing Page - Coffee Theme](./screenshots/landing-coffee.png)

---

### 3. 35-Theme Dynamic Palette Engine
Instant theme switching powered by DaisyUI semantic tokens and Tailwind CSS v4, featuring a search filter and zero-flash `localStorage` persistence.

![35 Theme Dropdown Selector](./screenshots/theme-palette-dropdown.png)

---

### 4. Authentication Portal
Secure sign-in and account registration interface with real-time validation and HTTP-only session management.

![Sign In](./screenshots/signin-auth.png)

---

### 5. Discovery Deck & Builder Feed
Swipeable developer card stack with gesture controls (Pass / Connect), keyboard shortcuts, tag filtering, and 3D card zoom inspection.

![Discovery Feed](./screenshots/feed-discovery.png)

---

### 6. Developer Profile & Settings
Customizable developer profile editor for updating technical skills, GitHub credentials, professional bio, and account security.

![Profile Settings](./screenshots/profile-settings.png)

---

### 7. Membership Tiers & Pricing
Tiered membership plan presentation displaying Basic, Pro, and Premium quotas with transparent feature breakdowns.

![Pricing Plans](./screenshots/pricing-plans.png)

---

### 8. Razorpay Payment Modal
Integrated Razorpay checkout supporting Card, Netbanking, UPI, and Wallet payment methods with cryptographic signature verification.

![Razorpay Modal](./screenshots/razorpay-checkout-modal.png)

---

### 9. Active Connections Directory
Centralized directory of mutually accepted developer connections with direct links to real-time chat rooms.

![Connections List](./screenshots/connections-list.png)

---

### 10. Received Connection Requests
Two-way request inbox allowing users to review, accept, or reject incoming collaboration invitations with real-time state updates.

![Requests Review](./screenshots/requests-review.png)

---

## Technical Architecture

- **React 19 & Vite Build Optimization:** Utilizes React 19 concurrent features with a tuned Vite bundling pipeline for fast HMR and optimized chunking.
- **Normalized Global State Architecture:** Centralized Redux Toolkit store managing user session, discovery feed deck, active connections, and received requests.
- **Duplex WebSocket Stream Lifecycle:** Persistent Socket.IO connection handling automated reconnects, room joining, and network degradation fallback.
- **Virtualized Windowed List Rendering:** Powered by `react-virtuoso` with inverted bidirectional indexing (`START_INDEX = 10000`), recycling off-screen DOM nodes to preserve 60fps scrolling.
- **Hardware-Accelerated Motion Physics:** Gesture-driven swipe decks and 3D zoom modal choreography powered by `motion/react` utilizing composite-only GPU layers (`transform`, `opacity`).
- **Semantic CSS Token Engine:** Tailwind CSS v4 and DaisyUI v5 CSS custom properties mapped across 35 themes with zero-flash `localStorage` hydration.
- **Defensive Layout Constraints:** Rigid structural boundaries and CSS `line-clamp` rules preventing Cumulative Layout Shift (CLS) during asynchronous data loading.

---

## Key Engineering Challenges & Solutions

- **Eliminating Cumulative Layout Shift (CLS) on Dynamic Card Decks:** Fixed hero viewport constraints (`h-[520px] sm:h-[540px]`) and enforced CSS line clamping to eliminate layout shifts during async bio and badge hydration.
- **WebSocket Lifecycle Stabilization During React 19 State Updates:** Isolated socket connection hooks from ephemeral UI state by memoizing partner metadata in `useRef` containers, preventing abortive handshakes during re-renders.
- **Native WebSocket Handshake Race Avoidance:** Configured client transport array to `['websocket', 'polling']`, bypassing intermediary HTTP long-polling probe latency and eliminating premature connection termination.
- **DOM Recycling for High-Density Real-Time Chat Feeds:** Replaced unbounded lists with virtualized windowed rendering, maintaining active DOM node counts under 30 elements regardless of conversation depth.
- **Zero-Flash Theme Hydration:** Injected theme state from `localStorage` directly onto document root (`data-theme`) prior to component mount to prevent unstyled layout flashes.
- **Cryptographic Payment Gateway Synchronization:** Handled client-side Razorpay modal dismissals and async payment webhook callbacks with optimistic UI updates paired with server verification polling.

---

## Production Deployment & Multi-Cloud Portability

- **Self-Hosted Production Setup:** Deployed on an **AWS EC2 (Ubuntu)** instance served by **Nginx** with Single Page Application routing (`try_files $uri $uri/ /index.html;`), fronted by **Cloudflare** for edge SSL/TLS encryption, caching, and DDoS mitigation.
- **Cloud-Agnostic Portability:** The frontend is completely decoupled from cloud-specific dependencies. While operated on AWS EC2 for production testing, the static output is architected to deploy seamlessly to **Vercel**, **AWS CloudFront/S3**, or **Netlify** for cost-efficient compute governance.

---

## Tech Stack

- **UI Library:** React 19
- **Build Tool:** Vite
- **State Management:** Redux Toolkit, React-Redux
- **Styling & Theming:** Tailwind CSS v4, DaisyUI v5 (35 Themes)
- **Animation & Gestures:** Motion v13
- **Icons:** Lucide React
- **Real-Time Client:** Socket.IO Client
- **Virtualization:** React Virtuoso
- **HTTP Client:** Axios
- **Payment Gateway:** Razorpay Standard Checkout SDK

---

## Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/the-ajay-panigrahi/orbit-frontend.git
cd orbit-frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
```

---

## Author

**Ajay Panigrahi**
- Website: [https://withorbit.tech](https://withorbit.tech)
- GitHub: [@the-ajay-panigrahi](https://github.com/the-ajay-panigrahi)
- LinkedIn: [Ajay Panigrahi](https://www.linkedin.com/in/ajay-panigrahi/)
