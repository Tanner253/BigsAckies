"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { images as ImageType } from "@prisma/client";

async function getImages() {
    const res = await fetch("/api/admin/images");
    if(!res.ok) return [];
    return res.json();
}

interface ImageLibraryProps {
  onSelectImage: (url: string) => void;
}

export default function ImageLibrary({ onSelectImage }: ImageLibraryProps) {
  const [images, setImages] = useState<ImageType[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function loadImages() {
        const fetchedImages = await getImages();
        setImages(fetchedImages);
    }
    loadImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/images/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const newImage = await res.json();
        setImages((prevImages) => [newImage, ...prevImages]);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Select an Image</h3>
        <Button asChild>
          <label htmlFor="image-upload">
            <Upload className="mr-2 h-4 w-4" />
            Upload New
            <input
              id="image-upload"
              type="file"
              className="sr-only"
              onChange={handleFileUpload}
              disabled={isUploading}
            />
          </label>
        </Button>
      </div>
       {isUploading && <p>Uploading...</p>}
      <div className="grid grid-cols-4 gap-4 max-h-96 overflow-y-auto">
        {images.map((image) => (
          <div
            key={image.id}
            className="relative aspect-square cursor-pointer rounded-md overflow-hidden"
            onClick={() => onSelectImage(image.url)}
          >
            <Image
              src={image.url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
} 