# Health Dashboard PWA - District Level

A Progressive Web App (PWA) dashboard for health officials to monitor district-level health indicators, specifically focused on antibiotic usage and health data.

## Features

### 📊 **District Level Indicators**
- **Antibiotic Usage Prevalence** - Share of medicine users taking antibiotics
- **Self-Medication Rate** - Antibiotic users without doctor consultation
- **Restart Without Consultation** - People restarting antibiotics without medical advice
- **Antibiotic Misuse Awareness** - Knowledge about antibiotic misuse risks
- **Long-term Illness Prevalence** - Burden of chronic illnesses
- **Health Information Sources** - Common sources of health information

### 📱 **PWA Features**
- ✅ **Cross-platform compatibility** (iOS, Android, Web)
- ✅ **Offline capability** - Works without internet connection
- ✅ **App-like experience** - Installable on mobile devices
- ✅ **Responsive design** - Optimized for all screen sizes
- ✅ **Fast loading** - Optimized performance

### 📈 **Data Visualizations**
- Line charts for monthly trends
- Bar charts for taluk-wise comparisons
- Pie charts for health information sources
- Interactive metric cards with trend indicators

## Technology Stack

- **Frontend**: Next.js 14, React 18
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **PWA**: next-pwa

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create configuration files**

   **tailwind.config.js:**
   ```javascript
   /** @type {import('tailwindcss').Config} */
   module.exports = {
     content: [
       './pages/**/*.{js,ts,jsx,tsx,mdx}',
       './components/**/*.{js,ts,jsx,tsx,mdx}',
       './app/**/*.{js,ts,jsx,tsx,mdx}',
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

   **postcss.config.js:**
   ```javascript
   module.exports = {
     plugins: {
       tailwindcss: {},
       autoprefixer: {},
     },
   }
   ```

   **next.config.js:**
   ```javascript
   const withPWA = require('next-pwa')({
     dest: 'public',
     register: true,
     skipWaiting: true,
     disable: process.env.NODE_ENV === 'development'
   })

   /** @type {import('next').NextConfig} */
   const nextConfig = {
     experimental: {
       appDir: true,
     },
     images: {
       domains: ['localhost'],
     },
   }

   module.exports = withPWA(nextConfig)
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## PWA Installation

### On Mobile (iOS/Android):
1. Open the dashboard in Safari (iOS) or Chrome (Android)
2. Tap the "Share" button
3. Select "Add to Home Screen" or "Install App"
4. The app will now appear on your home screen

### On Desktop:
1. Open the dashboard in Chrome/Edge
2. Click the install icon in the address bar
3. Click "Install" to add to desktop

## Cross-Platform Compatibility

### ✅ **iOS Safari**
- Full PWA support
- Offline functionality
- Home screen installation
- App-like experience

### ✅ **Android Chrome**
- Full PWA support
- Offline functionality
- Home screen installation
- Push notifications (if configured)

### ✅ **Desktop Browsers**
- Chrome, Edge, Firefox support
- Desktop installation
- Full functionality

## Data Structure

The dashboard uses sample data located in `data/districtData.js`. In production, you can:

1. **Replace with real API calls** in the components
2. **Connect to your database** (MySQL, PostgreSQL, MongoDB)
3. **Use real-time data** with WebSocket connections

## Customization

### Adding New Indicators:
1. Add data to `data/districtData.js`
2. Create new MetricCard components
3. Update the dashboard layout

### Styling:
- Modify `styles/globals.css` for global styles
- Update Tailwind classes in components
- Customize colors in the theme

### PWA Configuration:
- Update `public/manifest.json` for app details
- Modify PWA settings in `next.config.js`
- Add custom service worker if needed

## Deployment

### Vercel (Recommended):
```bash
npm run build
vercel --prod
```

### Other Platforms:
- Netlify
- AWS Amplify
- Google Cloud Platform
- Any static hosting service

## Browser Support

- Chrome 67+
- Firefox 67+
- Safari 11.1+
- Edge 79+

## License

This project is licensed under the MIT License.

## Support

For technical support or questions, please contact the development team.
