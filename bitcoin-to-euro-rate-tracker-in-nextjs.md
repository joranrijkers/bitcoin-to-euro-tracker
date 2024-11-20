# Bitcoin-to-Euro Rate Tracker in Next.js

## Features
1. **Current BTC/EUR Rate Display**:
   - Show the latest Bitcoin-to-Euro conversion rate on the main page.
   - Update every 10 seconds using a real-time API.

2. **24-Hour Historical Rate Chart**:
   - A dynamic line chart displaying rates for the past 24 hours.
   - Data stored and fetched from a SQLite database.

3. **Data Persistence**:
   - Save fetched rates in a SQLite database with timestamps for historical tracking.

4. **Backend API**:
   - An endpoint to fetch real-time rates and store them.
   - An endpoint to retrieve 24-hour historical rates.

5. **Tailwind CSS Styling**:
   - Ensure the UI is styled cleanly using Tailwind CSS.

6. **TypeScript Integration**:
   - All code is written using TypeScript.

7. **Linting with ESLint**:
   - Ensure code quality using ESLint configurations.

---

## Updated Step-by-Step Plan

### 1. **Verify Existing Setup**
Your project already has:
- **TypeScript**, **ESLint**, **Tailwind CSS**, and **App Router** configured.
- The default directory structure (no `src/` directory).
- Path: `C:\Users\Joran Rijkers\SynologyDrive\Projecten\bitcoin-to-euro-tracker`.

Navigate to the project directory:
```bash
cd "C:\Users\Joran Rijkers\SynologyDrive\Projecten\bitcoin-to-euro-tracker"
```

---

### 2. **Install Required Packages**
Install dependencies using TypeScript-compatible packages:
```bash
npm install axios sqlite3 chart.js react-chartjs-2
npm install --save-dev @types/sqlite3 @types/chart.js
```
- **Axios**: For API requests.
- **SQLite3**: For database operations.
- **Chart.js + React Chart.js**: For the historical rate chart.

---

### 3. **Set Up SQLite Database**
1. Create a file `db.ts` in the root of your project.
2. Configure it to:
   - Connect to a SQLite database file (`btc-eur.db`).
   - Create a table named `rates` with columns:
     - `id` (Primary Key): Auto-increment integer.
     - `timestamp`: A datetime field.
     - `rate`: Real number.

---

### 4. **Create API Routes**
1. **Real-Time Rate API**:
   - Add an API route (`/api/fetch-rate`) to:
     - Fetch the current Bitcoin-to-Euro rate from an external API (e.g., Coindesk).
     - Save the rate and timestamp in the SQLite database.

2. **Historical Data API**:
   - Add another API route (`/api/historical-rates`) to:
     - Retrieve the last 24 hours of data from the SQLite database.
     - Return data in JSON format for the frontend.

---

### 5. **Build Frontend Components**
1. **Current Rate Display**:
   - Create a TypeScript React component to:
     - Fetch the current rate from the real-time API.
     - Display the rate prominently on the page.
     - Auto-refresh every 10 seconds.

2. **24-Hour Rate Chart**:
   - Create another TypeScript React component to:
     - Fetch 24-hour historical data from the historical API.
     - Use Chart.js to render a line chart with timestamps on the X-axis and rates on the Y-axis.
     - Update dynamically when new data is available.

---

### 6. **Integrate Tailwind CSS**
1. Use Tailwind CSS to style the app with:
   - A clean layout for the current rate display and chart.
   - Responsiveness for mobile and desktop views.

---

### 7. **Automate Data Collection**
1. Ensure the real-time API:
   - Periodically fetches Bitcoin rates every 10 seconds.
   - Stores them in the SQLite database automatically.
2. Use server-side capabilities in Next.js to handle periodic updates.

---

### 8. **Test the Application**
1. Run the development server:
   ```bash
   npm run dev
   ```
2. Test the following:
   - The current rate updates correctly every 10 seconds.
   - The historical chart displays accurate data for the past 24 hours.

---

### 9. **Deploy the Application**
1. Deploy the app to **Vercel** or another hosting platform.
2. Ensure SQLite database persistence for production (consider using a remote database or file-based persistence).