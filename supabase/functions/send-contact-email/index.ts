import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const resend = new Resend(RESEND_API_KEY);
    const { name, email, phone, message }: ContactFormData = await req.json();

    if (!name || !email || !message) {
      throw new Error("Missing required fields: name, email, message");
    }

    console.log(`Sending contact form email from ${name} (${email})`);

    const { error } = await resend.emails.send({
      from: "MSquare Architects <onboarding@resend.dev>",
      to: ["sameerkhanday45@gmail.com"],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333; border-bottom: 2px solid #c8a961; padding-bottom: 10px;">New Contact Form Submission</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555; width: 120px;">Name:</td>
              <td style="padding: 10px; color: #333;">${name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; color: #555;">Email:</td>
              <td style="padding: 10px; color: #333;"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; font-weight: bold; color: #555;">Phone:</td>
              <td style="padding: 10px; color: #333;">${phone || "Not provided"}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 10px; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
              <td style="padding: 10px; color: #333;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 12px; color: #999;">This email was sent from the MSquare Architects website contact form.</p>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    console.log("Contact form email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-contact-email:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
