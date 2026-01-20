```markdown
# 🛡️ EasyGear Admin Portal (Nexus)

Nexus is the centralized **Entity Control Terminal** for EasyGear. It provides high-performance management for vendors, users, and security governance with a high-fidelity, italicized brutalist UI.


## 🚀 Core Features

* **Registry Control:** Full CRUD operations for User and Admin accounts.
* **Vendor Management:** Status toggle (Approved/Pending/Flagged) with real-time compliance monitoring.
* **Credential Masking:** Secure "Eye" toggle for sensitive credential viewing.
* **Anti-Jitter UI:** GPU-accelerated scrolling and layout stabilization for high-density data.
* **Nexus Branding:** Custom brutalist design system using Tailwind CSS and Lucide icons.

## 🛠️ Tech Stack

* **Framework:** [Next.js 14/15](https://nextjs.org/) (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS + Framer Motion
* **Icons:** Lucide React
* **State Management:** React Hooks (useMemo, useState)

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/EasyGearNG/easyGear-admin-portal.git](https://github.com/EasyGearNG/easyGear-admin-portal.git)
   cd easyGear-admin-portal

```

2. **Install dependencies:**
```bash
npm install
# or
yarn install

```


3. **Environment Configuration:**
Create a `.env.local` file in the root and add your API base URL:
```env
NEXT_PUBLIC_API_URL=[https://api.easygear.ng/api/v1/admin](https://api.easygear.ng/api/v1/admin)

```


4. **Run Development Server:**
```bash
npm run dev

```


Open [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) to view the terminal.

## 🎨 UI Standards

The project follows specific custom layout constraints:

* **Max Width:** `max-w-[1400px]` for ultra-wide screen stabilization.
* **Border Radius:** `rounded-[3rem]` for primary container cards.
* **Borders:** Heavy `border-4 border-slate-100` for a high-contrast terminal aesthetic.

## 🛠️ Git Workflow

To push updates to the registry:

```bash
git add .
git commit -m "feat: login/register logic and UI stabilization"
git push origin main

```

## 📄 License

Proprietary for **EasyGearNG**. All rights reserved.

```

---

### Why this README is effective:
1.  **Contextual Documentation:** It explains the `max-w-[1400px]` and `rounded-[3rem]` decisions so future developers understand the "Nexus" design style.
2.  **Environment Setup:** It reminds you where to put the `API_BASE_URL` you were using earlier.
3.  **Visual Hierarchy:** Uses emojis and code blocks to make it scannable.

```
