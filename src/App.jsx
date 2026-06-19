import React, { useState, useEffect } from "react";
import { Settings, ShieldAlert, Navigation, RefreshCw, AlertTriangle, Heart, Award } from "lucide-react";
import RadarScanner from "./components/RadarScanner";
import HospitalCard from "./components/HospitalCard";
import SettingsModal from "./components/SettingsModal";
import { fetchNearbyHospitals } from "./utils/kakaoApi";

export default function App() {
  // Config & API State
  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem("kakao_api_key") || import.meta.env.VITE_KAKAO_REST_API_KEY || "";
  });
  const [useSimulation, setUseSimulation] = useState(() => {
    const saved = localStorage.getItem("kakao_use_simulation");
    // Default to simulation mode if no API key exists, otherwise use saved choice or API
    if (saved !== null) {
      return saved === "true";
    }
    return !apiKey;
  });

  // Location State
  const [currentLocation, setCurrentLocation] = useState(null); // { lat, lng, name: string | null }
  const [presetLocation, setPresetLocation] = useState(null); // Selected from settings modal

  // Search Results & UI State
  const [hospitals, setHospitals] = useState([]);
  const [isLocating, setIsLocating] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchMode, setSearchMode] = useState(null); // 'api' | 'simulation' | 'simulation_error' | etc.
  const [errorMsg, setErrorMsg] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Sync settings to localStorage
  useEffect(() => {
    localStorage.setItem("kakao_use_simulation", useSimulation.toString());
  }, [useSimulation]);

  const saveApiKey = (newKey) => {
    setApiKey(newKey);
    localStorage.setItem("kakao_api_key", newKey);
    // If user saves key, auto-disable simulation unless they explicitly choose it
    if (newKey) {
      setUseSimulation(false);
    }
  };

  const handleSelectPresetLocation = (lat, lng, name) => {
    if (lat === null) {
      setPresetLocation(null);
    } else {
      const selected = { lat, lng, name };
      setPresetLocation(selected);
      // Auto run scan with this preset location
      triggerScan(selected);
    }
  };

  const triggerScan = async (forcedLocation = null) => {
    setIsSearching(true);
    setErrorMsg(null);
    
    // Choose coordinate source: forcedLocation > presetLocation > device GPS
    const activePreset = forcedLocation || presetLocation;

    if (activePreset) {
      // Use preset location
      setCurrentLocation(activePreset);
      await performSearch(activePreset.lat, activePreset.lng);
    } else {
      // Use device GPS via Geolocation API
      setIsLocating(true);
      if (!navigator.geolocation) {
        handleLocateError({ code: 0, message: "브라우저가 위치 정보를 지원하지 않습니다." });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setIsLocating(false);
          const userCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            name: "내 기기 GPS 위치"
          };
          setCurrentLocation(userCoords);
          await performSearch(userCoords.lat, userCoords.lng);
        },
        (error) => {
          setIsLocating(false);
          handleLocateError(error);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    }
  };

  const handleLocateError = async (error) => {
    console.warn("GPS access failed, using gangnam station fallback.", error);
    // Fallback to Gangnam coordinates so the app still works beautifully
    const fallback = {
      lat: 37.4979,
      lng: 127.0276,
      name: "서울 강남역 (위치 권한 오류로 임시 대체)"
    };
    setCurrentLocation(fallback);
    
    let notice = "내 기기 GPS 수신이 불가능하여 강남역 기준으로 24시 동물병원을 검색합니다.";
    if (error.code === 1) {
      notice = "위치 권한이 거부되어 테스트용 위치(서울 강남역) 기준으로 24시 동물병원을 검색합니다.";
    }
    
    setErrorMsg(notice);
    await performSearch(fallback.lat, fallback.lng);
  };

  const performSearch = async (lat, lng) => {
    setIsSearching(true);
    // Fetch nearby hospitals (Kakao Local API search keyword '24시 동물병원', 10km radius)
    const result = await fetchNearbyHospitals(lat, lng, useSimulation ? null : apiKey);
    
    // Limit to 3~5 results as requested
    const cappedHospitals = result.hospitals.slice(0, 5);
    setHospitals(cappedHospitals);
    setSearchMode(result.mode);
    setIsSearching(false);
    setHasSearched(true);
  };

  const resetRadar = () => {
    setHasSearched(false);
    setHospitals([]);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen flex flex-col max-w-lg mx-auto bg-bg-dark/80 relative shadow-[0_0_80px_rgba(0,0,0,0.8)] border-x border-white/5">
      
      {/* Top Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-white/5 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2" onClick={resetRadar} role="button">
          <div className="w-8 h-8 rounded-xl bg-brand-primary flex items-center justify-center shadow-[0_0_12px_rgba(255,45,85,0.4)]">
            <ShieldAlert className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <span className="font-extrabold text-sm tracking-tight text-white flex items-center gap-1">
              PET119 <span className="text-[10px] text-brand-primary bg-brand-primary/15 px-1.5 py-0.2 rounded-full border border-brand-primary/20">응급</span>
            </span>
            <p className="text-[9px] text-gray-400">24시 동물병원 실시간 레이더</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Mode indicator badge */}
          {hasSearched && (
            <span className={`text-[10px] font-semibold px-2 py-0.8 rounded-full border ${
              searchMode === "api"
                ? "bg-brand-accent/10 text-brand-accent border-brand-accent/20"
                : "bg-brand-secondary/10 text-brand-secondary border-brand-secondary/20"
            }`}>
              {searchMode === "api" ? "실시간 레이더" : "시뮬레이션"}
            </span>
          )}
          
          <button
            onClick={() => setSettingsOpen(true)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all border border-white/5 active:scale-95"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 px-4 py-6 flex flex-col justify-center">
        
        {!hasSearched ? (
          /* SCANNING RADAR PAGE (Initial State) */
          <RadarScanner
            statusText={
              isLocating 
                ? "GPS 위치 위경도를 획득하는 중..."
                : isSearching
                  ? "반경 10km 이내의 24시 응급 동물병원을 탐색 중..."
                  : presetLocation
                    ? `가상 설정 위치: ${presetLocation.name} 주변 탐색 대기 중`
                    : "반경 10km 이내 24시 병원 정보를 거리순으로 조회합니다."
            }
            onStartScan={() => triggerScan()}
            isLocating={isLocating || isSearching}
          />
        ) : (
          /* RESULTS LISTING PAGE */
          <div className="space-y-5 flex-1 flex flex-col justify-start">
            
            {/* Search metadata banner */}
            <div className="glass-panel rounded-2xl p-4 border border-white/5">
              <div className="flex items-start gap-2.5">
                <Navigation className="w-4 h-4 text-brand-primary shrink-0 mt-0.5 animate-bounce" />
                <div className="text-xs text-left">
                  <div className="text-gray-400">기준 위치</div>
                  <div className="font-semibold text-white truncate max-w-[280px]">
                    {currentLocation?.name || "기기 위경도"}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-0.5">
                    ({currentLocation?.lat?.toFixed(5)}, {currentLocation?.lng?.toFixed(5)})
                  </div>
                </div>
              </div>

              {/* Mode Specific warning */}
              {searchMode !== "api" && (
                <div className="mt-3 pt-3 border-t border-white/5 flex items-center gap-1.5 text-[10px] text-brand-secondary font-medium">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>시뮬레이션 모드로 가상의 24H 병원 데이터를 표시하고 있습니다.</span>
                </div>
              )}
            </div>

            {/* Error notifications */}
            {errorMsg && (
              <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-3 text-left">
                <p className="text-xs text-amber-300 leading-normal flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </p>
              </div>
            )}

            {/* Hospital cards container */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  반경 10km 거리순 병원 ({hospitals.length}곳)
                </span>
                
                <button
                  onClick={() => triggerScan()}
                  disabled={isSearching}
                  className="inline-flex items-center gap-1 text-xs text-brand-accent font-semibold hover:underline"
                >
                  <RefreshCw className={`w-3 h-3 ${isSearching ? "animate-spin" : ""}`} />
                  재검색
                </button>
              </div>

              {hospitals.length === 0 ? (
                <div className="glass-panel rounded-2xl py-12 px-4 text-center">
                  <p className="text-sm text-gray-400">10km 이내에 조회 가능한 24시 동물병원이 없습니다.</p>
                  <button
                    onClick={resetRadar}
                    className="mt-4 text-xs font-semibold text-brand-primary underline"
                  >
                    레이더 다시 켜기
                  </button>
                </div>
              ) : (
                hospitals.map((hospital, idx) => (
                  <HospitalCard
                    key={hospital.id}
                    hospital={hospital}
                    index={idx}
                    currentLocation={currentLocation}
                  />
                ))
              )}
            </div>

            {/* Back button */}
            <button
              onClick={resetRadar}
              className="w-full py-3 bg-white/5 hover:bg-white/10 active:bg-white/12 border border-white/5 rounded-2xl text-xs font-semibold text-gray-300 transition-colors"
            >
              레이더 메인으로 돌아가기
            </button>
          </div>
        )}
      </main>

      {/* Safety Instructions & Disclaimer Bar */}
      <footer className="px-4 py-5 border-t border-white/5 text-center bg-black/10">
        <div className="flex items-center justify-center gap-1 text-[10px] text-gray-500 font-semibold mb-1">
          <Heart className="w-3.5 h-3.5 text-brand-primary fill-brand-primary" />
          반려동물의 생명을 지키는 골든타임 10분
        </div>
        <p className="text-[9px] text-gray-500 leading-normal max-w-xs mx-auto">
          본 레이더 앱은 야간/공휴일 등 응급상황을 보조하기 위한 참고용 데이터이며, 방문 전에 반드시 유선 통화로 진료 여부를 재확인하시길 권장합니다.
        </p>
      </footer>

      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSaveApiKey={saveApiKey}
        useSimulation={useSimulation}
        onToggleSimulation={setUseSimulation}
        customLocation={presetLocation}
        onSelectPresetLocation={handleSelectPresetLocation}
      />
    </div>
  );
}
