"use client";
import React from "react";

const DeliveryScooter = () => {
  return (
    <div className="relative inline-block">
      {/* Scooter with Delivery Person */}
      <div className="relative">
        {/* Motion Blur Circles - Behind scooter */}
        <div className="absolute -z-10 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="motion-blur-circle circle-1"></div>
          <div className="motion-blur-circle circle-2"></div>
          <div className="motion-blur-circle circle-3"></div>
        </div>

        {/* Smoke Animation - from exhaust */}
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 translate-x-8 z-20">
          <div className="smoke-container">
            <div className="smoke smoke-1"></div>
            <div className="smoke smoke-2"></div>
            <div className="smoke smoke-3"></div>
            <div className="smoke smoke-4"></div>
          </div>
        </div>

        {/* Delivery Person with Scooter - Vespa Style */}
        <svg
          width="140"
          height="120"
          viewBox="0 0 140 120"
          className="relative z-10 w-24 h-20 sm:w-28 sm:h-24 md:w-32 md:h-28 lg:w-36 lg:h-32"
        >
          {/* Scooter Body - Teal/Turquoise Vespa Style */}
          <g id="scooter">
            {/* Main Body - Rounded Vespa Style */}
            <ellipse
              cx="70"
              cy="65"
              rx="35"
              ry="20"
              fill="#14B8A6"
              stroke="#0D9488"
              strokeWidth="2"
            />
            {/* Body Shading */}
            <ellipse
              cx="70"
              cy="65"
              rx="30"
              ry="18"
              fill="#2DD4BF"
              opacity="0.4"
            />
            
            {/* Front Section */}
            <ellipse
              cx="40"
              cy="60"
              rx="12"
              ry="15"
              fill="#14B8A6"
              stroke="#0D9488"
              strokeWidth="1.5"
            />
            
            {/* Yellow Headlight */}
            <circle
              cx="32"
              cy="55"
              r="4"
              fill="#FCD34D"
              stroke="#F59E0B"
              strokeWidth="1"
            />
            <circle
              cx="32"
              cy="55"
              r="2"
              fill="#FEF3C7"
            />
            
            {/* Front Wheel */}
            <circle
              cx="35"
              cy="85"
              r="14"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="2"
            />
            <circle
              cx="35"
              cy="85"
              r="11"
              fill="#14B8A6"
              stroke="#0D9488"
              strokeWidth="1.5"
            />
            <circle
              cx="35"
              cy="85"
              r="7"
              fill="#1F2937"
            />
            {/* White tire outline */}
            <circle
              cx="35"
              cy="85"
              r="14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Back Wheel */}
            <circle
              cx="90"
              cy="85"
              r="14"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="2"
            />
            <circle
              cx="90"
              cy="85"
              r="11"
              fill="#14B8A6"
              stroke="#0D9488"
              strokeWidth="1.5"
            />
            <circle
              cx="90"
              cy="85"
              r="7"
              fill="#1F2937"
            />
            {/* White tire outline */}
            <circle
              cx="90"
              cy="85"
              r="14"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="1"
              opacity="0.8"
            />
            
            {/* Handlebar */}
            <line
              x1="40"
              y1="60"
              x2="25"
              y2="40"
              stroke="#0D9488"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1="25"
              y1="40"
              x2="18"
              y2="35"
              stroke="#0D9488"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="25"
              y1="40"
              x2="32"
              y2="35"
              stroke="#0D9488"
              strokeWidth="3"
              strokeLinecap="round"
            />
            
            {/* Black Seat */}
            <ellipse
              cx="70"
              cy="55"
              rx="18"
              ry="10"
              fill="#1F2937"
              stroke="#111827"
              strokeWidth="1.5"
            />
            
            {/* Footrest */}
            <rect
              x="50"
              y="70"
              width="10"
              height="4"
              rx="2"
              fill="#0D9488"
            />
            <rect
              x="75"
              y="70"
              width="10"
              height="4"
              rx="2"
              fill="#0D9488"
            />
            
            {/* Exhaust Pipe (for smoke) */}
            <rect
              x="95"
              y="70"
              width="6"
              height="8"
              rx="1"
              fill="#374151"
            />
          </g>

          {/* Delivery Person */}
          <g id="person">
            {/* White Top */}
            <ellipse
              cx="70"
              cy="45"
              rx="10"
              ry="14"
              fill="#FFFFFF"
              stroke="#E5E7EB"
              strokeWidth="0.5"
            />
            
            {/* Yellow Arms/Hands - holding handlebars */}
            <ellipse
              cx="58"
              cy="43"
              rx="4"
              ry="10"
              fill="#FCD34D"
              transform="rotate(-25 58 43)"
            />
            <ellipse
              cx="82"
              cy="43"
              rx="4"
              ry="10"
              fill="#FCD34D"
              transform="rotate(25 82 43)"
            />
            
            {/* Teal Trousers - matching scooter */}
            <ellipse
              cx="65"
              cy="58"
              rx="4"
              ry="10"
              fill="#14B8A6"
            />
            <ellipse
              cx="75"
              cy="58"
              rx="4"
              ry="10"
              fill="#14B8A6"
            />
            
            {/* Head */}
            <circle
              cx="70"
              cy="28"
              r="11"
              fill="#FED7AA"
            />
            
            {/* Light Blue Helmet */}
            <ellipse
              cx="70"
              cy="28"
              rx="11"
              ry="9"
              fill="#60A5FA"
              stroke="#3B82F6"
              strokeWidth="1.5"
            />
            {/* Helmet Top */}
            <path
              d="M 59 28 Q 70 20 81 28"
              fill="#3B82F6"
            />
            {/* Clear Visor */}
            <ellipse
              cx="70"
              cy="30"
              rx="9"
              ry="5"
              fill="#E0F2FE"
              opacity="0.7"
            />
            <path
              d="M 61 30 Q 70 33 79 30"
              stroke="#93C5FD"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* Yellow Delivery Box on Back */}
          <rect
            x="80"
            y="35"
            width="16"
            height="18"
            rx="2"
            fill="#FCD34D"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          {/* Box Details */}
          <line
            x1="82"
            y1="40"
            x2="94"
            y2="40"
            stroke="#F59E0B"
            strokeWidth="0.8"
          />
          <line
            x1="82"
            y1="45"
            x2="94"
            y2="45"
            stroke="#F59E0B"
            strokeWidth="0.8"
          />
          <line
            x1="82"
            y1="50"
            x2="94"
            y2="50"
            stroke="#F59E0B"
            strokeWidth="0.8"
          />
        </svg>
      </div>

      <style jsx>{`
        /* Motion Blur Circles - Light Purple/White */
        .motion-blur-circle {
          position: absolute;
          border-radius: 50%;
          filter: blur(8px);
          opacity: 0.6;
          animation: motion-pulse 2s ease-in-out infinite;
        }

        .circle-1 {
          width: 40px;
          height: 40px;
          background: rgba(196, 181, 253, 0.5);
          left: -20px;
          top: -20px;
          animation-delay: 0s;
        }

        .circle-2 {
          width: 30px;
          height: 30px;
          background: rgba(221, 214, 254, 0.6);
          left: 10px;
          top: -15px;
          animation-delay: 0.7s;
        }

        .circle-3 {
          width: 25px;
          height: 25px;
          background: rgba(255, 255, 255, 0.4);
          left: -10px;
          top: 5px;
          animation-delay: 1.4s;
        }

        @keyframes motion-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.6;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.4;
          }
        }

        .smoke-container {
          position: relative;
          width: 30px;
          height: 40px;
        }

        .smoke {
          position: absolute;
          width: 6px;
          height: 6px;
          background: rgba(180, 180, 180, 0.7);
          border-radius: 50%;
          animation: smoke-float 2.5s infinite ease-out;
        }

        .smoke-1 {
          left: 5px;
          animation-delay: 0s;
        }

        .smoke-2 {
          left: 10px;
          animation-delay: 0.4s;
        }

        .smoke-3 {
          left: 15px;
          animation-delay: 0.8s;
        }

        .smoke-4 {
          left: 20px;
          animation-delay: 1.2s;
        }

        @keyframes smoke-float {
          0% {
            opacity: 0.8;
            transform: translateY(0) translateX(0) scale(1);
          }
          50% {
            opacity: 0.5;
            transform: translateY(-12px) translateX(3px) scale(1.3);
          }
          100% {
            opacity: 0;
            transform: translateY(-25px) translateX(6px) scale(1.8);
          }
        }

        /* Scooter Bounce Animation */
        #scooter {
          animation: scooter-bounce 2s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes scooter-bounce {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-1px) rotate(0.5deg);
          }
        }

        /* Person Slight Movement */
        #person {
          animation: person-sway 3s ease-in-out infinite;
          transform-origin: center bottom;
        }

        @keyframes person-sway {
          0%, 100% {
            transform: translateX(0) rotate(0deg);
          }
          50% {
            transform: translateX(0.5px) rotate(0.3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DeliveryScooter;
