export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  projectType: string;
  urgency: string;
  budget: number;
  roofSize: number;
}

export function scoreLeads(lead: Lead): number {
  let score = 0;

  // Score based on project type
  switch (lead.projectType) {
    case 'newRoof':
      score += 30;
      break;
    case 'repair':
      score += 20;
      break;
    case 'restoration':
      score += 25;
      break;
  }

  // Score based on urgency
  switch (lead.urgency) {
    case 'immediate':
      score += 30;
      break;
    case 'within1Month':
      score += 25;
      break;
    case 'within3Months':
      score += 20;
      break;
    case 'planning':
      score += 15;
      break;
  }

  // Score based on budget
  if (lead.budget > 20000) score += 30;
  else if (lead.budget > 10000) score += 20;
  else if (lead.budget > 5000) score += 10;

  // Score based on roof size
  if (lead.roofSize > 3000) score += 30;
  else if (lead.roofSize > 2000) score += 20;
  else if (lead.roofSize > 1000) score += 10;

  return score;
}

