# Iris Backend - Image Processing API

The backend of Iris is a robust Spring Boot application that handles image storage, metadata extraction, and complex image transformations.

## 🛠️ Technologies

- **Language**: Java 21
- **Framework**: Spring Boot 4.0.1
- **Security**: Spring Security with JWT (JSON Web Tokens)
- **Database**: PostgreSQL with Spring Data JPA
- **Storage**: Cloudflare R2 / AWS S3 (S3 Compatible Storage)
- **Image Processing**: [Thumbnailator](https://github.com/coobird/thumbnailator)
- **Metadata Extraction**: [metadata-extractor](https://github.com/drewnoakes/metadata-extractor)
- **Rate Limiting**: [Bucket4j](https://github.com/bucket4j/bucket4j)
- **Build Tool**: Maven

## 📂 Key Components

- **Controllers**:
  - `AuthenticationController`: Handles user registration and login.
  - `ImageController`: Manages image uploads, downloads, transformations, and deletions.
- **Services**:
  - `ImageService`: Orchestrates image processing and metadata handling.
  - `R2Service`: Interfaces with Cloudflare R2/S3 storage.
  - `JwtService`: Manages token generation and validation.
  - `RateLimiteService`: Implements user-based rate limiting.

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register`: Create a new account.
- `POST /api/v1/auth/login`: Authenticate and receive a JWT.

### Images
- `POST /api/v1/images/upload`: Upload an image (requires auth, rate-limited).
- `GET /api/v1/images/{key}`: Download an image by its R2/S3 key.
- `POST /api/v1/images/{key}/transform`: Transform an image (resize, crop, rotate, filter).
- `GET /api/v1/images`: List user images (paginated).
- `DELETE /api/v1/images/{key}`: Remove an image.

## ⚙️ Configuration

The application requires an `.env` file in the root of the `backend` folder with the following variables:

```env
# Database
DB_URL=jdbc:postgresql://localhost:5432/iris
DB_USERNAME=your_username
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_super_secret_key
JWT_EXPIRATION=86400000

# Cloudflare R2 / S3
R2_ACCESS_KEY=your_access_key
R2_SECRET_KEY=your_secret_key
R2_ENDPOINT=your_endpoint_url
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_public_url
```

## 🚀 Running the App

```bash
./mvnw spring-boot:run
```
