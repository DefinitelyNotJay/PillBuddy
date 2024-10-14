
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../drizzle/db';
import {
	notifications,
	patients,
	schedules,
} from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import twilio from 'twilio';

export const dynamic = 'force-dynamic';
export const revalidate = 1;
export async function GET(req: NextRequest, res: NextResponse) {
	const accountSid = "AC9ceaafdeb5d267965a31dd119d9b6310";
	const authToken = "2217965bf786b97700b4f042dc93bafe";
	const client = twilio(accountSid, authToken);

	const getCurrentTime = (mHour = 0, mMinute = 0): string => {
		const now = new Date();

		now.setHours(now.getHours() + mHour);
		now.setMinutes(now.getMinutes() + mMinute);

		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	};
	const timeNow = getCurrentTime(7, 0);

	// const eachUserNotifications = await db
	// 	.select({
	// 		patientName: patients.name,
	// 		patientPhone: patients.phone_number,
	// 		scheduleId: schedules.id,
	// 		notificationTime: notifications.notification_time,
	// 		notificationStatus: notifications.notification_status,
	// 		meal: notifications.meal,
	// 	})
	// 	.from(notifications)
	// 	.leftJoin(schedules, eq(schedules.id, notifications.schedule_id))
	// 	.leftJoin(patients, eq(patients.id, schedules.patient_id));

	const allNotifications = await db.select().from(notifications);
	const eachUserNotifications = await db
		.select({
			patientName: patients.name,
			patientPhone: patients.phone_number,
			scheduleId: schedules.id,
			notificationTime: notifications.notification_time,
			notificationStatus: notifications.notification_status,
		})
		.from(notifications)
		.leftJoin(schedules, eq(schedules.id, notifications.schedule_id))
		.leftJoin(patients, eq(patients.id, schedules.patient_id));

	let total = 0;
	let passIn = 0;
	let textTest = '';

	for (const noti of eachUserNotifications) {
		total++;

		textTest += `${noti.notificationTime.slice(0, -3)} == ${timeNow.slice(0, -3)} |`;
		if (noti.notificationTime.slice(0, -3) == timeNow.slice(0, -3)) {
			passIn++;
			try {
				const message_result = await client.messages.create({
					body: `Time to take your medicine! Stay healthy and follow your schedule.`,
					from: '+19093435505',
					to: noti.patientPhone || '+66917584445',
				});
				if (message_result.body) {
				}
			} catch (error) {
				console.error('Error sending message:', error);
				return NextResponse.json(
					{
						ok: false,
						total: error,
						passIn: passIn,
						textTest: textTest,
						allNotifications: allNotifications,
					},
					{ status: 500 }
				);
			}
		}
	}

	const response = NextResponse.json(
		{
			ok: true,
			total: total,
			passIn: passIn,
			textTest: textTest,
			allNotifications: allNotifications,
		},
		{ status: 200 }
	);

	// เพิ่ม cache-control headers
	response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
	response.headers.set('Pragma', 'no-cache');
	response.headers.set('Expires', '0');

	return response;
}
