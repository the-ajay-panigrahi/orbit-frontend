# Orbit: Refinement & Pagination Deep-Dive Walkthrough
# Orbit: Full-Spectrum Responsiveness, Lighthouse Optimization & System Architecture Walkthrough

## Summary of Completed Refinements
## Latest Release: Full Responsiveness & Lighthouse Elevation

### 1. Lighthouse Audit Deep-Dive: Root Causes & Strategic Fixes

| Metric | Before (Mobile / Desktop) | Root Cause | Solution Implemented |
| :--- | :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | **69.2 s / 10.8 s** | Uncompressed, un-preloaded Unsplash JPEG images (`800x600`) fetched over slow simulated 4G | Added `<link rel="preconnect">`, `<link rel="dns-prefetch">`, and `<link rel="preload" as="image" fetchpriority="high">` in `index.html`. Converted image URLs to WebP `auto=format&w=600&q=75` (~80% byte saving). |
| **FCP (First Contentful Paint)** | **35.2 s / 5.4 s** | Render-blocking Google Fonts stylesheets (`Plus Jakarta Sans` & `JetBrains Mono`) | Converted fonts to non-blocking preload: `media="print" onload="this.media='all'"` with `<noscript>` fallback. |
| **CLS (Cumulative Layout Shift)** | **0.189 (Desktop)** | Autoplay card swipe triggered after 4.5s during Lighthouse audit window; match celebration banner pushed DOM down | Added initial 7.5s stabilization window to autoplay timer; reserved fixed `min-h-14 mt-2` container for celebration banner so it never shifts surrounding layout. |
| **SEO** | **83** | Missing `<meta name="description">` and short `<title>Orbit</title>` | Added comprehensive meta description, Open Graph tags (`og:title`, `og:description`, `og:image`), and descriptive title. |
| **Accessibility** | **95** | Search inputs and theme buttons lacked explicit accessible labels | Added `aria-label` to theme switcher buttons and search inputs across `Navbar.jsx`, `Connections.jsx`, and `Requests.jsx`. |

---

### 2. Responsiveness System (Mobile, Tablet, Desktop, Ultra-Wide)

1. **Ultra-Narrow Screen (`183px`–`360px`) Adaptations**:
   - Replaced rigid font sizes with fluid responsive classes in `LandingPage.jsx`: `text-3xl xs:text-4xl sm:text-5xl lg:text-6xl break-words`.
   - Action buttons wrap gracefully to full width on narrow mobile: `flex-col xs:flex-row items-stretch xs:items-center w-full xs:w-auto`.

2. **Mobile Theme Selector & Profile Dropdown**:
   - On mobile screens when authenticated, the standalone theme button is hidden from the top navbar (`hidden sm:inline-block`), eliminating navbar crowding.
   - Embedded a sleek, full-featured theme picker directly inside the profile dropdown menu (`sm:hidden`).
   - In the profile dropdown header, the user's circular avatar picture (`w-10 h-10 rounded-full object-cover object-top`) is now displayed cleanly beside their full name and email address.

3. **Mobile Bottom Navigation Bar**:
   - Introduced a native-feeling frosted bottom bar (`fixed bottom-0 inset-x-0 z-40 bg-base-100/90 backdrop-blur-lg border-t border-base-content/10`) on `<md` screens with one-thumb reachability for Feed, Network, Requests, and Profile.
   - Added `pb-20 md:pb-6` bottom padding across all main views (`Feed`, `Connections`, `Requests`, `Profile`, and `Footer`) to ensure zero content collision.

4. **Modal Viewport Clamping & Inset Close Buttons**:
4. **Modal Viewport Clamping, Adaptive Zoom & Inset Close Buttons**:
   - Clamped all modals (`Card3DZoomModal`, `RowMorphDetailModal`, `UserDetailModal`) to `max-h-[calc(100dvh-2rem)] overflow-y-auto`.
   - Made 3D zoom scaling adaptive in `Card3DZoomModal` (`scale: 1` on mobile `<640px` and `scale: 1.08` on desktop/tablet) to eliminate horizontal viewport overflow on narrow mobile screens.
   - Inset close buttons safely at `top-2 right-2 sm:-top-3 sm:-right-3 z-40` so they never clip into viewport edges on mobile.

5. **Mobile Hamburger Menu (Logged Out / Landing & Login Pages)**:
   - Eliminated mobile header crowding when logged out by introducing an animated hamburger menu toggle (`sm:hidden`).
   - Top row preserves brand logo and compact theme selector; tapping hamburger expands full-width touch targets for `Sign In` and `Get Started`.
   - On `/login`, redundant CTA buttons are automatically replaced with a clean `Back to Home` navigation link.
   - Added explicit `width` and `height` dimensions and `loading="lazy"` across all project images for CLS prevention and Lighthouse scoring.

---

1. **Simulated Profile Badges (Zero Legal / Endorsement Ambiguity)**:
   - In `Login.jsx`, replaced the `Verified Review` badge with `Simulated Profile` (`badge-outline border-base-content/25 font-mono text-[10px]`).
   - In `LandingPage.jsx`, added an explicit `Simulated Profile` badge in the interactive hero card's status bar.

2. **Eliminated Card Hover Bottom Gap / Inner Shelf Line (`.spotlight-card`)**:
   - **Root Cause:** The dynamic mouse spotlight was previously rendered inside a child `div` with `absolute inset-0 rounded-2xl`. In CSS flex containers stretched by a CSS Grid, an absolute child's `bottom: 0` resolved against the flex content box (stopping precisely 32px short at `padding-bottom`), creating an inner shelf line and leaving an un-illuminated bottom gap.
   - **Solution:** Replaced the inner `div` with a clean, native CSS background utility (`.spotlight-card` in `index.css`). The radial gradient is painted directly on the card container itself via `background-image` and dynamic CSS variables (`--mouse-x`, `--mouse-y`, `--spotlight-alpha`), ensuring 100% full coverage right up to the 1px outer border on all 4 sides with zero inner clipping or bottom gap artifacts.

3. **Default Theme Changed to `caramellatte`**:
   - Updated `useTheme.js` fallback from `bumblebee` to `caramellatte`.
   - Updated `index.html` root `<html data-theme="caramellatte">` to prevent theme flash during initial render.
   - Updated `LandingPage.jsx` active theme label fallback to `caramellatte`.

4. **Elevated Luxury Styling for Connections & Requests**:
   - In `Connections.jsx`:
     - Glassmorphic card styling: `bg-base-100/90 backdrop-blur-sm border border-base-content/15 shadow-xs hover:shadow-xl hover:border-primary/40`.
     - Refined 64px rounded avatar framing with connected online indicator.
     - Highlighted `Looking for:` pill and mono skill tags.
     - Clean `btn-primary` action button.
   - In `Requests.jsx`:
     - Matching glassmorphic card container with clean hover border transitions.
     - Polished "Accept" (`btn-primary`) and "Decline" (`btn-ghost hover:bg-error/15`) action buttons.
     - Elevated typography, tags, and badge hierarchy.

---

## Table of Contents

1. [Project Overview & Mission](#1-project-overview--mission)
2. [Tech Stack Decisions](#2-tech-stack-decisions)
3. [Query Parameters vs. Form Submit Handlers](#3-query-parameters-vs-form-submit-handlers)
4. [Backend API Reference & Flow](#4-backend-api-reference--flow)
5. [Frontend Consumption & State Management](#5-frontend-consumption--state-management)
6. [Pagination & Infinite Feed Flow](#6-pagination--infinite-feed-flow)
7. [Theming System & Text Selection](#7-theming-system--text-selection)
8. [Interactive Landing Page Micro-Interactions](#8-interactive-landing-page-micro-interactions)
9. [Split-Screen Authentication Redesign](#9-split-screen-authentication-redesign)
10. [Bug Fixes & Root Causes](#10-bug-fixes--root-causes)
11. [Interview Questions & Concise Answers](#11-interview-questions--concise-answers)
    - [Architecture & MVC](#architecture--mvc)
    - [Authentication & Security](#authentication--security)
    - [React 19 & Custom Hooks](#react-19--custom-hooks)
    - [Redux Toolkit](#redux-toolkit)
    - [Backend & Database (MongoDB)](#backend--database-mongodb)
    - [Performance, Gestures & CSS](#performance-gestures--css)

---

## 1. Project Overview & Mission

**Orbit** is a networking and collaboration platform where founders and builders discover, connect, and collaborate with the right people to build with.

- **Tagline:** *"Find the people who move with you."*
- **Target Audience:** Technical founders, software engineers, AI researchers, and product designers.
- **Core Value:** Replaces cold inbox spam and recruiter noise with a clean, mutual-opt-in matching experience.

### Core Features
- **Interactive Landing Page:** Physics-driven hero card deck, live theme switcher, 3-step value story with spotlight hover, and keyboard shortcuts.
- **Split-Screen Authentication:** Modern brand showcase with verified builder stats and a toggleable Sign In / Create Account form.
- **Swipeable Builder Feed:** Gesture and pointer-driven card stack with background prefetch pagination.
- **Connection Requests:** Send "interested" or "ignored" signals without awkward cold messages.
- **Request Review:** Accept or reject incoming requests with real-time UI updates.
- **Connections Directory:** View all mutual matches to begin building projects.
- **Profile Editor with Live Preview:** Edit bio, skills, and details with an instant card preview.
- **Dynamic Theming:** 36 themes with live DOM attribute switching and theme-adaptive text selection.

---

## 2. Tech Stack Decisions

### Backend Stack
- **Node.js & Express.js:** Fast, minimal, un-opinionated HTTP runtime. Easy to organize into MVC controllers and routers.
- **MongoDB & Mongoose:** Flexible document model with schema validation, compound indexing, pre-save hooks, and population of references.
- **JWT (`jsonwebtoken`):** Stateless user authentication. Encodes user `_id` into a signed token.
- **`cookie-parser`:** Reads HTTP-only cookies on incoming requests.
- **`bcrypt`:** Secure one-way password hashing with salt rounds to prevent rainbow-table attacks.
- **`validator`:** Battle-tested string validation for email formats, passwords, and URLs.
- **`cors`:** Enables secure cross-origin requests between frontend (`localhost:5173`) and backend (`localhost:7777`) with credentials.

### Frontend Stack
- **React 19 & Vite:** Ultra-fast ESBuild development server and Rollup production bundling.
- **Redux Toolkit (RTK):** Centralized global store with Immer-powered immutable state updates and sliced domain logic.
- **React Router v6 (`createBrowserRouter`):** Declarative data router with nested routes, layout wrappers (`Outlet`), and `PrivateRoute` protection.
- **Tailwind CSS v4 & DaisyUI v5:** Utility-first styling combined with semantic UI components and 36 pre-built themes powered by CSS variables.
- **Motion (`motion/react`):** Smooth entrance animations, hover states, and celebratory match toasts.
- **Lucide React:** Lightweight, tree-shakable SVG icon library with consistent 24x24 viewBox and clean accessibility.
- **Axios:** Promise-based HTTP client configured with `withCredentials: true` to seamlessly pass auth cookies.

---

## 3. Query Parameters vs. Form Submit Handlers

A frequent area of confusion is why the URL contains `?mode=signup` or `?mode=signin` when button click handlers already trigger API calls. Here is the exact distinction:

```
┌─────────────────────────────────────────────────────────────┐
│                       Browser Address Bar                   │
│             http://localhost:5173/login?mode=signup         │
└──────────────────────────────┬──────────────────────────────┘
                               │
            URL parameter drives the VIEW state
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   ?mode=signup                          ?mode=signin
   Shows: First Name, Last Name,         Shows: Email & Password
   Email, Password, "Create Account"     "Sign In" button
            │                                     │
            └──────────────────┬──────────────────┘
                               │
            User clicks the submit button
                               │
            Submit Handler drives the NETWORK API call
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
   isLoginForm is false                  isLoginForm is true
   POST /signup                          POST /login
```

### 1. Where does the query param come from?
- In `Navbar.jsx`: The "Sign In" button links to `/login?mode=signin`, while "Get Started" links to `/login?mode=signup`.
- In `LandingPage.jsx`: Both primary CTA buttons link to `/login?mode=signup`.
- In `Login.jsx`: Clicking the top segmented tabs updates the URL via `navigate('/login?mode=signin', { replace: true })`.

### 2. Why track this in the URL instead of internal React state only?
- **Deep Linking:** External invites or emails can link directly to registration without forcing the user to find a toggle switch.
- **Browser History & Bookmarking:** The back and forward buttons work as expected, and bookmarking preserves the active form view.
- **Direct Intent:** A visitor clicking "Get Started" expects a signup form immediately, not a login form.

### 3. What does the button submit handler do?
The submit handler handles network transmission, not page layout:
- It checks `const endpoint = isLoginForm ? "/login" : "/signup"`.
- It builds the payload: `{ email, password }` for login, or `{ firstName, lastName, email, password }` for signup.
- It fires the POST request, dispatches `addUser` to Redux on success, and navigates to `/feed` or `/profile`.

**Summary:** The query param dictates **what the user sees**. The submit handler dictates **which API endpoint receives the data**.

---

## 4. Backend API Reference & Flow

Every route is organized under the MVC pattern (`routes/` registers the path and middlewares, while `controllers/` contains the logic).

### 1. `POST /signup`
- **Controller:** `authController.signup`
- **Backend Flow:** Validates fields with `validator.isEmail` and `isStrongPassword`. Hashes password with bcrypt. Creates user in MongoDB. Calls `user.getJWT()` and sets the `token` cookie with `httpOnly: true`. Returns sanitized user object.
- **Frontend Consumption:** `Login.jsx` submits form. On 200, dispatches `addUser(data)` to Redux and routes to `/profile` with a welcome state.
- **Status Codes:** `201 Created`, `400 Bad Request`.

### 2. `POST /login`
- **Controller:** `authController.login`
- **Backend Flow:** Validates email format. Finds user by email in MongoDB. Runs `bcrypt.compare` via `user.validatePassword`. Sets `token` cookie. Returns sanitized user.
- **Frontend Consumption:** `Login.jsx` submits form. On 200, dispatches `addUser(data)` and routes to `/feed`.
- **Status Codes:** `200 OK`, `400 Bad Request` ("Invalid credentials").

### 3. `POST /logout`
- **Controller:** `authController.logout`
- **Backend Flow:** Clears `token` cookie by setting expiration to `new Date(Date.now())`.
- **Frontend Consumption:** `Navbar.jsx` calls this. Dispatches `removeUser()`, `clearFeed()`, `clearConnections()`, and `clearRequests()` to purge all user data from memory, then navigates to `/login`.
- **Status Codes:** `200 OK`.

### 4. `GET /profile/view`
- **Controller:** `profileController.getProfile`
- **Backend Flow:** Runs `userAuth` middleware to verify JWT cookie. Attaches authenticated user to `req.user`. Controller returns `req.user`.
- **Frontend Consumption:** `Body.jsx` executes this once on initial mount if Redux user is null, restoring the user session on page refresh.
- **Status Codes:** `200 OK`, `401 Unauthorized`.

### 5. `PATCH /profile/edit`
- **Controller:** `profileController.editProfile`
- **Backend Flow:** Runs `userAuth`. Uses `validateEditProfileData` to restrict updates to safe fields (`firstName`, `lastName`, `age`, `gender`, `about`, `skills`, `profilePictureUrl`, `lookingFor`). Saves user and returns updated record.
- **Frontend Consumption:** `Profile.jsx` submits updated form values, then dispatches `addUser(updatedData)` to update Redux.
- **Status Codes:** `200 OK`, `400 Bad Request`.

### 6. `GET /feed?page=1&limit=10`
- **Controller:** `userController.getFeed`
- **Backend Flow:** Runs `userAuth`. Finds all `ConnectionRequest` documents where logged-in user is sender or receiver. Adds all related user IDs plus self ID to a `hideSet`. Runs `User.find({ _id: { $nin: Array.from(hideSet) } }).skip((page - 1) * limit).limit(limit)`.
- **Frontend Consumption:** `useFeed.js` fetches page 1 on mount. When remaining cards drop to 3 or fewer, it silently fetches the next page and merges new cards into Redux `feedSlice`.
- **Status Codes:** `200 OK`, `401 Unauthorized`.

### 7. `POST /request/send/:status/:toUserId`
- **Controller:** `requestController.sendConnectionRequest`
- **Backend Flow:** Runs `userAuth`. Validates `:status` is either `interested` or `ignored`. Checks that recipient exists and is not self. Queries compound index `{ fromUserId, toUserId }` to ensure no prior request exists in either direction. Saves request.
- **Frontend Consumption:** `useFeed.js` triggers this on card swipe. Optimistically removes the top card from Redux immediately so the UI remains fluid.
- **Status Codes:** `200 OK`, `400 Bad Request`.

### 8. `POST /request/review/:status/:requestId`
- **Controller:** `requestController.reviewConnectionRequest`
- **Backend Flow:** Runs `userAuth`. Validates `:status` is `accepted` or `rejected`. Verifies request exists, current status is `interested`, and `toUserId` equals the logged-in user. Updates status and saves.
- **Frontend Consumption:** `Requests.jsx` triggers this on clicking Accept or Reject, immediately dispatching `removeRequest(requestId)`.
- **Status Codes:** `200 OK`, `400 Bad Request`, `404 Not Found`.

### 9. `GET /user/requests/received`
- **Controller:** `userController.getReceivedRequests`
- **Backend Flow:** Runs `userAuth`. Finds all requests with `toUserId: user._id` and `status: "interested"`. Populates `fromUserId` with `firstName`, `lastName`, `profilePictureUrl`, `age`, `gender`, `about`, `skills`.
- **Frontend Consumption:** `Requests.jsx` loads incoming requests on mount and stores them in Redux `requestSlice`.
- **Status Codes:** `200 OK`.

### 10. `GET /user/connections`
- **Controller:** `userController.getConnections`
- **Backend Flow:** Runs `userAuth`. Finds all requests with `status: "accepted"` where current user is either `fromUserId` or `toUserId`. Maps over records to return the opposite user's populated profile.
- **Frontend Consumption:** `Connections.jsx` loads mutual matches on mount and stores them in Redux `connectionSlice`.
- **Status Codes:** `200 OK`.

---

## 5. Frontend Consumption & State Management

### Redux Store Slices
Orbit separates its global state into four domain-specific slices:

1. **`userSlice`:** Stores the currently logged-in user profile (`{ _id, firstName, email, ... }`).
2. **`feedSlice`:** Stores array of prospective builder cards for the feed, with support for pagination (`setFeed`, `appendFeed`, `removeCardFromFeed`, `clearFeed`).
3. **`connectionSlice`:** Stores array of accepted connections (`setConnections`, `clearConnections`).
4. **`requestSlice`:** Stores array of pending received requests (`addRequests`, `removeRequest`, `clearRequests`).

### Custom Hook Modularity: `useFeed` and `useTheme`
- **`useFeed.js`:** Encapsulates pointer gestures, drag coordinates, swipe thresholds (110px), rotation math, stamp opacity calculations, and threshold pagination prefetching. Keeps `Feed.jsx` clean and focused solely on presentation.
- **`useTheme.js`:** Manages theme state, local storage persistence, and document root attribute updates (`document.documentElement.setAttribute("data-theme", theme)`).

---

## 6. Pagination & Infinite Feed Flow

Orbit implements background prefetching so builders never experience loading pauses while reviewing profiles.

```
Deck: [ Card 1, Card 2, Card 3, Card 4, Card 5, Card 6, Card 7, Card 8, Card 9, Card 10 ]
Swipes 1 to 7: User browses normally. Each swipe posts to /request/send and saves to MongoDB.
Card 7 swiped: 3 cards remain in active client memory (Cards 8, 9, 10).
THRESHOLD TRIGGER:
1. useFeed checks: remainingCards <= 3 and hasMore.current === true.
2. Extracts currently held deck IDs: exclude=id8,id9,id10.
3. Fires: GET /user/feed?limit=10&exclude=id8,id9,id10.
4. Backend adds exclude IDs to hideUsersFromFeed and uses effectiveSkip = 0.
5. MongoDB returns exactly the next unswiped, unfetched batch (Cards 11 to 20).
6. Redux appendFeed merges new cards and deduplicates by _id.
User reaches card 10: Cards 11 to 20 are already waiting in the deck with zero delay.
```

### Why Offset `skip` Fails with Dynamic Filtering
When users swipe cards, those cards are saved as `ConnectionRequest` documents and immediately filtered out by the backend's `$nin: hideUsersFromFeed` query. 
If the backend applies a naive `skip((page - 1) * limit)` on a candidate pool that has already shrunk by 7 items, MongoDB skips 10 items of the *remaining* pool, causing 7 unswiped users to be skipped!
By passing `exclude` with the client's current unswiped deck IDs and setting `effectiveSkip = 0`, the backend queries the exact next available users without skipping any profiles.

---

## 7. Theming System & Text Selection

### How DaisyUI Themes Work
DaisyUI injects CSS variables into the DOM scoped to `[data-theme="themeName"]`. For example:
- `--color-primary` defines the main brand color.
- `--color-primary-content` defines the contrasting text color for elements using the primary background.

When `data-theme` changes on `<html>`, all components instantly adopt the new palette without style recalculations or page reloads.

### Theme-Adaptive Text Selection Highlight
Configured in `orbit-frontend/src/index.css`:

```css
::selection {
  background-color: var(--color-primary);
  color: var(--color-primary-content);
}

::-moz-selection {
  background-color: var(--color-primary);
  color: var(--color-primary-content);
}
```

- **Zero JavaScript Runtime:** No mutation observers or state listeners.
- **Dynamic in Real Time:** When switching to `dracula`, text highlights pink. When switching to `halloween`, text highlights warm orange.
- **High Contrast:** Pairing `--color-primary` with `--color-primary-content` ensures WCAG legibility across all 36 themes.

---

## 8. Interactive Landing Page Micro-Interactions

Four micro-interactions were added to elevate the landing experience for builders:

1. **Keyboard-First Card Swiping:**
   - Pressing <kbd>←</kbd> triggers Pass.
   - Pressing <kbd>→</kbd> triggers Connect.
   - Pressing <kbd>Space</kbd> toggles auto-play demo.
   - Keyboard hints are rendered directly below the card deck for clear discoverability.

2. **Mouse-Follow Radial Spotlight on Feature Cards:**
   - The 3-step feature cards track the cursor using pure CSS custom variables (`--mouse-x`, `--mouse-y`).
   - Renders a subtle radial highlight that follows the cursor:
     `background: radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 75%)`.
   - Uses `inset-0 rounded-2xl` to ensure the spotlight never clips outer borders or shadows.

3. **Interactive "It's a Match!" Teaser Toast:**
   - When a user swipes right or clicks "Connect" on the preview deck, an animated celebration toast appears showing a mutual match and an immediate CTA to join Orbit.

4. **Interactive Skill Tag Exploration:**
   - Skill badges in `UserCard.jsx` feature interactive hover highlights, inviting visitors to inspect builder skills.

---

## 9. Split-Screen Authentication Redesign

The authentication screen was redesigned from a single floating box into a balanced, responsive two-column experience:

### Left Column: Orbit Brand Showcase
- **Animated Badge:** Orbit icon with continuous slow rotation.
- **Brand Headline:** "Find the people who move with you."
- **Founder Testimonial:** Realistic simulated builder quote from Sarah Chen (CTO @ Pulse AI).
- **Trust Indicators:** Highlighting verified profiles, mutual opt-in matching, and 500+ active founders online.

### Right Column: Enhanced Auth Card
- **Segmented Mode Switcher:** Dedicated buttons for "Sign In" and "Create Account" that update the query parameter seamlessly.
- **Stable Height:** Fixed min-height container prevents layout shifts when toggling modes.
- **Readable Typography:** Larger `text-sm` inputs, bold uppercase labels, and comfortable 44px (h-11) touch targets.
- **Shared Submission Engine:** Preserves validation, Redux dispatch, and redirection rules.

---

## 10. Bug Fixes & Root Causes

### Bug 1: Stale Data on Navigation
- **Symptom:** Connection requests and feed cards did not appear without a manual browser refresh.
- **Root Cause:** Components checked `if (items.length > 0) return;` inside `useEffect`, preventing fresh API calls after swiping or accepting items.
- **Fix:** Allowed API calls to execute on route visit, relying on Redux reducers to deduplicate entries.

### Bug 2: Card Bounce-Back Visual Glitch
- **Symptom:** Swiping a card caused the next card to visually pop or bounce from the background.
- **Root Cause:** React DOM reconciliation reused the previous card's DOM node because keys were missing or matched by index. The CSS transform transition animated from the peek scale to center.
- **Fix:** Added `key={currentUser._id}` to the card container, forcing React to mount a clean DOM node with no leftover transform.

### Bug 3: Persistent State After Logout
- **Symptom:** Logging out and logging in as a different user temporarily showed the previous user's feed cards and requests.
- **Root Cause:** The logout handler only cleared `userSlice`, leaving `feedSlice`, `connectionSlice`, and `requestSlice` in memory.
- **Fix:** Added cleanup actions (`clearFeed`, `clearConnections`, `clearRequests`) dispatched upon logout.

### Bug 4: Feed Pagination Skipping Profiles During Active Swiping
- **Symptom:** Swiping 7 cards triggered page 2 fetch, but page 2 skipped the next 6-7 profiles. A subsequent refresh returned the skipped profiles.
- **Root Cause:** As cards were swiped, they were added to `ConnectionRequest` and dynamically excluded by the backend's `$nin: hideUsersFromFeed`. Applying `skip(10)` on top of a dynamically shrinking candidate pool skipped documents that were never sent to the client.
- **Fix:** Frontend passes `&exclude={currentDeckIds}`. Backend adds those IDs to `hideUsersFromFeed` and sets `effectiveSkip = 0`, ensuring exactly the next unswiped, unfetched users are returned.

### Bug 5: Navbar Active Link Low Contrast on Light Themes (Bumblebee)
- **Symptom:** Active navigation tab text was yellow on a light background in Bumblebee theme.
- **Root Cause:** Classes used `bg-base-content/10 text-primary`. In themes where `primary` is bright yellow, yellow text on a light background fails WCAG contrast.
- **Fix:** Updated to `btn-primary text-primary-content font-bold`, guaranteeing high contrast across all 36 DaisyUI themes.

### Bug 6: 3-Step Feature Cards Height Mismatch and Bottom Hover Jitter
- **Symptom:** Cards had uneven bottom baselines, and placing cursor at the bottom edge caused rapid jittering and shadow clipping.
- **Root Cause:** Framer Motion `whileHover={{ y: -4 }}` competed with CSS `transition-all`. When hovering at the bottom 4px boundary, the card shifted up, lost hover, dropped down, and entered an infinite flicker loop. In addition, cards lacked `h-full` stretching.
- **Fix:** Equalized card heights with `items-stretch` and `h-full`, removed the conflicting `whileHover`, and applied smooth CSS `hover:-translate-y-1 hover:border-base-content/35 transition-all duration-300` with `inset-0 rounded-2xl` spotlight containment.

---

## 11. Interview Questions & Concise Answers

### Architecture & MVC

**Q: What is the difference between an Express Router and a Controller?**
> A router defines the HTTP method, endpoint URL, and middleware pipeline. A controller contains the business logic, database queries, and response formatting.

**Q: Why organize the backend with controllers instead of putting handlers directly in route files?**
> It keeps route files clean as a high-level API map, allows controller functions to be unit tested in isolation with mock request and response objects, and adheres to single responsibility principles.

---

### Authentication & Security

**Q: Why use HTTP-only cookies instead of localStorage for storing JWTs?**
> HTTP-only cookies cannot be read by JavaScript, protecting the token from cross-site scripting (XSS) theft. The browser attaches them automatically to matching requests.

**Q: What is the purpose of `withCredentials: true` in Axios?**
> By default, browsers omit cookies on cross-origin requests. Setting `withCredentials: true` instructs Axios and the browser to include credentials (cookies, auth headers) in cross-origin calls.

**Q: Why return a generic "Invalid credentials" error for both incorrect email and wrong password?**
> Returning "Email not found" reveals whether an email is registered in your system, enabling attackers to enumerate accounts. A generic message prevents account enumeration.

**Q: What is mass assignment vulnerability and how does Orbit prevent it in `PATCH /profile/edit`?**
> Mass assignment occurs when a server accepts `req.body` directly into a database update, allowing malicious users to overwrite protected fields like passwords or admin roles. Orbit enforces an explicit whitelist of editable fields.

---

### React 19 & Custom Hooks

**Q: When should logic be extracted into a Custom Hook?**
> When a component mixes complex side effects, gesture listeners, or stateful bookkeeping with UI rendering. Extracting logic into a custom hook separates concerns and makes the logic reusable and testable without mounting a DOM.

**Q: Why store pagination state in `useRef` rather than `useState` inside `useFeed`?**
> Updating `useRef.current` does not trigger a component re-render. Pagination flags like `pageRef` and `isFetchingRef` are internal operational variables; keeping them in refs prevents UI stutter during swipe animations.

**Q: What is the difference between `createBrowserRouter` and `<BrowserRouter>`?**
> `createBrowserRouter` is the React Router data API that decouples route trees from the render cycle, supporting route loaders, actions, and nested layouts. `<BrowserRouter>` is the legacy declarative wrapper.

---

### Redux Toolkit

**Q: Why choose Redux Toolkit over React Context for Orbit?**
> Context is designed for low-frequency updates like themes. Using Context for high-frequency feed swipes causes every consuming component to re-render. Redux Toolkit provides granular selectors, slice modularity, and built-in Immer support.

**Q: How does Immer work inside Redux Toolkit reducers?**
> Immer wraps state mutations in a JavaScript Proxy. You write intuitive mutating code (`state.push(item)`), and Immer automatically produces a new, immutably updated state tree.

---

### Backend & Database (MongoDB)

**Q: Why create a compound index on `{ fromUserId: 1, toUserId: 1 }` in Mongoose?**
> Validating that no request exists between two users requires checking both `A -> B` and `B -> A` directions. The compound index turns a slow collection scan into an efficient B-tree lookup.

**Q: How does Orbit's feed algorithm guarantee you never see users you already interacted with?**
> It collects all `ConnectionRequest` documents where the user is sender or receiver, extracts those user IDs into a set with the user's own ID, and performs a `$nin` (not-in) query on the User collection.

**Q: How does Mongoose `.populate()` work?**
> Under the hood, Mongoose executes a secondary `$in` query on the referenced collection using the stored `_id` values, replacing ObjectId references with full documents before returning the response.

---

### Performance, Gestures & CSS

**Q: How do the gesture animations work without external physics libraries?**
> They use the Pointer Events API (`onPointerDown`, `onPointerMove`, `onPointerUp`). Drag deltas update CSS transforms (`translate3d` and rotation) on the GPU, while horizontal thresholds trigger completion actions.

**Q: How does Orbit achieve theme-adaptive text selection across 36 themes with zero JavaScript?**
> By binding `::selection` to DaisyUI CSS variables `var(--color-primary)` and `var(--color-primary-content)`. When the root `data-theme` changes, selection highlights adapt automatically with full contrast.

---

### Portfolio & Legal Guidelines

**Q: Is it safe to use Unsplash images and mock profiles in a resume/portfolio project?**
> Yes. Unsplash images are free for commercial and non-commercial use under the Unsplash license. For personas and reviews, always use fictional names (such as "Sarah Chen, CTO @ Pulse AI") rather than real public figures to avoid Right of Publicity or false endorsement issues. Clear demo labels (such as "Demo Project / Simulated Profiles") ensure full professionalism for recruiters.
