'use client';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
	Form,
	FormField,
	FormControl,
	FormLabel,
	FormItem,
	FormDescription,
	FormMessage,
} from '../ui/form';

import { Input } from '../ui/input';
import { Button } from '../ui/button';

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

import axios from 'axios';
import { PatientSchema } from '../../../drizzle/schema';

import { useRouter } from 'next/navigation';

const NotificationForm = () => {
	const router = useRouter();

	const scheduleSchema = z.object({
		patient_id: z.coerce.number().int(),
		notification_time: z.string(),
		meal: z.enum(['morning', 'afternoon', 'evening', 'bedtime']),
	});

	const form = useForm<z.infer<typeof scheduleSchema>>({
		resolver: zodResolver(scheduleSchema),
	});

	const onSubmit = async (values: z.infer<typeof scheduleSchema>) => {
		await axios.post(`/api/notifications`, values).then((data) => router.back());
	};

	const [patients, setPatients] = useState<PatientSchema[]>([]);
	useEffect(() => {
		axios.get('/api/patients').then((res) => setPatients(res.data.data));
	}, []);

	return (
		<div className="max-w-lg mx-auto mt-10">
			<h1 className="text-center text-2xl my-4 font-semibold">Add new notification</h1>
			<Form {...form}>
				<form action="" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<FormField
						control={form.control}
						name="patient_id"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg">Patient</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue="field.value">
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select a fruit" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectLabel>Patients</SelectLabel>
												{patients.map((patient) => (
													<SelectItem key={patient.id} value={patient.id + ''}>
														{patient.name}
													</SelectItem>
												))}
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="notification_time"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg">Time</FormLabel>
								<FormControl>
									<Input
										type="time"
										onChange={field.onChange}
										defaultValue={field.value}
										className="w-fit"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="meal"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-lg">Meal</FormLabel>
								<FormControl>
									<Select onValueChange={field.onChange} defaultValue="field.value">
										<SelectTrigger className="w-[180px]">
											<SelectValue placeholder="Select a fruit" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="morning">Morning</SelectItem>
												<SelectItem value="afternoon">Afternoon</SelectItem>
												<SelectItem value="evening">Evening</SelectItem>
												<SelectItem value="bedtime">Bedtime</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" className="mt-4 w-24">
						Submit
					</Button>
				</form>
			</Form>
		</div>
	);
};

export default NotificationForm;
