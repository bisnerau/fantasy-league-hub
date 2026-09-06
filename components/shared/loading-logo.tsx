import Image from 'next/image';

export function LoadingLogo() {
  return (
    <div className="mx-auto size-24 sm:size-28">
      <Image
        src="/logo.png"
        alt="MAC 12"
        width={112}
        height={112}
        unoptimized
        className="size-full object-contain"
      />
    </div>
  );
}
