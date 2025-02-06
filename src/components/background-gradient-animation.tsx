'use client';

import { cn } from '@/utils/cn';

export const BackgroundGradientAnimation = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="min-h-screen w-full">
      <div 
        className="fixed inset-0 -z-10"
        style={{
          background: `
            linear-gradient(120deg, 
              rgb(255, 255, 255) 0%,
              rgb(240, 244, 255) 25%,
              rgb(220, 230, 255) 50%,
              rgb(190, 210, 255) 75%,
              rgb(160, 190, 255) 100%
            )
          `,
        }}
      />
      <div className={cn('relative', className)}>
        {children}
      </div>
    </div>
  );
} 