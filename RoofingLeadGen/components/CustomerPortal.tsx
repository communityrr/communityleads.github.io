import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Project {
  id: string;
  name: string;
  status: string;
  timeline: string;
  description: string;
}

export function CustomerPortal() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/customer-projects');
      if (!response.ok) throw new Error('Failed to fetch projects');
      const data = await response.json();
      setProjects(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
  };

  const handleMessageSend = async () => {
    if (!selectedProject || !message) return;

    try {
      const response = await fetch('/api/send-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: selectedProject.id, message }),
      });
      if (!response.ok) throw new Error('Failed to send message');
      setMessage('');
      // Optionally, update the UI to show the sent message
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="flex">
      <Card className="w-1/3 mr-4">
        <CardHeader>
          <CardTitle>Your Projects</CardTitle>
        </CardHeader>
        <CardContent>
          {projects.map(project => (
            <Button
              key={project.id}
              onClick={() => handleProjectSelect(project)}
              variant={selectedProject?.id === project.id ? 'default' : 'outline'}
              className="w-full mb-2"
            >
              {project.name}
            </Button>
          ))}
        </CardContent>
      </Card>
      {selectedProject && (
        <Card className="w-2/3">
          <CardHeader>
            <CardTitle>{selectedProject.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            <p><strong>Timeline:</strong> {selectedProject.timeline}</p>
            <p><strong>Description:</strong> {selectedProject.description}</p>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message to the project manager..."
              className="mt-4"
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleMessageSend}>Send Message</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}

