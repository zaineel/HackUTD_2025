# Goldman Sachs Vendor Onboarding Hub - Frontend

A modern, responsive React application for streamlining vendor onboarding through AI-powered automation and compliance verification.

## Features

- **Vendor Registration**: Simple form-based onboarding process
- **Document Upload**: Drag-and-drop interface with file validation
- **Real-time Risk Assessment**: AI-powered risk scoring across 4 dimensions
- **Interactive Dashboard**: Track onboarding progress and status
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Mock Data Mode**: Development without backend dependency

## Tech Stack

- **React 18.2** - Modern UI framework
- **Vite 5.0** - Fast build tool and dev server
- **React Router 6.20** - Client-side routing
- **Axios 1.6** - HTTP client
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **Recharts 2.10** - Data visualization (risk charts)

## Project Structure

```
frontend/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Navbar.jsx
│   │   ├── VendorForm.jsx
│   │   ├── DocumentUpload.jsx
│   │   ├── ProgressBar.jsx
│   │   ├── RiskGauge.jsx
│   │   └── StatusCard.jsx
│   ├── pages/             # Route pages
│   │   ├── HomePage.jsx
│   │   ├── RegisterPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── DashboardPage.jsx
│   │   └── RiskScorePage.jsx
│   ├── services/          # API integration
│   │   ├── api.js         # API client with mock/real toggle
│   │   └── mockData.js    # Mock API responses
│   ├── utils/             # Constants and helpers
│   │   └── constants.js
│   ├── App.jsx            # Root component with routing
│   ├── main.jsx          # React entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── package.json         # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Git

### Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Development

### Running with Mock Data

By default, the application runs with mock data (no backend required). This is controlled by the `USE_MOCK_DATA` flag in `src/utils/constants.js`:

```javascript
export const USE_MOCK_DATA = !import.meta.env.VITE_API_URL;
```

Mock data is automatically enabled when no `VITE_API_URL` environment variable is set.

### Connecting to Real Backend

To connect to the real AWS backend API:

1. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

2. Restart the dev server:
```bash
npm run dev
```

The app will automatically switch from mock data to real API calls.

### Environment Variables

- `VITE_API_URL` - Backend API endpoint (optional, defaults to mock data if not set)

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint (if configured)

## Building for Production

1. Build the application:
```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

2. Test the production build locally:
```bash
npm run preview
```

## Deployment Options

### Option 1: AWS S3 + CloudFront (Recommended)

**Benefits**: Serverless, scalable, cost-effective, integrates with existing AWS infrastructure

1. Build the application:
```bash
npm run build
```

2. Create an S3 bucket:
```bash
aws s3 mb s3://gs-vendor-onboarding-frontend --region us-east-1
```

3. Enable static website hosting:
```bash
aws s3 website s3://gs-vendor-onboarding-frontend \
  --index-document index.html \
  --error-document index.html
```

4. Upload the build:
```bash
aws s3 sync dist/ s3://gs-vendor-onboarding-frontend --delete
```

5. Create CloudFront distribution for HTTPS and global CDN:
```bash
# Use AWS Console or CDK to create CloudFront distribution
# pointing to S3 bucket origin
```

6. Set the API URL environment variable during build:
```bash
VITE_API_URL=https://your-api.execute-api.us-east-1.amazonaws.com/prod npm run build
```

### Option 2: Vercel

**Benefits**: Zero-config deployment, automatic HTTPS, preview deployments

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variable in Vercel dashboard:
```
VITE_API_URL=https://your-api-gateway-url
```

### Option 3: Netlify

**Benefits**: Easy deployment, built-in CI/CD, form handling

1. Install Netlify CLI:
```bash
npm i -g netlify-cli
```

2. Deploy:
```bash
netlify deploy --prod --dir=dist
```

3. Set environment variable in Netlify dashboard:
```
VITE_API_URL=https://your-api-gateway-url
```

### Option 4: Docker

**Benefits**: Consistent environment, works anywhere Docker runs

1. Create `Dockerfile` in frontend directory:
```dockerfile
# Build stage
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

2. Create `nginx.conf`:
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

3. Build and run:
```bash
docker build --build-arg VITE_API_URL=https://your-api-url -t gs-vendor-frontend .
docker run -p 80:80 gs-vendor-frontend
```

## Configuration

### Tailwind Custom Colors

Goldman Sachs brand colors are configured in `tailwind.config.js`:

```javascript
colors: {
  'gs-blue': '#005EB8',
  'gs-navy': '#003366',
}
```

### API Endpoints

All API endpoints are defined in `src/services/api.js`:

- `POST /vendors` - Create vendor account
- `POST /vendors/{id}/documents` - Upload document
- `GET /vendors/{id}/status` - Get vendor status
- `GET /vendors/{id}/risk-score` - Get risk assessment

## User Flow

1. **Landing Page** (`/`) - View features and benefits
2. **Registration** (`/register`) - Submit company information
3. **Upload Documents** (`/upload`) - Upload W-9, insurance certificates, etc.
4. **Dashboard** (`/dashboard`) - Track onboarding progress
5. **Risk Assessment** (`/risk`) - View AI-generated risk score

## Key Components

### VendorForm
- Form validation (email, EIN format)
- Real-time error display
- Loading states

### DocumentUpload
- Drag-and-drop file upload
- File type validation (PDF, JPEG, PNG)
- Size validation (max 10MB)
- Upload progress indication

### RiskGauge
- Circular SVG gauge animation
- Color-coded risk levels (green/yellow/orange/red)
- Multiple size variants

### StatusCard
- Current vendor status display
- Document verification status
- Next steps actionable items

## Mock Data

Mock data structure matches the exact Lambda function outputs for seamless API integration. Located in `src/services/mockData.js`, it includes:

- Vendor registration responses
- Document upload confirmations
- Risk assessment data with 4 dimensions
- Status updates and timelines

## Troubleshooting

### Development server won't start
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Build fails
```bash
# Check Node version (needs 18+)
node --version

# Clear Vite cache
rm -rf node_modules/.vite
```

### API calls fail
1. Check `VITE_API_URL` is set correctly
2. Verify CORS is enabled on API Gateway
3. Check browser console for detailed errors
4. Test API endpoint directly with curl

### Styling issues
```bash
# Rebuild Tailwind
npm run build
```

## Integration with Backend (Person 4)

After Person 1 deploys the AWS infrastructure:

1. Get API Gateway URL from AWS Console or CDK output
2. Update `.env` file:
```env
VITE_API_URL=https://xxxxx.execute-api.us-east-1.amazonaws.com/prod
```
3. Verify CORS headers are enabled on API Gateway
4. Test each endpoint matches the API service expectations

## Team Integration

- **Person 1 (AWS Infrastructure)**: Provides API Gateway URL
- **Person 2 (Frontend)**: This application (you are here)
- **Person 3 (AI/ML)**: Document processing happens server-side
- **Person 4 (Backend)**: Ensures API responses match expected format

## Performance Optimization

- **Code Splitting**: Vite automatically splits code by route
- **Lazy Loading**: React.lazy() can be added for larger components
- **Image Optimization**: Use WebP format for images
- **CDN**: Use CloudFront or Vercel CDN for global performance
- **Caching**: Set appropriate cache headers in production

## Security Considerations

- **Environment Variables**: Never commit `.env` files
- **API Keys**: Use environment variables, not hardcoded values
- **HTTPS**: Always use HTTPS in production
- **CORS**: Configure CORS properly on backend
- **Input Validation**: Client-side validation implemented, backend validation required

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

HackUTD 2025 Project - Goldman Sachs Challenge

## Contributors

- Person 2: Frontend Development (React, TailwindCSS, Components)
- Person 1: AWS Infrastructure Integration
- Person 3: AI/ML Backend Integration
- Person 4: API Backend Development
