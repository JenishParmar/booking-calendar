"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";

interface DateInfo {
  date: number;
  price: number;
  available: boolean;
}

interface SelectedDate {
  date: number;
  price: number;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  speed: number;
}

const BookingCalendar: React.FC = () => {
  const calendarData: DateInfo[] = [
    { date: 1, price: 20, available: true },
    { date: 2, price: 10, available: true },
    { date: 3, price: 10, available: true },
    { date: 4, price: 10, available: true },
    { date: 5, price: 10, available: true },
    { date: 6, price: 0, available: false },
    { date: 7, price: 0, available: false },
    { date: 8, price: 20, available: true },
    { date: 9, price: 0, available: false },
    { date: 10, price: 0, available: false },
    { date: 11, price: 10, available: true },
    { date: 12, price: 10, available: true },
    { date: 13, price: 30, available: true },
    { date: 14, price: 40, available: true },
    { date: 15, price: 20, available: true },
    { date: 16, price: 10, available: true },
    { date: 17, price: 10, available: true },
    { date: 18, price: 10, available: true },
    { date: 19, price: 0, available: false },
    { date: 20, price: 0, available: false },
    { date: 21, price: 40, available: true },
    { date: 22, price: 20, available: true },
    { date: 23, price: 10, available: true },
    { date: 24, price: 10, available: true },
    { date: 25, price: 10, available: true },
    { date: 26, price: 10, available: true },
    { date: 27, price: 30, available: true },
    { date: 28, price: 0, available: false },
    { date: 29, price: 0, available: false },
    { date: 30, price: 10, available: true },
  ];

  const [selectedDates, setSelectedDates] = useState<SelectedDate[]>([
    { date: 1, price: 20 },
    { date: 2, price: 10 },
    { date: 3, price: 10 },
    { date: 11, price: 10 },
    { date: 12, price: 10 },
    { date: 13, price: 30 },
    { date: 21, price: 40 },
    { date: 22, price: 20 },
  ]);

  const [animatingDate, setAnimatingDate] = useState<number | null>(null);
  const [priceAnimation, setPriceAnimation] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  const firstDayOfMonth = 1;

  // Initialize particles
  useEffect(() => {
    const initialParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      opacity: Math.random() * 0.5 + 0.1,
      speed: Math.random() * 2 + 0.5,
    }));
    setParticles(initialParticles);
    setIsLoaded(true);
  }, []);

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          opacity:
            particle.y < 0 ? Math.random() * 0.5 + 0.1 : particle.opacity,
          // y: particle.y < 0 ? window.innerHeight : particle.y,
        }))
      );
    };

    const interval = setInterval(animateParticles, 50);
    return () => clearInterval(interval);
  }, []);

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const { totalNights, totalPrice } = useMemo(() => {
    const nights = selectedDates.length;
    const price = selectedDates.reduce((sum, date) => sum + date.price, 0);
    return { totalNights: nights, totalPrice: price };
  }, [selectedDates]);

  const handleDateClick = (dateInfo: DateInfo) => {
    if (!dateInfo.available) return;

    setAnimatingDate(dateInfo.date);
    setPriceAnimation(true);

    // Create explosion effect
    const newParticles: Particle[] = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: mousePosition.x + (Math.random() - 0.5) * 100,
      y: mousePosition.y + (Math.random() - 0.5) * 100,
      size: Math.random() * 6 + 3,
      opacity: 1,
      speed: Math.random() * 3 + 2,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    setTimeout(() => {
      const isSelected = selectedDates.some(
        (selected) => selected.date === dateInfo.date
      );

      if (isSelected) {
        setSelectedDates((prev) =>
          prev.filter((selected) => selected.date !== dateInfo.date)
        );
      } else {
        setSelectedDates((prev) => [
          ...prev,
          { date: dateInfo.date, price: dateInfo.price },
        ]);
      }

      setAnimatingDate(null);
    }, 200);

    setTimeout(() => {
      setPriceAnimation(false);
      // Remove explosion particles
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 800);
  };

  const isDateSelected = (date: number): boolean => {
    return selectedDates.some((selected) => selected.date === date);
  };

  const renderCalendarGrid = () => {
    const grid = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      grid.push(<div key={`empty-${i}`} className="h-16 sm:h-18"></div>);
    }

    calendarData.forEach((dateInfo) => {
      const isSelected = isDateSelected(dateInfo.date);
      const isAvailable = dateInfo.available;
      const isAnimating = animatingDate === dateInfo.date;

      grid.push(
        <div
          key={dateInfo.date}
          onClick={() => handleDateClick(dateInfo)}
          className={`
            h-16 sm:h-18 flex flex-col items-center justify-center text-xs sm:text-sm
            border border-gray-200 relative overflow-hidden
            transition-all duration-500 ease-out transform
            ${isAvailable ? "cursor-pointer" : "cursor-not-allowed"}
            ${isAnimating ? "scale-125 z-20 rotate-12" : "scale-100 rotate-0"}
            ${
              isSelected
                ? "bg-gradient-to-br from-[#be83bf] via-[#d299d3] to-[#be83bf] text-white shadow-2xl border-[#be83bf] animate-pulse-glow"
                : isAvailable
                ? "bg-white text-gray-900 hover:bg-gradient-to-br hover:from-[#be83bf]/10 hover:to-[#be83bf]/20 hover:border-[#be83bf]/50 hover:shadow-xl hover:scale-110 hover:-rotate-2"
                : "bg-gray-100 text-gray-400"
            }
          `}
          style={{
            animationDelay: `${dateInfo.date * 50}ms`,
          }}
        >
          {/* Multiple ripple effects */}
          {isAnimating && (
            <>
              <div className="absolute inset-0 bg-[#be83bf] opacity-40 animate-ping rounded-full"></div>
              <div className="absolute inset-0 bg-[#be83bf] opacity-20 animate-ping rounded-full animation-delay-200"></div>
              <div className="absolute inset-0 bg-[#be83bf] opacity-10 animate-ping rounded-full animation-delay-400"></div>
            </>
          )}
          {/* Enhanced sparkle effects for selected dates */}
          {isSelected && (
            <>
              <div className="absolute top-1 right-1 w-2 h-2 bg-white rounded-full animate-bounce"></div>
              <div className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
              <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full animate-ping delay-500"></div>
              <div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full animate-bounce delay-700"></div>
              {/* Floating hearts */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-white opacity-20 animate-float text-xs">
                  ♥
                </div>
              </div>
            </>
          )}
          {/* Morphing number */}
          <span
            className={`font-bold transition-all duration-300 ${
              isAnimating ? "scale-150 rotate-180" : "scale-100 rotate-0"
            }`}
          >
            {dateInfo.date}
          </span>
          {/* Animated price */}
          {isAvailable && (
            <span
              className={`text-xs transition-all duration-300 ${
                isSelected ? "" : "text-gray-600"
              } ${isAnimating ? "scale-125 rotate-12" : "scale-100"}`}
            >
              ${dateInfo.price}
            </span>
          )}
          {!isAvailable && (
            <span className="text-xs text-gray-400 animate-pulse">--</span>
          )}
          {/* Hover glow effect with multiple layers */}
          {isAvailable && !isSelected && (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#be83bf] to-[#d299d3] opacity-0 hover:opacity-15 transition-all duration-500 rounded-lg"></div>
              <div className="absolute inset-0 bg-[#be83bf] opacity-0 hover:opacity-5 transition-all duration-300 blur-sm"></div>
            </>
          )}
          {/* Border animation for available dates */}
          {isAvailable && (
            <div className="absolute inset-0 border-2 border-transparent hover:border-[#be83bf]/30 transition-all duration-300 rounded-lg animate-border-dance"></div>
          )}
        </div>
      );
    });

    return grid;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#be83bf] via-[#d299d3] to-[#be83bf] p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
            style={{
              left: `${particle.x}px`,
              top: `${particle.y}px`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              opacity: particle.opacity,
              animation: `twinkle 2s ease-in-out infinite, float 4s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white opacity-10 rounded-full animate-pulse-slow"></div>
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-white opacity-5 rounded-full animate-spin-slow"></div>
        <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white opacity-8 rounded-full animate-float"></div>
        <div className="absolute top-1/4 right-1/3 w-24 h-24 bg-white opacity-6 rounded-full animate-bounce-slow"></div>
        <div className="absolute bottom-1/3 left-1/2 w-40 h-40 bg-white opacity-4 rounded-full animate-wiggle"></div>
      </div>

      <div
        className={`max-w-6xl mx-auto relative z-10 ${
          isLoaded ? "animate-fade-in-up" : "opacity-0"
        }`}
      >
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Enhanced left side */}
          <div className="text-white space-y-8">
            <div className="flex items-center space-x-4 animate-slide-in-left">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white bg-opacity-20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-2xl animate-float hover:animate-wiggle transition-all duration-300">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white animate-pulse-glow"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="animate-slide-in-left animation-delay-200">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white via-pink-100 to-white bg-clip-text text-transparent animate-gradient-x">
                  Booking Calendar
                </span>
                <br />
                <span className="text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-pink-100 via-white to-pink-100 bg-clip-text text-transparent animate-gradient-x animation-delay-500">
                  + Pricing
                </span>
              </h1>

              <p className="text-xl sm:text-2xl text-pink-100 max-w-lg leading-relaxed animate-typewriter">
                Click on dates to add to or subtract from the total price and
                number of nights.
              </p>
            </div>

            {/* Enhanced user info with more animations */}
            <div className="flex items-center space-x-4 pt-8 animate-slide-in-left animation-delay-400">
              <div className="w-14 h-14 bg-gradient-to-br from-white to-pink-100 bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white border-opacity-30 shadow-xl animate-bounce-slow hover:animate-spin-slow transition-all duration-500">
                <span className="text-lg font-black text-white animate-pulse">
                  NG
                </span>
              </div>
              <div>
                <p className="font-bold text-xl animate-fade-in-up">
                  Nate Greenwall
                </p>
                <p className="text-sm text-pink-100 opacity-90 animate-fade-in-up animation-delay-100">
                  User Experience Partner
                </p>
                <p className="text-sm text-pink-100 opacity-90 animate-fade-in-up animation-delay-200">
                  Community Portal
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced calendar widget */}
          <div className="animation-delay-300">
            <div className="bg-white rounded-[2rem] shadow-2xl p-10 sm:p-12 max-w-md mx-auto w-full backdrop-blur-sm border border-white border-opacity-50 relative overflow-hidden hover:shadow-[0_0_50px_rgba(190,131,191,0.3)] transition-all duration-500 animate-float-slow">
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#be83bf]/5 via-white to-[#be83bf]/10 opacity-50"></div>

              <div className="relative z-10">
                <div className="text-center mb-10">
                  <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-4 bg-gradient-to-r from-[#be83bf] to-[#d299d3] bg-clip-text text-transparent animate-gradient-x">
                    Online Booking
                  </h2>
                  <p className="text-sm font-bold text-gray-600 tracking-[0.3em] uppercase animate-fade-in-up">
                    April 2024
                  </p>
                </div>

                {/* Enhanced days of week header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {daysOfWeek.map((day, index) => (
                    <div
                      key={day}
                      className="h-12 flex items-center justify-center animate-slide-in-down hover:animate-bounce transition-all duration-300"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <span className="text-sm font-black text-gray-700 hover:text-[#be83bf] transition-colors duration-300">
                        {day}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Enhanced calendar grid */}
                <div className="grid grid-cols-7 gap-1 mb-10">
                  {renderCalendarGrid()}
                </div>

                {/* Ultra enhanced summary */}
                <div className="border-t-2 border-gradient-to-r from-[#be83bf]/20 to-transparent pt-8">
                  <div className="flex justify-between items-center">
                    <div className="animate-slide-in-left">
                      <p className="text-sm text-gray-600 mb-1 font-semibold animate-fade-in-up">
                        Select Dates To
                      </p>
                      <p className="text-sm text-gray-600 font-semibold animate-fade-in-up animation-delay-100">
                        See Total Cost
                      </p>
                    </div>
                    <div className="text-right animate-slide-in-right">
                      <p className="text-sm text-gray-600 mb-2 font-semibold animate-fade-in-up">
                        Total for{" "}
                        <span className="font-black text-[#be83bf] animate-pulse">
                          {totalNights} night{totalNights !== 1 ? "s" : ""}
                        </span>
                      </p>
                      <p
                        className={`text-4xl sm:text-5xl font-black bg-gradient-to-r from-[#be83bf] to-[#d299d3] bg-clip-text text-transparent transition-all duration-700 animate-gradient-x ${
                          priceAnimation
                            ? "scale-125 animate-bounce"
                            : "scale-100"
                        }`}
                      >
                        ${totalPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCalendar;
