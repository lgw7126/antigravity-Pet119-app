import React from "react";
import { Phone, Car, MapPin, ExternalLink, Clock } from "lucide-react";
import { formatDistance } from "../utils/kakaoApi";

export default function HospitalCard({ hospital, index, currentLocation }) {
  const distanceStr = formatDistance(hospital.distance / 1000);

  // Determine estimated travel time by car (approx. 40km/h in city including traffic)
  const estTimeMin = Math.max(2, Math.round((hospital.distance / 1000) * 2.5));

  const handleCall = (e) => {
    e.stopPropagation();
    if (!hospital.phone) {
      alert("등록된 전화번호가 없습니다.");
      return;
    }
    window.location.href = `tel:${hospital.phone}`;
  };

  const handleKakaoTCall = (e) => {
    e.stopPropagation();
    const destName = hospital.place_name;
    const destLat = hospital.y;
    const destLng = hospital.x;
    
    let startName = "내위치";
    let startLat = currentLocation?.lat;
    let startLng = currentLocation?.lng;
    
    if (currentLocation) {
      if (currentLocation.name && 
          currentLocation.name !== "내 기기 GPS 위치" && 
          !currentLocation.name.includes("오류") &&
          !currentLocation.name.includes("임시")) {
        startName = currentLocation.name;
      }
    }

    const encStartName = encodeURIComponent(startName);
    const encDestName = encodeURIComponent(destName);
    
    // 모바일 환경 체크
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    
    if (isMobile && startLat && startLng) {
      // 1. 모바일 앱 호출: 출발지/도착지 좌표 및 명칭을 함께 던져 바로 앱에서 계산되도록 유도
      const appUrl = `kakaomap://route?sp=${startLat},${startLng}&sn=${encStartName}&ep=${destLat},${destLng}&en=${encDestName}&by=CAR`;
      window.location.href = appUrl;
      
      // 2. 모바일 앱 미설치 시: 모바일 웹 길찾기 페이지로 연동 (명칭 파라미터 sn, en 추가로 이름 깨짐 방지)
      const mobileWebFallback = `https://m.map.kakao.com/scheme/route?sp=${startLat},${startLng}&sn=${encStartName}&ep=${destLat},${destLng}&en=${encDestName}&by=CAR`;
      
      const start = Date.now();
      setTimeout(() => {
        if (Date.now() - start < 2200) {
          window.open(mobileWebFallback, "_blank");
        }
      }, 1800);
    } else {
      // 3. PC/데스크톱 웹 환경:
      // 모바일 웹 길찾기 주소에 출발지(sp, sn)와 도착지(ep, en) 위경도 및 명칭을 모두 넣어 열면,
      // 카카오맵 서버가 자동으로 좌표계를 변환하고 이름 매핑을 유지한 채 PC 버전 길찾기 화면으로 전환해 줍니다!
      if (startLat && startLng) {
        const mapRouteUrl = `https://m.map.kakao.com/scheme/route?sp=${startLat},${startLng}&sn=${encStartName}&ep=${destLat},${destLng}&en=${encDestName}&by=CAR`;
        window.open(mapRouteUrl, "_blank");
      } else {
        const mapRouteUrl = `https://map.kakao.com/link/to/${encDestName},${destLat},${destLng}`;
        window.open(mapRouteUrl, "_blank");
      }
    }
  };



  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-5 mb-4 text-left relative overflow-hidden shadow-lg border border-white/5 animate-fade-in">
      {/* Index Badge & 24h Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-primary/20 text-brand-primary text-xs font-bold">
            {index + 1}
          </span>
          <h3 className="text-lg font-bold text-white tracking-tight leading-tight">
            {hospital.place_name}
          </h3>
        </div>
        <span className="flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <Clock className="w-3 h-3 animate-pulse" />
          24시 응급
        </span>
      </div>

      {/* Address & Distance */}
      <div className="space-y-2 mb-5">
        <div className="flex items-start gap-2 text-sm text-gray-300">
          <MapPin className="w-4 h-4 text-brand-secondary shrink-0 mt-0.5" />
          <span>{hospital.road_address_name}</span>
        </div>
        
        {/* Distance + Time Estimator */}
        <div className="flex items-center gap-3 text-xs">
          <span className="font-semibold text-brand-accent bg-brand-accent/10 px-2 py-0.5 rounded">
            거리: {distanceStr}
          </span>
          <span className="text-gray-400">
            차량 이동 약 {estTimeMin}분 소요 예정
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={handleCall}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 shadow-md transition-colors"
        >
          <Phone className="w-4 h-4 animate-pulse" />
          <span>전화하기</span>
        </button>

        <button
          onClick={handleKakaoTCall}
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-semibold text-gray-900 bg-yellow-400 hover:bg-yellow-300 active:bg-yellow-500 shadow-md transition-colors"
        >
          <Car className="w-4 h-4" />
          <span>카카오T 호출</span>
        </button>
      </div>

      {/* KakaoMap Web link (Secondary) */}
      <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
        <a
          href={hospital.place_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-brand-accent transition-colors"
        >
          <span>카카오맵 상세 정보</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
