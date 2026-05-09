# Iris - Image Processing Service

Iris is a powerful, full-stack image processing service inspired by platforms like Cloudinary. It allows users to upload, store, and transform images on the fly with a simple API and an intuitive dashboard.

## 🌟 Features

- **User Authentication**: Secure signup and login system using JWT.
- **Image Upload**: Efficiently upload images to Cloudflare R2 / S3 storage.
- **Dynamic Transformations**:
  - Resize and Scale
  - Cropping
  - Rotation
  - Filters (Grayscale, Sepia)
  - Format Conversion (JPG, PNG, GIF, etc.)
- **Image Metadata**: Automatic extraction of image dimensions and metadata.
- **Rate Limiting**: Integrated rate limiting (e.g., 2 uploads per day for free users).
- **Responsive Dashboard**: A modern React-based interface to manage and transform your images.

## 🏗️ Project Structure

The project is divided into two main parts:

- **[Backend](backend/)**: A Spring Boot application providing a RESTful API.
- **[Frontend](frontend/)**: A modern React application built with Vite and TypeScript.

## 🚀 Getting Started

### Prerequisites

- **Java 21** or higher
- **Node.js 18** or higher
- **PostgreSQL** database
- **Cloudflare R2 / AWS S3** bucket for image storage

### Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/roan-yosky-timane/iris.git
   cd iris
   ```

2. **Configure the Backend**:
   - Navigate to the `backend` directory.
   - Copy `.env.example` to `.env` (if provided) and fill in your credentials (DB, S3/R2, JWT Secret).
   - Run the application: `./mvnw spring-boot:run`

3. **Configure the Frontend**:
   - Navigate to the `frontend` directory.
   - Copy `.env.example` to `.env` and set the `VITE_API_BASE_URL`.
   - Install dependencies: `npm install`
   - Run the development server: `npm run dev`

## 🛠️ Tech Stack

- **Backend**: Java 21, Spring Boot, Spring Security (JWT), Spring Data JPA, PostgreSQL, Cloudflare R2/S3 SDK, Thumbnailator, Bucket4j.
- **Frontend**: React 19, TypeScript, Vite, Framer Motion, Axios, Lucide React, React Easy Crop.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
