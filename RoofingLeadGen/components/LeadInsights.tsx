import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface InsightData {
  date: string;
  newLeads: number;
  convertedLeads: number;
}

export function LeadInsights() {
  const [insightData, setInsightData] = useState<InsightData[]>([]);

  useEffect(() => {
    fetchInsightData();
  }, []);

  const fetchInsightData = async () => {
    try {
      const response = await fetch('/api/lead-insights');
      if (!response.ok) throw new Error('Failed to fetch lead insights');
      const data = await response.json();
      setInsightData(data);
    } catch (error) {
      console.error('Error:', error);
    }
  
};

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lead Insights</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={insightData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="newLeads" stroke="#8884d8" name="New Leads" />
            <Line type="monotone" dataKey="convertedLeads" stroke="#82ca9d" name="Converted Leads" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

