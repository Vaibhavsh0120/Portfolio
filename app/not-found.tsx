import Link from "next/link";
import ThemeToggle from "@/components/ui/theme-toggle";

export default function NotFound() {
  return (
    <>
      <ThemeToggle />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f4f4f5] dark:bg-[#050505] p-6 transition-colors duration-300 relative overflow-hidden font-['DM_Sans',sans-serif]">
        
        {/* Subtle background gradients matching login theme */}
        <div className="absolute inset-0 pointer-events-none opacity-50 dark:opacity-20" style={{
          backgroundImage: `radial-gradient(circle at 20% 20%, rgba(15,15,15,0.06) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(15,15,15,0.04) 0%, transparent 50%)`
        }} />

        <div className="relative z-10 flex flex-col items-center text-center space-y-6 max-w-md">
          {/* Error Code */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#171717] border border-gray-200 dark:border-[#2f2f2f] text-sm font-semibold text-gray-600 dark:text-gray-300 shadow-sm mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" x2="12" y1="8" y2="12" />
              <line x1="12" x2="12.01" y1="16" y2="16" />
            </svg>
            Error 404
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[#0f0f0f] dark:text-[#f5f5f5]">
            Page Not Found
          </h1>
          
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Sorry, the page you are looking for doesn&apos;t exist, has been removed, or is temporarily unavailable.
          </p>

          <div className="pt-4 w-full">
            <Link 
              href="/" 
              className="group inline-flex items-center justify-center gap-2 w-full sm:w-auto h-14 px-8 bg-[#0f0f0f] dark:bg-[#171717] text-white hover:bg-[#2a2a2a] dark:hover:bg-[#242424] dark:border dark:border-[#2f2f2f] rounded-xl text-base font-semibold transition-all hover:scale-[0.98] active:scale-95 shadow-lg shadow-black/10 dark:shadow-none"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 transition-transform group-hover:-translate-x-1">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Back to Home Screen
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
