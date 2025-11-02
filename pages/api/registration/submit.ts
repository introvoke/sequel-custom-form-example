import type { NextApiRequest, NextApiResponse } from 'next';

interface RegistrationData {
  fullName: string;
  email: string;
  companyName: string;
  numberOfEmployees: string;
  phoneNumber: string;
  eventId: string;
}

interface SequelRegistrationResponse {
  joinCode: string;
  authToken: string;
  joinUrl: string;
  email: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    fullName,
    email,
    companyName,
    numberOfEmployees,
    phoneNumber,
    eventId,
  }: RegistrationData = req.body;

  // Validate input
  if (!fullName || !email || !eventId) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Step 1: Process custom form data
    // Here you would typically:
    // - Save to your database
    // - Send to your CRM (HubSpot, Salesforce, etc.)
    // - Send notification emails
    // - Add to marketing automation
    console.log(`Registration received from: ${email}`);

    // Step 2: Register user with Sequel
    const sequelResponse = await fetch(
      `https://api.introvoke.com/api/v3/events/${eventId}/registrant`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: fullName,
          email: email,
          resendInvite: true,
          ignoreCustomQuestions: true,
        }),
      }
    );

    if (!sequelResponse.ok) {
      const errorData = await sequelResponse.json().catch(() => ({}));
      throw new Error(`Sequel registration failed: ${errorData.message || 'Unknown error'}`);
    }

    const sequelData: SequelRegistrationResponse = await sequelResponse.json();
    console.log(`User registered successfully: ${email} -> ${sequelData.joinCode}`);

    // Return joinCode to frontend
    return res.status(200).json({
      joinCode: sequelData.joinCode,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      message: 'Registration failed. Please try again.',
    });
  }
}

