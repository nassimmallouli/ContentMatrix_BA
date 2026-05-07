import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// ─── Supabase ────────────────────────────────────────────────────────────────
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || ''
);
const BUCKET = process.env.SUPABASE_BUCKET || 'content-matrix';

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', async (req, res) => {
  try {
    const { error } = await supabase.from('documents').select('id').limit(1);
    res.json({
      ok: true,
      supabase: error ? 'error: ' + error.message : 'connected',
      bucket: BUCKET,
    });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// ─── Documents CRUD ──────────────────────────────────────────────────────────

/** GET /api/documents  - list all */
app.get('/api/documents', async (req, res) => {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/** POST /api/documents - create */
app.post('/api/documents', async (req, res) => {
  const body = req.body;
  const doc = {
    id: body.id || uuidv4(),
    title: body.title,
    description: body.description || null,
    type: body.type,
    domain: body.domain,
    tags: body.tags || [],
    status: body.status || 'draft',
    input_mode: body.input_mode || null,
    content: body.content || null,
    url: body.url || null,
    file_name: body.file_name || null,
    file_mime: body.file_mime || null,
    storage_path: body.storage_path || null,
    created_at: body.created_at || Date.now(),
    updated_at: Date.now(),
  };
  const { data, error } = await supabase.from('documents').insert([doc]).select().single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

/** PUT /api/documents/:id - update */
app.put('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  const update = { ...req.body, updated_at: Date.now() };
  delete update.id;
  delete update.created_at;
  const { data, error } = await supabase
    .from('documents')
    .update(update)
    .eq('id', id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

/** DELETE /api/documents/:id */
app.delete('/api/documents/:id', async (req, res) => {
  const { id } = req.params;
  // Also delete storage file if exists
  const { data: doc } = await supabase.from('documents').select('storage_path').eq('id', id).single();
  if (doc?.storage_path) {
    await supabase.storage.from(BUCKET).remove([doc.storage_path]);
  }
  const { error } = await supabase.from('documents').delete().eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ ok: true });
});

// ─── File Upload ──────────────────────────────────────────────────────────────

/** POST /api/upload - upload file to Supabase Storage, returns public URL */
app.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file provided' });

  const ext = req.file.originalname.split('.').pop();
  const path = `uploads/${uuidv4()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, req.file.buffer, {
      contentType: req.file.mimetype,
      upsert: false,
    });

  if (uploadError) return res.status(500).json({ error: uploadError.message });

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(path);

  res.json({
    storage_path: path,
    url: urlData.publicUrl,
    file_name: req.file.originalname,
    file_mime: req.file.mimetype,
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 Content Matrix API running on http://localhost:${PORT}`);
  console.log(`   Supabase URL: ${process.env.SUPABASE_URL || '(not set)'}`);
  console.log(`   Bucket: ${BUCKET}\n`);
});
