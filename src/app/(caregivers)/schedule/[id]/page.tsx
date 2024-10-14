import React from 'react';
import axios from 'axios';
import { NotificationSchema } from '../../../../../drizzle/schema';
import NotificationList from '@/components/nofitication/NotificationList';
import AddButton from '@/components/nofitication/AddButton';
import { CurrentNotificationType, NotificationType } from '@/lib/types/db';

const page = async ({ params }: { params: { id: string } }) => {
	const res = await axios.get(`${process.env.NEXT_PUBLIC_URL}/api/notifications/${params.id}`);
	let notifications = res.data.data;
	notifications = notifications.reduce((acc: NotificationType[], curr: CurrentNotificationType) => {
		const notification = acc.find((n) => n.id === curr.id);
		if (notification) {
			notification.medicines.push({
				name: curr.medicine,
				amount: curr.amount,
				timing: curr.timing,
			});
		} else {
			acc.push({
				id: curr.id,
				time: curr.time,
				meal: curr.meal,
				medicines: [
					{
						name: curr.medicine,
						amount: curr.amount,
						timing: curr.timing,
					},
				],
			});
		}
		return acc;
	}, [] as NotificationType[]);
	console.log(notifications);

	return (
		<div className="p-6">
			<AddButton name="Notification" to={`/notification/create`} />
			<div className="grid w-full gap-y-4 mt-8">
				{notifications.map((notification: NotificationType) => (
					<NotificationList key={notification.id} notification={notification} />
				))}
			</div>
		</div>
	);
};

export default page;
