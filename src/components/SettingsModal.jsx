import React, { useState } from "react";
import { X, Key, ShieldCheck, HelpCircle, MapPin, Eye, EyeOff } from "lucide-react";

const PRESET_LOCATIONS = [
  { name: "서울 강남역", lat: 37.4979, lng: 127.0276 },
  { name: "서울 마포 홍대입구역", lat: 37.5569, lng: 126.9239 },
  { name: "서울 중구 서울역", lat: 37.5559, lng: 126.9723 },
  { name: "부산역", lat: 35.1152, lng: 129.0422 },
  { name: "제주국제공항", lat: 33.5104, lng: 126.4913 },
];

export default function SettingsModal({
  isOpen,
  onClose,
  apiKey,
  onSaveApiKey,
  useSimulation,
  onToggleSimulation,
  customLocation,
  onSelectPresetLocation,
}) {
  const [inputKey, setInputKey] = useState(apiKey || "");
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveApiKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      {/* Modal Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-primary" />
            <h2 className="text-lg font-bold text-white">설정 및 API 제어</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Mode Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400">병원 검색 모드</label>
            <div className="grid grid-cols-2 gap-2 bg-white/5 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => onToggleSimulation(false)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  !useSimulation
                    ? "bg-brand-primary text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                실시간 카카오 API
              </button>
              <button
                type="button"
                onClick={() => onToggleSimulation(true)}
                className={`py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  useSimulation
                    ? "bg-brand-primary text-white shadow"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                시뮬레이션 모드
              </button>
            </div>
            <p className="text-[11px] text-gray-400 leading-normal mt-1">
              {!useSimulation 
                ? "실제 사용자 위치 근처의 24시 동물병원 실시간 정보(카카오 Local API)를 노출합니다."
                : "API 키 없이도 앱의 동작(거리 계산, 통화, 택시 딥링크 등)을 테스트할 수 있는 가상 데이터를 노출합니다."}
            </p>
          </div>

          {/* API Key Input (only relevant/editable if not forcing simulation, but good to save anytime) */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400">카카오 REST API 키</label>
              <a 
                href="https://developers.kakao.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] text-brand-accent hover:underline flex items-center gap-0.5"
              >
                키 발급 안내 <HelpCircle className="w-3 h-3" />
              </a>
            </div>
            
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                placeholder="Kakao REST API Key를 입력하세요"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-10 text-sm text-white focus:outline-none focus:border-brand-primary transition-colors placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
              >
                {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Preset Location Test (when Geolocation is failed/simulated) */}
          <div className="space-y-3 pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-brand-secondary" />
              테스트 가상 위치 설정
            </label>
            <p className="text-[11px] text-gray-400 leading-normal">
              GPS 작동이 원활하지 않은 기기나 PC 웹브라우저에서 특정 위치를 기준으로 24시 병원 조회를 시뮬레이션할 수 있습니다.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {PRESET_LOCATIONS.map((loc) => {
                const isSelected = 
                  customLocation && 
                  Math.abs(customLocation.lat - loc.lat) < 0.0001 &&
                  Math.abs(customLocation.lng - loc.lng) < 0.0001;

                return (
                  <button
                    key={loc.name}
                    type="button"
                    onClick={() => onSelectPresetLocation(loc.lat, loc.lng, loc.name)}
                    className={`py-2 px-3 rounded-xl border text-xs text-left transition-all ${
                      isSelected
                        ? "border-brand-secondary bg-brand-secondary/10 text-brand-secondary font-medium"
                        : "border-white/5 bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {loc.name}
                  </button>
                );
              })}
            </div>
            
            {customLocation && (
              <div className="text-[11px] text-brand-secondary bg-brand-secondary/5 border border-brand-secondary/20 rounded-xl p-2.5 flex items-center justify-between">
                <span>기준 위치: <strong>{customLocation.name}</strong></span>
                <button 
                  onClick={() => onSelectPresetLocation(null, null, null)}
                  className="text-gray-400 hover:text-white underline font-semibold"
                >
                  기기 GPS 사용
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white/2 flex gap-3 border-t border-white/5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-300 border border-white/10 hover:bg-white/5 transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white bg-brand-primary shadow-lg hover:shadow-[0_0_15px_rgba(255,45,85,0.4)] transition-all"
          >
            저장 및 적용
          </button>
        </div>
      </div>
    </div>
  );
}
