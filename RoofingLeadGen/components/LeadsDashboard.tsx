import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  urgency: string;
  createdAt: string;
};

export function LeadsDashboard() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads');
      if (!response.ok) throw new Error('Failed to fetch leads');
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedLeads = [...leads].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleAccept = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}/accept`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to accept lead');
      fetchLeads();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      const response = await fetch(`/api/leads/${id}/decline`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to decline lead');
      fetchLeads();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Leads Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('name')}>Name</TableHead>
              <TableHead onClick={() => handleSort('email')}>Email</TableHead>
              <TableHead onClick={() => handleSort('phone')}>Phone</TableHead>
              <TableHead onClick={() => handleSort('projectType')}>Project Type</TableHead>
              <TableHead onClick={() => handleSort('urgency')}>Urgency</TableHead>
              <TableHead onClick={() => handleSort('createdAt')}>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedLeads.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>{lead.name}</TableCell>
                <TableCell>{lead.email}</TableCell>
                <TableCell>{lead.phone}</TableCell>
                <TableCell>{lead.projectType}</TableCell>
                <TableCell>{lead.urgency}</TableCell>
                <TableCell>{new Date(lead.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Button onClick={() => handleAccept(lead.id)} className="mr-2">Accept</Button>
                  <Button onClick={() => handleDecline(lead.id)} variant="destructive">Decline</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

