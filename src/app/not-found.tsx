import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-8 text-center">
      <div className="max-w-2xl">
        <h1 className="mb-4 text-6xl font-extrabold tracking-tight text-gray-900">
          Oops! <span className="text-gray-400">404</span>
        </h1>
        <p className="mb-8 text-xl font-medium text-gray-600">
          We&apos;ve searched high and low, but couldn&apos;t find what you&apos;re looking for. 
          The page may have moved or no longer exists.
        </p>
        <div className="relative mx-auto mb-12 h-[400px] w-full max-w-[600px]">
          {/* <Image
            src="/404-illustration.svg"
            alt="404 Illustration"
            fill
            className="object-contain"
            priority
          /> */}
        </div>
        <div className="flex flex-col items-center gap-4">
          <Link 
            href="/dashboard" 
            className={buttonVariants({
              variant: 'default',
              size: 'lg',
              className: "font-semibold"
            })}
          >
            Return to Homepage
          </Link>
          <p className="text-sm text-gray-500">
            Need help? <a href="/contact" className="text-gray-300 hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
