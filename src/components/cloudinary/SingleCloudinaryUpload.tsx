'use client';

import React from 'react';
import {
  CldUploadButton,
  CloudinaryUploadWidgetResults,
} from 'next-cloudinary';

type Props = {
  onUpload: (url: string) => void; // Accepts a single image URL
};

export default function SingleCloudinaryUpload({ onUpload }: Props) {
  return (
    <CldUploadButton
      options={{ multiple: false }} // Restrict to single file upload
      uploadPreset='secure-cosmetics'
      onSuccess={(result: CloudinaryUploadWidgetResults) => {
        if (
          result.info &&
          typeof result.info === 'object' &&
          'secure_url' in result.info
        ) {
          onUpload(result.info.secure_url); // Pass only a single URL
        }
      }}
      className={`flex items-center gap-2 border-2 border-default text-default 
        rounded-lg py-2 px-4 hover:bg-default/10`}
    >
      Upload Image
    </CldUploadButton>
  );
}
