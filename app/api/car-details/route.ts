import { NextRequest, NextResponse } from 'next/server';

// Define vehicle data type
export interface VehicleData {
  id: string;
  make_name: string;
  model_name: string;
  year_from: string;
  year_to?: string;
  fuel_tank_capacity: Array<{ value: string; unit: string }>;
  engine_capacity: string;
  body_type: string;
  image?: string;
}

/**
 * API Route handler for car details - proxies requests to the external API
 */
export async function GET(request: NextRequest) {
  // Get search parameters
  const { searchParams } = new URL(request.url);
  const makeName = searchParams.get('makeName');
  const year = searchParams.get('year');
  
  
  if (!makeName) {
    return new Response(JSON.stringify({ error: 'Make name is required' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json'
      },
    });
  }

  try {
    // Create the parameters for the external API
    const params = new URLSearchParams();
    
    if (makeName) params.append('makeName', makeName);
    if (year) params.append('year', year);
    
    // External API URL
    const externalApiUrl = `http://206.189.22.2:3000/car-details`;
    
    
    // Set a timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    try {
      // Make the API request to the external API
      const response = await fetch(`${externalApiUrl}?${params.toString()}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`External API returned ${response.status}`);
      }
      
      // Get the data from the external API
      const data = await response.json();
      
      // Return the data from the external API
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
          'Content-Type': 'application/json'
        },
      });
    } catch (apiError) {
      throw apiError;
    }
  } catch (error) {
    
    return new Response(JSON.stringify({ 
      error: 'Failed to fetch car data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      },
    });
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