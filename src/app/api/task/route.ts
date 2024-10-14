import { createScheduledDateTime } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../drizzle/db';
import {
	notification_medicines,
	notifications,
	patients,
	schedules,
} from '../../../../drizzle/schema';
import { eq } from 'drizzle-orm';
import twilio from 'twilio';

// async function createMessage(to: string, body: string) {
// 	const message = await client.messages.create({
// 		body: body,
// 		from: '+19093435505',
// 		to: to,
// 	});
// }

export async function GET(req: NextRequest, res: NextResponse) {
	const accountSid = process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID;
	const authToken = process.env.NEXT_PUBLIC_TWILIO_AUTH_TOKEN;
	const client = twilio(accountSid, authToken);

	const getCurrentTime = (mHour = 0, mMinute = 0): string => {
		const now = new Date();
		const hours = String(now.getHours() - mHour).padStart(2, '0');
		const minutes = String(now.getMinutes() - mMinute).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');

		return `${hours}:${minutes}:${seconds}`;
	};

	const eachUserNotifications = await db
		.select({
			patientName: patients.name,
			patientPhone: patients.phone_number,
			scheduleId: schedules.id,
			notificationTime: notifications.notification_time,
			notificationStatus: notifications.notification_status,
			meal: notifications.meal,
		})
		.from(notifications)
		.leftJoin(schedules, eq(schedules.id, notifications.schedule_id))
		.leftJoin(patients, eq(patients.id, schedules.patient_id));

	let total = 0;
	let passIn = 0;
	let textTest = '';

	const timeNow = getCurrentTime(1, 6);

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
					},
					{ status: 500 }
				);
			}
		}
	}

	return NextResponse.json(
		{
			ok: true,
			total: total,
			passIn: passIn,
			textTest: textTest,
		},
		{ status: 200 }
	);
}
