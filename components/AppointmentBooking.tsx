'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Loader2 } from 'lucide-react';
import TimeSlotPicker from './TimeSlotPicker';

interface Service {
    id: number;
    name: string;
    duration: number;
    price: number | null;
}

interface AppointmentBookingProps {
    businessId: string;
    services: Service[];
}

export default function AppointmentBooking({ businessId, services }: AppointmentBookingProps) {
    const [step, setStep] = useState(1);
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [date, setDate] = useState<string>('');
    const [timeSlot, setTimeSlot] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        notes: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Mock time slots for now - in a real app, fetch from API based on date and business
    const timeSlots = [
        '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
        '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    ];

    const handleServiceSelect = (service: Service) => {
        setSelectedService(service);
        setStep(2);
    };

    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDate(e.target.value);
    };

    const handleTimeSelect = (slot: string) => {
        setTimeSlot(slot);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedService || !date || !timeSlot) return;

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/appointments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    businessId,
                    serviceId: selectedService.id,
                    customerName: formData.name,
                    customerPhone: formData.phone,
                    customerEmail: formData.email,
                    appointmentDate: date,
                    appointmentTime: timeSlot,
                    notes: formData.notes,
                }),
            });

            if (response.ok) {
                setIsSuccess(true);
            } else {
                alert('Failed to book appointment. Please try again.');
            }
        } catch (error) {
            console.error('Error booking appointment:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-green-800 mb-2">Booking Confirmed!</h3>
                <p className="text-green-700 mb-6">
                    Your appointment for {selectedService?.name} on {date} at {timeSlot} has been booked successfully.
                </p>
                <button
                    onClick={() => {
                        setIsSuccess(false);
                        setStep(1);
                        setSelectedService(null);
                        setDate('');
                        setTimeSlot(null);
                        setFormData({ name: '', phone: '', email: '', notes: '' });
                    }}
                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                    Book Another
                </button>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Book an Appointment</h3>
            </div>

            <div className="p-6">
                {step === 1 && (
                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Select a Service</h4>
                        <div className="grid gap-3">
                            {services.map((service) => (
                                <button
                                    key={service.id}
                                    onClick={() => handleServiceSelect(service)}
                                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-left group"
                                >
                                    <div>
                                        <div className="font-medium text-gray-900 group-hover:text-blue-700">{service.name}</div>
                                        <div className="text-sm text-gray-500">{service.duration} mins</div>
                                    </div>
                                    {service.price && (
                                        <div className="font-semibold text-gray-900">₹{service.price}</div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <button
                                onClick={() => setStep(1)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                ← Change Service
                            </button>
                            <span className="text-sm font-medium text-gray-900">{selectedService?.name}</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
                            <input
                                type="date"
                                value={date}
                                onChange={handleDateChange}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        {date && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Time</label>
                                <TimeSlotPicker
                                    slots={timeSlots}
                                    selectedSlot={timeSlot}
                                    onSelect={handleTimeSelect}
                                />
                            </div>
                        )}

                        {date && timeSlot && (
                            <div className="pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => setStep(3)}
                                    className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                >
                                    Continue
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {step === 3 && (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="flex items-center justify-between mb-4">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="text-sm text-blue-600 hover:underline"
                            >
                                ← Back
                            </button>
                            <div className="text-sm text-right">
                                <div className="font-medium text-gray-900">{selectedService?.name}</div>
                                <div className="text-gray-500">{date} at {timeSlot}</div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                            <input
                                type="tel"
                                name="phone"
                                required
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="+91 98765 43210"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email (Optional)</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="john@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Any special requests..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                    Booking...
                                </>
                            ) : (
                                'Confirm Booking'
                            )}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
