interface LogoProps {
    backToHome?: () => void;
}

export function Logo({ backToHome }: LogoProps) { 
  return (
    <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity" onClick={backToHome}>
      <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center shadow-md">
        <span className="text-white font-bold text-sm">SP</span>
      </div>
      <span className="font-bold text-lg hidden sm:inline">Stadt Preis</span>
    </div>
  );
}