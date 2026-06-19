import React from "react";
import { ShieldAlert, Compass } from "lucide-react";

export default function RadarScanner({ statusText, onStartScan, isLocating }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4">
      {/* Radar Visual Container */}
      <div className="relative w-64 h-64 md:w-72 md:h-72 flex items-center justify-center rounded-full glass-panel border border-brand-primary/20 shadow-[0_0_50px_rgba(255,45,85,0.15)] mb-8 overflow-hidden">
        
        {/* Sweep Line (rotating beam) */}
        <div className="absolute inset-0 origin-center animate-radar-sweep pointer-events-none"
             style={{
               background: "conic-gradient(from 0deg, transparent 50%, rgba(255, 45, 85, 0.15) 85%, rgba(255, 45, 85, 0.4) 100%)",
               borderRadius: "50%"
             }}
        />

        {/* Pulse Waves */}
        <div className="absolute w-full h-full rounded-full border border-brand-primary/10 animate-radar-ping pointer-events-none" />
        <div className="absolute w-full h-full rounded-full border border-brand-accent/5 animate-radar-ping pointer-events-none" style={{ animationDelay: "1s" }} />

        {/* Concentric Circles */}
        <div className="absolute w-4/5 h-4/5 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-3/5 h-3/5 rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute w-2/5 h-2/5 rounded-full border border-white/5 pointer-events-none" />
        
        {/* Radar Crosshairs */}
        <div className="absolute w-full h-[1px] bg-white/5 pointer-events-none" />
        <div className="absolute h-full w-[1px] bg-white/5 pointer-events-none" />

        {/* Scanning Target Dot (Simulation Vets Visualized) */}
        <div className="absolute top-1/4 left-1/3 w-2.5 h-2.5 rounded-full bg-brand-primary animate-pulse shadow-[0_0_8px_var(--color-brand-primary)]" />
        <div className="absolute bottom-1/3 right-1/4 w-2 h-2 rounded-full bg-brand-accent animate-pulse shadow-[0_0_8px_var(--color-brand-accent)]" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 rounded-full bg-brand-secondary animate-pulse shadow-[0_0_6px_var(--color-brand-secondary)]" style={{ animationDelay: "1.2s" }} />

        {/* Center Node (User Location Pointer) */}
        <div className="relative z-10 flex items-center justify-center w-12 h-12 rounded-full bg-brand-primary/10 border-2 border-brand-primary animate-pulse">
          <Compass className={`w-6 h-6 text-brand-primary ${isLocating ? 'animate-spin' : ''}`} />
        </div>
      </div>

      {/* Control / Info Box */}
      <div className="text-center max-w-sm">
        <h2 className="text-xl font-bold tracking-tight mb-2 text-white flex items-center justify-center gap-2">
          <ShieldAlert className="w-5 h-5 text-brand-primary animate-bounce" />
          펫119 골든타임 레이더
        </h2>
        <p className="text-sm text-gray-400 mb-6 leading-relaxed">
          {statusText || "24시간 응급 동물병원을 검색하려면 레이더 스캔을 작동하세요."}
        </p>

        {!isLocating && (
          <button
            onClick={onStartScan}
            className="px-8 py-3.5 rounded-full font-semibold text-white bg-gradient-to-r from-brand-primary to-brand-secondary shadow-[0_0_20px_rgba(255,45,85,0.4)] hover:shadow-[0_0_30px_rgba(255,45,85,0.6)] hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 mx-auto"
          >
            <span>응급 병원 탐색 시작</span>
          </button>
        )}

        {isLocating && (
          <div className="flex items-center justify-center gap-2 text-brand-primary font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-brand-primary animate-ping" />
            <span>GPS 수신 및 스캔 중...</span>
          </div>
        )}
      </div>
    </div>
  );
}
