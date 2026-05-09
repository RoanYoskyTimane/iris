# Iris Frontend - Image Management Dashboard

The frontend of Iris is a modern, responsive web application that provides a user-friendly interface for managing and transforming images.

##  Technologies

- **Framework**: React 19
- **Build Tool**: Vite
- **Language**: TypeScript
- **Styling**: Vanilla CSS (with modern aesthetics)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Image Cropping**: [React Easy Crop](https://github.com/ValentinH/react-easy-crop)
- **Routing**: React Router 7
- **HTTP Client**: Axios

## Key Features

- **Auth Flow**: Clean login and registration pages with validation.
- **Dashboard**: A central hub to view and manage uploaded images.
- **Image Editor**: Interactive interface to apply transformations:
  - Visual cropping tool.
  - Controls for resizing, rotation, and filters.
  - Real-time preview (via API).
- **Responsive Design**: Works seamlessly on desktops, tablets, and mobile devices.
- **Micro-interactions**: Smooth transitions and hover effects for a premium feel.

## Project Structure

- `src/api`: Axios configuration and API service calls.
- `src/components`: Reusable UI components (Buttons, Inputs, Modals, etc.).
- `src/pages`: Main application views (Login, Register, Dashboard).
- `src/styles`: Global styles and design system tokens.

## Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

## Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```
