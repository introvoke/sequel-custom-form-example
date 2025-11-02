# Next.js + Contentful + Sequel Integration Example

This example demonstrates how to integrate your custom registration form with the Sequel Embed Toolkit using Next.js and Contentful.

## Features

- ✅ Contentful CMS integration for managing event data
- ✅ Custom form submission with Sequel registration
- ✅ JoinCode validation against Sequel API
- ✅ Frontend integration with automatic registration check
- ✅ Cookie management for returning users
- ✅ Backend API route for form processing
- ✅ Error handling and user feedback

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp env.example .env.local
```

The `.env.local` file is optional. If you're using Contentful, add your credentials:

```
CONTENTFUL_SPACE_ID=your_contentful_space_id
CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
CONTENTFUL_ENVIRONMENT=master
```

**Note:** If Contentful is not configured, the app uses hardcoded defaults defined in `lib/contentful.ts`.

### 3. Update Default Event ID

If you're not using Contentful, edit `lib/contentful.ts` and update the default `sequelEventId`:

```typescript
sequelEventId: 'your-event-id-here'
```

### 4. Run the Development Server

```bash
npm run dev
```

Visit `http://localhost:3000` in your browser.

## Project Structure

```
nextjs-contentful-example/
├── pages/
│   ├── api/
│   │   └── registration/
│   │       └── submit.ts      # Backend API route
│   ├── _app.tsx                # App wrapper with Sequel script
│   ├── _document.tsx           # HTML document
│   └── index.tsx               # Main landing page
├── lib/
│   └── contentful.ts           # Contentful integration
├── styles/
│   ├── globals.css             # Global styles
│   └── Home.module.css         # Component styles
├── next.config.js
├── package.json
└── README.md
```

## API Endpoints

### POST `/api/registration/submit`
Handles custom form submission and Sequel registration.

**Request Body:**
```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "companyName": "Acme Corp",
  "numberOfEmployees": "51-200",
  "phoneNumber": "+1234567890",
  "eventId": "uuid-here"
}
```

**Response:**
```json
{
  "joinCode": "abc123"
}
```

## How It Works

1. **Page Load**: Frontend checks for existing registration via `checkAndRenderIfRegistered()`
   - Checks URL parameters for `joinCode`
   - Checks cookies for cached joinCode
   - Validates joinCode via API
   - Renders Sequel event if valid, shows form if not

2. **Form Submission**:
   - Submits custom form data to `/api/registration/submit`
   - Backend processes custom form data (save to DB, CRM, etc.)
   - Backend registers user with Sequel API
   - Returns joinCode to frontend
   - Frontend saves joinCode to cookies
   - Frontend renders Sequel event

3. **Returning Users**:
   - Automatically detects cached joinCode
   - Validates joinCode with API
   - Renders Sequel event without showing form

## Contentful Integration

### Content Model Setup

Create a Content Type in Contentful called `landingPage` with these fields:

- **title** (Short text) - Page title
- **description** (Long text) - Page description
- **slug** (Short text, unique) - URL slug
- **sequelEventId** (Short text) - Sequel event ID from your Sequel dashboard

### Using Contentful

When you fetch page content from Contentful, the Sequel event ID comes from the CMS. This allows you to:
- Manage multiple events from one codebase
- Update event IDs without code changes
- Use different events per environment

### Without Contentful

If you don't use Contentful, the app falls back to hardcoded defaults in `lib/contentful.ts`. You can still update the event ID there.

## Customization

### Customize Registration Handler

Edit `pages/api/registration/submit.ts` to:
- Save to your database
- Send to your CRM (HubSpot, Salesforce, etc.)
- Send notification emails
- Add to marketing automation

### Customize Styling

Edit `styles/Home.module.css` and `styles/globals.css` to match your brand.

### Add More Form Fields

Update the form in `pages/index.tsx` and the API handler in `pages/api/registration/submit.ts`.

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

This Next.js app is optimized for Vercel deployment:

```bash
vercel
```

Make sure to add your environment variables in the Vercel dashboard if using Contentful.

## Troubleshooting

### Sequel toolkit not loading
- Ensure the Sequel toolkit script URL is correct in `_app.tsx`
- Check browser console for errors
- Verify network connectivity

### Registration failing
- Verify the `eventId` is correct
- Check Sequel API status
- Look at server logs in terminal

### JoinCode validation failing
- Ensure the joinCode format is correct
- Verify the eventId matches
- Check that the user was actually registered

### Contentful not working
- Verify your Contentful credentials in `.env.local`
- Check that the content model is set up correctly
- The app will fall back to hardcoded values if Contentful fails

## License

This example is provided as-is for demonstration purposes.

