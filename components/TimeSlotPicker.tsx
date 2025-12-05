'use client';

import { useState } from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
    slots: string[];
    selectedSlot: string | null;
    onSelect: (slot: string) => void;
}

export default function TimeSlotPicker({ slots, selectedSlot, onSelect }: TimeSlotPickerProps) {
    if (!slots || slots.length === 0) {
        return (
            <div className="text-center py-4 text-gray-500 text-sm">
                No time slots available for this date.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
            {slots.map((slot) => (
                <button
                    key={slot}
                    type="button"
                    onClick={() => onSelect(slot)}
                    className={`
            flex items-center justify-center px-3 py-2 text-sm font-medium rounded-lg border transition-all
            ${selectedSlot === slot
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md transform scale-105'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-400 hover:text-blue-600'
                        }
          `}
                >
                    <Clock className={`w-3.5 h-3.5 mr-1.5 ${selectedSlot === slot ? 'text-white' : 'text-gray-400'}`} />
                    {slot}
                </button>
            ))}
        </div>
    );
}
