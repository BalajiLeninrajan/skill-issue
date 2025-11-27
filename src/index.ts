import { insertHope, getPendingRejections, markAsSent } from "./db.ts";
import { sendRejectionEmail } from "./email.ts";

interface Env {
  DB: D1Database;
  RESEND_API_KEY: string;
}

function generateId(): string {
  return crypto.randomUUID();
}

function getRandomDelay(): number {
  // Random delay between 2 and 48 hours (in seconds)
  const minHours = 2;
  const maxHours = 48;
  const hours = minHours + Math.random() * (maxHours - minHours);
  return Math.floor(hours * 60 * 60);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      });
    }

    if (url.pathname === "/api/register-hope" && request.method === "POST") {
      try {
        const body = await request.json<{
          email?: string;
          companyName?: string;
          jobTitle?: string;
        }>();

        const { email, companyName, jobTitle } = body;

        if (!email || !companyName || !jobTitle) {
          return Response.json(
            { error: "Missing required fields: email, companyName, jobTitle" },
            { status: 400 }
          );
        }

        if (!isValidEmail(email)) {
          return Response.json({ error: "Invalid email format" }, { status: 400 });
        }

        if (email.length > 254 || companyName.length > 200 || jobTitle.length > 200) {
          return Response.json({ error: "Input too long" }, { status: 400 });
        }

        const id = generateId();
        const scheduledAt = Math.floor(Date.now() / 1000) + getRandomDelay();

        await insertHope(env.DB, id, email, companyName, jobTitle, scheduledAt);

        return Response.json(
          {
            message: "Hope registered. Disappointment scheduled.",
            id,
          },
          {
            headers: {
              "Access-Control-Allow-Origin": "*",
            },
          }
        );
      } catch (err) {
        console.error("Error registering hope:", err);
        return Response.json({ error: "Internal server error" }, { status: 500 });
      }
    }

    // Serve static files for everything else (handled by assets binding)
    return new Response("Not found", { status: 404 });
  },

  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const pending = await getPendingRejections(env.DB);

    for (const registration of pending) {
      try {
        await sendRejectionEmail(
          env.RESEND_API_KEY,
          registration.email,
          registration.company_name,
          registration.job_title
        );
        await markAsSent(env.DB, registration.id);
        console.log(`Sent rejection to ${registration.email}`);
      } catch (err) {
        console.error(`Failed to send rejection to ${registration.email}:`, err);
      }
    }
  },
};
