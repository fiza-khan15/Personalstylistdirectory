import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Storage bucket name
const BUCKET_NAME = 'make-5b46b93c-stylist-images';

// Initialize storage bucket on startup
const initStorage = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME);
    
    if (!bucketExists) {
      console.log(`Creating storage bucket: ${BUCKET_NAME}`);
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 5242880, // 5MB limit
      });
      
      if (error) {
        console.error('Failed to create storage bucket:', error);
      } else {
        console.log('Storage bucket created successfully');
      }
    } else {
      console.log('Storage bucket already exists');
    }
  } catch (err) {
    console.error('Error initializing storage:', err);
  }
};

// Initialize storage on startup
initStorage();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-5b46b93c/health", (c) => {
  return c.json({ status: "ok" });
});

// Image upload endpoint
app.post("/make-server-5b46b93c/upload-image", async (c) => {
  try {
    // Get user auth token from Authorization header
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.split(' ')[1];
    
    console.log('Upload request received. Auth header present:', !!authHeader);
    console.log('Access token present:', !!accessToken);
    
    if (!accessToken) {
      console.error('Upload failed: No access token in Authorization header');
      return c.json({ error: 'Unauthorized - No access token provided' }, 401);
    }

    // Verify user is authenticated
    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    
    if (authError) {
      console.error('Auth verification error:', authError);
      return c.json({ error: `Unauthorized - ${authError.message}` }, 401);
    }
    
    if (!user?.id) {
      console.error('Auth verification failed: No user ID found');
      return c.json({ error: 'Unauthorized - Invalid access token' }, 401);
    }
    
    console.log('User authenticated successfully:', user.id);

    // Get the uploaded file
    const body = await c.req.parseBody();
    const file = body['file'];
    
    if (!file || typeof file === 'string') {
      return c.json({ error: 'No file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' }, 400);
    }

    // Validate file size (5MB max)
    if (file.size > 5242880) {
      return c.json({ error: 'File too large. Maximum size is 5MB.' }, 400);
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fileName, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return c.json({ error: `Upload failed: ${uploadError.message}` }, 500);
    }

    // Generate signed URL (valid for 10 years)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(fileName, 315360000); // 10 years in seconds

    if (signedUrlError || !signedUrlData?.signedUrl) {
      console.error('Signed URL error:', signedUrlError);
      return c.json({ error: 'Failed to generate signed URL' }, 500);
    }

    console.log(`Image uploaded successfully for user ${user.id}: ${fileName}`);

    return c.json({
      success: true,
      url: signedUrlData.signedUrl,
      fileName: fileName,
    });

  } catch (err) {
    console.error('Unexpected error in upload-image:', err);
    return c.json({ error: `Server error: ${err.message}` }, 500);
  }
});

Deno.serve(app.fetch);