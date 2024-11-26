import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function LeadForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    roofSize: '',
    materialPreference: '',
    urgency: '',
    budget: '',
    preferredContactTime: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Failed to submit lead');
      // Handle successful submission (e.g., show success message, clear form)
    } catch (error) {
      console.error('Error:', error);
      // Handle error (e.g., show error message)
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Request a Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <Input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <Input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            required
          />
          <Select name="projectType" onValueChange={(value) => handleSelectChange('projectType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Project Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newRoof">New Roof</SelectItem>
              <SelectItem value="repair">Repair</SelectItem>
              <SelectItem value="restoration">Restoration</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="roofSize"
            value={formData.roofSize}
            onChange={handleChange}
            placeholder="Approximate Roof Size (sq ft)"
          />
          <Input
            name="materialPreference"
            value={formData.materialPreference}
            onChange={handleChange}
            placeholder="Preferred Roofing Material"
          />
          <Select name="urgency" onValueChange={(value) => handleSelectChange('urgency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Urgency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="immediate">Immediate</SelectItem>
              <SelectItem value="within1Month">Within 1 Month</SelectItem>
              <SelectItem value="within3Months">Within 3 Months</SelectItem>
              <SelectItem value="planning">Planning Stage</SelectItem>
            </SelectContent>
          </Select>
          <Input
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Estimated Budget"
          />
          <Select name="preferredContactTime" onValueChange={(value) => handleSelectChange('preferredContactTime', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Preferred Contact Time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="morning">Morning</SelectItem>
              <SelectItem value="afternoon">Afternoon</SelectItem>
              <SelectItem value="evening">Evening</SelectItem>
            </SelectContent>
          </Select>
          <Textarea
            name="additionalInfo"
            value={formData.additionalInfo}
            onChange={handleChange}
            placeholder="Additional Information"
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit">Submit</Button>
      </CardFooter>
    </Card>
  );
}

