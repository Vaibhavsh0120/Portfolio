"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import type { Point, Area } from "react-easy-crop"
import { Check, X, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { getCroppedImg } from "@/lib/cms/image-utils"

type ImageCropperModalProps = {
  file: File
  aspect?: number
  onComplete: (file: File, previewUrl: string) => void
  onCancel: () => void
}

export function ImageCropperModal({ file, aspect: initialAspect, onComplete, onCancel }: ImageCropperModalProps) {
  const [imageSrc] = useState(() => URL.createObjectURL(file))
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [aspect, setAspect] = useState<number>(initialAspect || 4 / 3) // Default until loaded
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [processing, setProcessing] = useState(false)

  const onMediaLoaded = useCallback((mediaSize: { naturalWidth: number; naturalHeight: number }) => {
    if (!initialAspect && aspect === 4 / 3) {
      setAspect(mediaSize.naturalWidth / mediaSize.naturalHeight)
    }
  }, [initialAspect, aspect])

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleDone = async () => {
    if (!croppedAreaPixels) return

    setProcessing(true)
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
      if (croppedBlob) {
        const croppedFile = new File([croppedBlob], file.name, { type: "image/jpeg" })
        const previewUrl = URL.createObjectURL(croppedBlob)
        onComplete(croppedFile, previewUrl)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setProcessing(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950/80 backdrop-blur-sm p-4">
      <div className="relative flex h-full max-h-[800px] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900">
        <div className="flex items-center justify-between border-b border-neutral-100 p-4 dark:border-neutral-800">
          <div>
            <h3 className="text-lg font-semibold">Crop Image</h3>
            <p className="text-xs text-neutral-500">Zoom and drag to position your image</p>
          </div>
          <div className="flex items-center gap-3">
            {!initialAspect && (
              <div className="hidden sm:flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-lg mr-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAspect(1)} 
                  className={`h-7 px-2 text-xs ${aspect === 1 ? 'bg-white shadow-sm dark:bg-neutral-700' : ''}`}
                >
                  1:1
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAspect(3 / 4)} 
                  className={`h-7 px-2 text-xs ${aspect === 3 / 4 ? 'bg-white shadow-sm dark:bg-neutral-700' : ''}`}
                >
                  3:4
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setAspect(4 / 3)} 
                  className={`h-7 px-2 text-xs ${aspect === 4 / 3 ? 'bg-white shadow-sm dark:bg-neutral-700' : ''}`}
                >
                  4:3
                </Button>
              </div>
            )}
            <Button variant="ghost" size="icon" onClick={onCancel} disabled={processing}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="relative flex-1 bg-neutral-100 dark:bg-neutral-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
            onMediaLoaded={onMediaLoaded}
          />
        </div>

        <div className="space-y-4 border-t border-neutral-100 p-6 dark:border-neutral-800">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="flex flex-1 flex-wrap items-center gap-6">
              <div className="flex flex-1 min-w-[200px] items-center gap-3">
                <ZoomOut className="h-4 w-4 text-neutral-400" />
                <input
                  type="range"
                  value={zoom}
                  min={1}
                  max={3}
                  step={0.1}
                  aria-labelledby="Zoom"
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-neutral-800"
                />
                <ZoomIn className="h-4 w-4 text-neutral-400" />
              </div>
              <div className="flex flex-1 min-w-[200px] items-center gap-3">
                <RotateCcw className="h-4 w-4 text-neutral-400" />
                <input
                  type="range"
                  value={rotation}
                  min={0}
                  max={360}
                  step={1}
                  aria-labelledby="Rotation"
                  onChange={(e) => setRotation(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-neutral-200 dark:bg-neutral-800"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={onCancel} disabled={processing}>
                Cancel
              </Button>
              <Button onClick={handleDone} disabled={processing} className="min-w-[100px]">
                {processing ? "Processing..." : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Apply Crop
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
