import { Request, Response, NextFunction } from 'express'
import multer from 'multer'
import { supabaseAdmin } from '../db/supabase'

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
])
const ALLOWED_EXT = new Set(['jpg', 'jpeg', 'png', 'webp', 'heic'])
const MAX_BYTES = 5 * 1024 * 1024

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES },
})

const foodImageUpload = upload.single('image')

export async function uploadFoodImage(
  req: Request,
  res: Response,
  next: NextFunction
) {
  foodImageUpload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        error: `Image upload rejected: ${err.message}`,
      })
    }
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' })
      }
      const file = req.file
      if (!file) return res.status(400).json({ error: 'No image provided' })

      if (!ALLOWED_TYPES.has(file.mimetype)) {
        return res
          .status(400)
          .json({ error: `Unsupported file type: ${file.mimetype}` })
      }
      const ext = (file.originalname.split('.').pop() ?? '').toLowerCase()
      if (!ALLOWED_EXT.has(ext)) {
        return res
          .status(400)
          .json({ error: `Unsupported file extension: ${ext}` })
      }

      // Unique object name within the donor's own folder — no path traversal,
      // no overwriting of other users' objects.
      const safeName = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 10)}.${ext}`
      const objectPath = `${req.user.userId}/${safeName}`

      const { error: upErr } = await supabaseAdmin.storage
        .from('food-donation-images')
        .upload(objectPath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        })

      if (upErr) {
        return res.status(500).json({ error: `Storage error: ${upErr.message}` })
      }

      const { data } = supabaseAdmin.storage
        .from('food-donation-images')
        .getPublicUrl(objectPath)

      return res.status(201).json({
        path: objectPath,
        publicUrl: data.publicUrl,
      })
    } catch (e) {
      next(e)
    }
  })
}

export function cleanupOrphanImage(path: string): void {
  supabaseAdmin.storage
    .from('food-donation-images')
    .remove([path])
    .catch((e: unknown) =>
      console.error('[storage] orphan cleanup failed', (e as Error).message)
    )
}