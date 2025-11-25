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
If deploying to Vercel or Netlify, configure cloud storage:
- Set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, etc.
- Or set `AWS_S3_BUCKET`, `AWS_S3_REGION`, etc.

The system will automatically use cloud storage if configured.

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

## Migration to Cloud Storage (Optional)

If you later want to use cloud storage for better scalability:

1. **Cloudinary** (Recommended):
   ```bash
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   CLOUDINARY_UPLOAD_PRESET=your_preset
   ```

2. **AWS S3**:
   ```bash
   AWS_S3_BUCKET=your_bucket
   AWS_S3_REGION=us-east-1
   AWS_ACCESS_KEY_ID=your_key
   AWS_SECRET_ACCESS_KEY=your_secret
   ```

The system will automatically detect and use cloud storage if configured.

