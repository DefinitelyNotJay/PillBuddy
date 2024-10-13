import { NextRequest, NextResponse } from 'next/server';
import { db } from '../../../../../drizzle/db';
import {
	medicines,
	NotificationMedicinesSchema,
	NotificationSchema,
} from '../../../../../drizzle/schema';
import { notifications } from '../../../../../drizzle/schema';
import { notification_medicines } from '../../../../../drizzle/schema';
import { eq } from 'drizzle-orm';

export async function POST(req: NextRequest, res: NextResponse) {
	const form: NotificationMedicinesSchema = await req.json();
	const past_medicines = await db
		.select({ id: notification_medicines.medicine_id })
		.from(notification_medicines)
		.where(eq(notification_medicines.notification_id, form.notification_id));

	if (past_medicines.some((med) => med.id === form.medicine_id)) {
		return NextResponse.json({ ok: false, message: 'Already has this medicine.' }, { status: 403 });
	}
	await db.insert(notification_medicines).values({
		dosage_amount: form.dosage_amount,
		medicine_id: form.medicine_id,
		notification_id: form.notification_id,
	});

	return NextResponse.json({ ok: true }, { status: 200 });
}
