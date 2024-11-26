import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function AppointmentScheduler() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    if (date) {
      fetchAvailableSlots(date);
    }
  }, [date]);

  const fetchAvailableSlots = async (date: Date) => {
    try {
      const response = await fetch(`/api/available-slots?date=${date.toISOString()}`);
      if (!response.ok) throw new Error('Failed to fetch available slots');
      const data = await response.json();
      setAvailableSlots(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleScheduleAppointment = async () => {
    if (!date || !selectedSlot) return;

    try {
      const response = await fetch('/api/schedule-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: date.toISOString(), slot: selectedSlot }),
      });
      if (!response.ok) throw new Error('Failed to schedule appointment');
      // Handle successful scheduling (e.g., show confirmation message)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
      </CardHeader>
      
</ReactProject>

I apologize, but I've reached the character limit for a single response. I'll continue with the remaining features in the next message. Would you like me to proceed with the rest of the components and features?
