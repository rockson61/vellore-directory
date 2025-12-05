import { db } from '@/lib/db';
import { appointments, businesses, serviceOfferings } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Calendar, Clock, MapPin } from 'lucide-react';

export const metadata = {
    title: 'My Appointments - Vellore Directory',
    description: 'View and manage your appointments',
};

export default async function AppointmentsPage() {
    // In a real app, we would get the logged-in user's ID
    // const userId = 'user_123';

    const userAppointments = await db
        .select({
            id: appointments.id,
            date: appointments.appointmentDate,
            time: appointments.appointmentTime,
            status: appointments.status,
            businessName: businesses.name,
            businessId: businesses.id,
            businessAddress: businesses.address,
            serviceName: serviceOfferings.serviceName,
            duration: serviceOfferings.durationMinutes,
            price: serviceOfferings.price,
        })
        .from(appointments)
        .leftJoin(businesses, eq(appointments.businessId, businesses.id))
        .leftJoin(serviceOfferings, eq(appointments.serviceId, serviceOfferings.id))
        .orderBy(desc(appointments.appointmentDate), desc(appointments.appointmentTime));

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Link href="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Appointments</span>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">My Appointments</h1>
                    <p className="text-gray-600">Manage your upcoming and past appointments</p>
                </div>

                {userAppointments.length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {userAppointments.map((apt) => (
                            <div
                                key={apt.id}
                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">
                                            {apt.serviceName || 'Service'}
                                        </h3>
                                        <Link
                                            href={`/business/${apt.businessId}`}
                                            className="text-blue-600 hover:underline text-sm font-medium"
                                        >
                                            {apt.businessName}
                                        </Link>
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${apt.status === 'confirmed'
                                                ? 'bg-green-100 text-green-700'
                                                : apt.status === 'cancelled'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                            }`}
                                    >
                                        {apt.status}
                                    </span>
                                </div>

                                <div className="space-y-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-gray-400" />
                                        <span>{apt.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-gray-400" />
                                        <span>{apt.time} ({apt.duration} mins)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-400" />
                                        <span className="line-clamp-1">{apt.businessAddress}</span>
                                    </div>
                                </div>

                                {apt.status !== 'cancelled' && (
                                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                                            Reschedule
                                        </button>
                                        <button className="flex-1 px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                        <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No appointments yet</h3>
                        <p className="text-gray-500 mb-6">
                            Browse categories and book your first appointment today.
                        </p>
                        <Link
                            href="/categories"
                            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Browse Categories
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
