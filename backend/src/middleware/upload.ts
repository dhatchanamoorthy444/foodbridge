import multer from 'multer'
import path from 'path'

type DestinationCallback = (error: Error | null, destination: string) => void
type FilenameCallback = (error: Error | null, filename: string) => void
type AcceptCallback = (error: Error | null, accept?: boolean) => void

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Express.Request, file: Express.Multer.File, cb: DestinationCallback) => {
    cb(null, 'uploads/')
  },
  filename: (req: Express.Request, file: Express.Multer.File, cb: FilenameCallback) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: AcceptCallback) => {
  // Accept images and PDF files
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf']

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, GIF, and PDF are allowed.'), false)
  }
}

export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter,
})