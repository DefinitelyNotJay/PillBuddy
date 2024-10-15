import { db } from '../../../../../drizzle/db';
import {
	medicines,
	notification_medicines,
	notifications,
	patients,
	schedules,
} from '../../../../../drizzle/schema';
import { NextRequest, NextResponse } from 'next/server';
import { asc, gt, eq, and } from 'drizzle-orm';

export const dynamic = 'force-dynamic';
export const revalidate = 1;
export async function GET(req: NextRequest) {
	try {
		const clerkID = req.nextUrl.searchParams.get('clerkID');
		let currentTime = new Date();
		currentTime.setHours(currentTime.getHours() + 7);
		const newTime = currentTime.toTimeString().split(' ')[0];
		if (!clerkID) {
			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
		}

		const patient = await db
			.select({ id: patients.id })
			.from(patients)
			.where(eq(patients.clerkID, clerkID));

		const patientIdId = patient[0].id;
		console.log('patientIDiD', patientIdId);

		if (!patientIdId) {
			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
		}
		const closestNotification = await db
			.select({
				id: notifications.id,
				time: notifications.notification_time,
				medicine: medicines.name,
				amount: notification_medicines.dosage_amount,
				timing: notification_medicines.timing,
				meal: notifications.meal,
			})
			.from(notifications)
			.where(
				and(
					gt(notifications.notification_time, newTime) // Fetch future notifications
					// eq(schedules.patient_id, patientIdId) // Ensure it's the correct patient
				)
			)
			.leftJoin(schedules, eq(notifications.schedule_id, schedules.id)) // Link notifications to schedules
			.leftJoin(
				notification_medicines,
				eq(notifications.id, notification_medicines.notification_id)
			)
			.leftJoin(medicines, eq(notification_medicines.medicine_id, medicines.id))
			.orderBy(asc(notifications.notification_time)) // Order by soonest notification
			.limit(1); // Limit to the closest notification

		const { id } = closestNotification[0];

		if (!id) {
			return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
		}

		const allMedicines = await db
			.select()
			.from(medicines)
			.leftJoin(notification_medicines, eq(notification_medicines.medicine_id, medicines.id))
			.leftJoin(notifications, eq(notification_medicines.notification_id, notifications.id))
			.where(eq(notifications.id, id));

		console.log(allMedicines);

		if (closestNotification.length > 0) {
			console.log(closestNotification[0]);
			return NextResponse.json({
				closestNotification: closestNotification[0],
				allMedicines: allMedicines,
			});
		} else {
			return NextResponse.json({ message: 'No upcoming notifications found.' }, { status: 404 });
		}
	} catch (error) {
		console.error('Error fetching notifications:', error);
		return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
	}
}
