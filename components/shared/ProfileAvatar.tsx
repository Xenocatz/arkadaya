"use client";

import { useState } from "react";
import { User } from "lucide-react";

interface ProfileAvatarProps {
  src?: string | null;
  alt: string;
  wrapperClassName: string;
  imageClassName: string;
  iconClassName: string;
}

export default function ProfileAvatar({
  src,
  alt,
  wrapperClassName,
  imageClassName,
  iconClassName,
}: ProfileAvatarProps) {
  const [hasError, setHasError] = useState(false);
  const shouldShowImage = Boolean(src) && !hasError;

  return (
    <div className={wrapperClassName}>
      {shouldShowImage ? (
        <img
          src={src ?? ""}
          alt={alt}
          className={imageClassName}
          onError={() => setHasError(true)}
        />
      ) : (
        <User className={iconClassName} />
      )}
    </div>
  );
}
