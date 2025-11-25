# File Upload Configuration

## Current Setup: Local Filesystem Storage

The application is now configured to store uploaded files in the `public/uploads/` folder:

- **Yacht images**: `public/uploads/yachts/`
- **Location images**: `public/uploads/locations/`

## How It Works

1. **File Upload Flow**:
   - User uploads an image through the admin dashboard
   - File is validated (type, size)
   - File is saved to `public/uploads/{folder}/{timestamp}.{extension}`
   - Public URL is returned: `/uploads/{folder}/{timestamp}.{extension}`

2. **Storage Locations**:
   - Yacht images: `public/uploads/yachts/` → Accessible at `/uploads/yachts/{filename}`
   - Location images: `public/uploads/locations/` → Accessible at `/uploads/locations/{filename}`

## Platform Compatibility

### ✅ Works On:
- **Railway** - Supports persistent filesystem
- **Render** - Supports persistent filesystem
- **Traditional VPS/Server** - Full filesystem access
- **Local Development** - Full filesystem access

### ⚠️ Limitations:
- **Vercel** - Filesystem is read-only (files will be lost on redeploy)
- **Netlify** - Filesystem is read-only (files will be lost on redeploy)
- **AWS Lambda** - Ephemeral filesystem

### For Serverless Platforms (Vercel/Netlify):
If deploying to Vercel or Netlify, configure Cloudinary storage (recommended for all production environments). The system automatically switches to Cloudinary when credentials are present.

## File Structure

```
public/
  uploads/
    yachts/
      {timestamp}.jpg
      {timestamp}.png
      ...
    locations/
      {timestamp}.jpg
      {timestamp}.png
      ...
```

## Benefits

1. **No Cloud Storage Required** - Works out of the box
2. **Simple Setup** - No API keys or configuration needed
3. **Direct Access** - Files served directly from public folder
4. **Automatic Organization** - Files organized by type (yachts/locations)

## Cloudinary Setup

Configure one of the following combinations of environment variables in both development and production (use `.env.local` locally and platform env settings in deployment):

### Option A – Signed uploads (recommended for private presets)
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=hala-yachts
```

### Option B – Unsigned uploads (no secret needed)
```bash
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_UPLOAD_PRESET=unsigned_upload_preset
CLOUDINARY_FOLDER=hala-yachts
```

_Tip_: If you already expose values to the client via `NEXT_PUBLIC_` variables, the server will now fall back to them automatically.

Once set, uploads will go directly to Cloudinary and return secure URLs that work in every environment. The system still falls back to local `public/uploads` storage when none of the above variables are present.

