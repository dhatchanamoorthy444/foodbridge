"use client"

import React, { useState, useRef } from 'react'
import { Upload, X, FileText } from 'lucide-react'
import { cn } from '../../lib/utils'

interface FileUploadProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  onFileSelect: (file: File) => void
}

export function FileUpload({ label, onFileSelect, className, ...props }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      onFileSelect(selectedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div className={cn("w-full", className)}>
      {label && <label className=\"input-label mb-1.5 block\">{label}</label>}
      {!file ? (
        <div
          onClick={() => inputRef.current?.click()}
          className=\"border-2 border-dashed border-surface-border rounded-lg p-8 flex flex-col items-center justify-center cursor-pointer hover:border-botanical/50 transition-colors bg-surface-card\"
        >
          <Upload className=\"w-8 h-8 text-stone mb-2\" />
          <p className=\"text-sm text-stone\">Click to upload or drag and drop</p>
          <input
            ref={inputRef}
            type=\"file\"
            className=\"hidden\"
            onChange={handleFileChange}
            {...props}
          />
        </div>
      ) : (
        <div className=\"flex items-center justify-between p-3 bg-surface-elevated border border-surface-border rounded-lg\">
          <div className=\"flex items-center gap-2\">
            <FileText className=\"w-5 h-5 text-botanical-light\" />
            <span className=\"text-sm text-cream truncate\">{file.name}</span>
          </div>
          <button onClick={removeFile} className=\"p-1 hover:bg-white/5 rounded\">
            <X className=\"w-4 h-4 text-stone hover:text-cream\" />
          </button>
        </div>
      )}
    </div>
  )
}
