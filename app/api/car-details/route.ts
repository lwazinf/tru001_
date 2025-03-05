import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route handler for car details proxy
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const makeName = searchParams.get('makeName');
  const year = searchParams.get('year');

  if (!makeName) {
    return new Response(JSON.stringify({ error: 'Make name is required' }), {
      status: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    // Get API key and URL from environment variables
    const apiKey = process.env.CAR_API_KEY;
    const apiUrl = process.env.CAR_API_URL || 'https://api.api-ninjas.com/v1/cars';
    
    if (!apiKey) {
      console.error('API key not found in environment variables');
      return new Response(JSON.stringify({ error: 'API configuration error' }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    const params = new URLSearchParams();
    
    // Add search params
    if (makeName) params.append('make', makeName);
    if (year) params.append('year', year);
    
    // Make the API request with environment variables
    const response = await fetch(`${apiUrl}?${params.toString()}`, {
      headers: {
        'X-Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`API responded with status ${response.status}`);
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error fetching car data:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to fetch car data' }),
      {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    );
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 */
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 