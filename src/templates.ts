export interface EmailTemplate {
  subject: string;
  body: string;
}

const templates: EmailTemplate[] = [
  {
    subject: "Your Application to {{company_name}}",
    body: `Dear Applicant,

Thank you for your interest in the {{job_title}} position at {{company_name}}.

After careful consideration by our team (and a brief consultation with our office plants), we regret to inform you that we will not be moving forward with your application at this time.

We were impressed by your qualifications, but ultimately decided to go with a candidate who had 15 years of experience in a technology that was invented 3 years ago.

We encourage you to apply again in the future, preferably after mass layoffs create an opening.

Best regards,
The {{company_name}} Talent Acquisition Team

P.S. This role has been filled by the CEO's nephew.`,
  },
  {
    subject: "Update on Your {{company_name}} Application",
    body: `Dear Candidate,

We appreciate the time you invested in applying for the {{job_title}} role at {{company_name}}.

After an extensive review process involving 47 interviews, 3 case studies, and a blood sacrifice, we have decided to pursue other candidates whose skills more closely align with our ever-changing requirements.

Please note that "other candidates" refers to an internal transfer who was always going to get the job.

We will keep your resume on file for future opportunities, by which we mean we will delete it immediately after sending this email.

Warm regards,
{{company_name}} People Operations`,
  },
  {
    subject: "{{company_name}} - Application Status",
    body: `Hello,

Thank you for applying to the {{job_title}} position at {{company_name}}.

We were genuinely impressed by your background. Unfortunately, we've decided to move forward with a candidate who is willing to work for exposure and believes "competitive salary" means minimum wage.

We also noticed you listed "work-life balance" as important to you. This was a red flag.

We wish you the best in your job search and hope you find a company that deserves you (it's not us).

Regards,
The {{company_name}} Hiring Committee

P.S. The position has been reposted with the same requirements but a lower salary range.`,
  },
  {
    subject: "Re: Your Interest in {{company_name}}",
    body: `Dear Applicant,

Thank you for your application for {{job_title}} at {{company_name}}.

After careful review, we regret to inform you that you were not selected. The hiring manager felt that while you met 100% of the requirements, you didn't demonstrate enough "passion" during the interview, which we measure by willingness to accept unpaid overtime.

Additionally, our culture fit assessment determined that you have "too much self-respect."

We encourage you to develop these areas and reapply in 6-8 months when we post this same position again after the person we hired burns out.

Best,
{{company_name}} Talent Team`,
  },
  {
    subject: "{{company_name}} Career Opportunity - Decision",
    body: `Dear Candidate,

We wanted to personally reach out regarding your application for the {{job_title}} role.

Your interview performance was strong. Your technical skills were excellent. Your references were glowing. However, we've decided to go with another candidate who asked for $40,000 less and has a "hungry" look in their eyes that suggests they won't push back on unreasonable deadlines.

We'd like to stay connected on LinkedIn so we can reach out in 2 years when you've gained more experience and we still won't pay market rate.

Thank you for your interest in {{company_name}}.

All the best,
{{company_name}} HR

P.S. We've also decided to eliminate this position entirely and distribute the work among existing employees.`,
  },
  {
    subject: "Important Update: {{job_title}} at {{company_name}}",
    body: `Dear Applicant,

We are writing to inform you that after much deliberation, we will not be extending an offer for the {{job_title}} position.

Our decision was difficult, especially since you were our top candidate. However, during the final review, someone noticed you had boundaries and asked about PTO during the interview. This raised concerns about your "commitment to excellence."

The role will now be filled by the founder's college roommate's nephew, who has no relevant experience but "really vibes with the company culture."

We genuinely appreciate your interest and hope you'll consider {{company_name}} for future opportunities when we inevitably need someone competent to fix the mess.

Sincerely,
{{company_name}} Recruitment`,
  },
];

export function getRandomTemplate(): EmailTemplate {
  return templates[Math.floor(Math.random() * templates.length)]!;
}

export function renderTemplate(template: EmailTemplate, companyName: string, jobTitle: string): { subject: string; body: string } {
  const render = (text: string) =>
    text.replace(/\{\{company_name\}\}/g, companyName).replace(/\{\{job_title\}\}/g, jobTitle);

  return {
    subject: render(template.subject),
    body: render(template.body),
  };
}
