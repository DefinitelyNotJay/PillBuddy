'use client';
import React from 'react';
import { ScheduleSchema } from '../../../drizzle/schema';
import { useRouter } from 'next/navigation';
import { ScheduleCardType } from '@/lib/types/db';
import { CalendarDays, ContactRound, Wine } from 'lucide-react';
import { format, parseISO } from 'date-fns';

const ScheduleCard = ({ schedule }: { schedule: ScheduleCardType }) => {
	const router = useRouter();

	return (
		<div
			key={schedule.scheduleId}
			className="border-2 border-gray-100 rounded-xl p-4 cursor-pointer rounded-md"
			onClick={() => {
				return router.push(`/schedule/${schedule.scheduleId}`);
			}}
		>
			{/* <p>{schedule.caregiverName}</p> */}
			<p className="flex gap-2 text-xl font-semibold items-center">
				{/* <ContactRound size={32} />  */}
				{schedule.patientName}
			</p>
			<div className="w-full border-b border-gray-500 my-2"></div>
			<div className="ml-8">
				<p className="flex gap-2 items-center text-lg">
					<Wine /> {schedule.patientAge} years old
				</p>

				<p className="flex gap-2 items-center text-lg">
					<CalendarDays />
					{format(parseISO(schedule.startDate), 'MMMM d yyyy ')}
				</p>
			</div>
		</div>
	);
};

export default ScheduleCard;
