import { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { DayContentProps } from 'react-day-picker';
import { motion } from 'framer-motion';

interface EnhancedCalendarProps {
  mode: 'single';
  selected: Date | undefined;
  onSelect: (date: Date | undefined) => void;
  className?: string;
  disabled?: (date: Date) => boolean;
}

interface DayBookingInfo {
  date: string;
  bookedSlots: number;
  totalSlots: number;
}

const TOTAL_SLOTS_PER_DAY = 13; // 9 AM to 9 PM (13 slots)

export default function EnhancedCalendar({
  mode,
  selected,
  onSelect,
  className,
  disabled
}: EnhancedCalendarProps) {
  const [bookingInfo, setBookingInfo] = useState<Map<string, DayBookingInfo>>(new Map());

  useEffect(() => {
    loadBookingData();
  }, []);

  const loadBookingData = () => {
    const stored = localStorage.getItem('shokha_bookings');
    if (!stored) {
      setBookingInfo(new Map());
      return;
    }

    try {
      const bookings = JSON.parse(stored);
      const infoMap = new Map<string, DayBookingInfo>();

      // Group bookings by date
      bookings.forEach((booking: any) => {
        if (booking.status !== 'rejected') {
          const bookingDate = new Date(booking.date);
          const dateStr = bookingDate.toDateString();

          const existing = infoMap.get(dateStr) || {
            date: dateStr,
            bookedSlots: 0,
            totalSlots: TOTAL_SLOTS_PER_DAY
          };

          existing.bookedSlots += 1;
          infoMap.set(dateStr, existing);
        }
      });

      setBookingInfo(infoMap);
    } catch (error) {
      console.error('Error loading booking data:', error);
      setBookingInfo(new Map());
    }
  };

  const getDayStatus = (date: Date): 'available' | 'partial' | 'full' => {
    const dateStr = date.toDateString();
    const info = bookingInfo.get(dateStr);

    if (!info || info.bookedSlots === 0) return 'available';
    if (info.bookedSlots >= info.totalSlots) return 'full';
    return 'partial';
  };

  const getAvailableSlots = (date: Date): number => {
    const dateStr = date.toDateString();
    const info = bookingInfo.get(dateStr);
    if (!info) return TOTAL_SLOTS_PER_DAY;
    return info.totalSlots - info.bookedSlots;
  };

  const customDayContent = (props: DayContentProps) => {
    const { date } = props;
    const status = getDayStatus(date);
    const availableSlots = getAvailableSlots(date);
    const isToday = date.toDateString() === new Date().toDateString();
    const isPast = date < new Date() && !isToday;
    const isSelected = selected?.toDateString() === date.toDateString();

    if (isPast) {
      return (
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-gray-600">{date.getDate()}</span>
        </div>
      );
    }

    return (
      <motion.div
        whileHover={{ scale: status === 'full' ? 1 : 1.1 }}
        className="relative w-full h-full flex flex-col items-center justify-center gap-0.5"
      >
        <span className={`text-sm font-medium ${
          isSelected
            ? 'text-black'
            : status === 'full'
            ? 'text-red-400'
            : isToday
            ? 'text-[#FFD700]'
            : 'text-white'
        }`}>
          {date.getDate()}
        </span>

        {/* Status indicator dots */}
        {status !== 'available' && (
          <div className="flex gap-0.5">
            {status === 'full' ? (
              <div className="w-1 h-1 rounded-full bg-red-500" />
            ) : (
              <>
                <div className="w-1 h-1 rounded-full bg-yellow-500" />
                <div className="w-1 h-1 rounded-full bg-green-500" />
              </>
            )}
          </div>
        )}

        {/* Available slots indicator */}
        {status !== 'available' && !isSelected && (
          <span className={`text-[9px] font-medium ${
            status === 'full' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {availableSlots}/{TOTAL_SLOTS_PER_DAY}
          </span>
        )}

        {/* Fully booked overlay */}
        {status === 'full' && (
          <div className="absolute inset-0 bg-red-500/10 rounded-md border border-red-500/30" />
        )}
      </motion.div>
    );
  };

  return (
    <div className="space-y-4">
      <Calendar
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        className={className}
        disabled={(date) => {
          if (disabled && disabled(date)) return true;
          // Disable fully booked days
          return getDayStatus(date) === 'full';
        }}
        components={{
          DayContent: customDayContent
        }}
      />

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400 px-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-green-500/20 border border-green-500/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          </div>
          <span>Partially Booked</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-sm bg-red-500/20 border border-red-500/50" />
          <span>Fully Booked</span>
        </div>
      </div>
    </div>
  );
}
