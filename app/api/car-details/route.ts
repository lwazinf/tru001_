import { NextRequest, NextResponse } from 'next/server';

// Fallback data in case the external API is unavailable
const FALLBACK_VEHICLE_DATA = [
  {
    "make_id": 79,
    "make_name": "Toyota",
    "model_id": 822,
    "model_name": "Corolla",
    "year_from": 2019,
    "year_to": 2023,
    "engine_capacity": "1.8",
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 79,
    "make_name": "Toyota",
    "model_id": 823,
    "model_name": "Corolla Cross",
    "year_from": 2020,
    "year_to": 2023,
    "engine_capacity": "1.8",
    "body_type": "SUV",
    "fuel_type": "Hybrid",
    "transmission_type": "CVT"
  },
  {
    "make_id": 79,
    "make_name": "Toyota",
    "model_id": 824,
    "model_name": "Corolla Hatch",
    "year_from": 2018,
    "year_to": 2023,
    "engine_capacity": "2.0",
    "body_type": "Hatchback",
    "fuel_type": "Petrol",
    "transmission_type": "Manual"
  },
  {
    "make_id": 24,
    "make_name": "BMW",
    "model_id": 320,
    "model_name": "3 Series",
    "year_from": 2019,
    "year_to": 2023,
    "engine_capacity": "2.0",
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 24,
    "make_name": "BMW",
    "model_id": 321,
    "model_name": "X3",
    "year_from": 2018,
    "year_to": 2023,
    "engine_capacity": "2.0",
    "body_type": "SUV",
    "fuel_type": "Diesel",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 24,
    "make_name": "BMW",
    "model_id": 322,
    "model_name": "5 Series",
    "year_from": 2002,
    "year_to": 2010,
    "engine_capacity": "2.5",
    "body_type": "Sedan",
    "fuel_type": "Petrol",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 24,
    "make_name": "BMW",
    "model_id": 323,
    "model_name": "X5",
    "year_from": 2000,
    "year_to": 2006,
    "engine_capacity": "4.4",
    "body_type": "SUV",
    "fuel_type": "Petrol",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 45,
    "make_name": "Ford",
    "model_id": 432,
    "model_name": "Ranger",
    "year_from": 2019,
    "year_to": 2023,
    "engine_capacity": "2.0",
    "body_type": "Pickup",
    "fuel_type": "Diesel",
    "transmission_type": "Automatic"
  },
  {
    "make_id": 45,
    "make_name": "Ford",
    "model_id": 433,
    "model_name": "Mustang",
    "year_from": 2018,
    "year_to": 2023,
    "engine_capacity": "5.0",
    "body_type": "Coupe",
    "fuel_type": "Petrol",
    "transmission_type": "Manual"
  }
];

/**
 * Filters the fallback data based on query parameters
 */
function filterFallbackData(makeName?: string, year?: string) {
  let filteredData = [...FALLBACK_VEHICLE_DATA];
  
  // Filter by make if provided
  if (makeName) {
    const makeLower = makeName.toLowerCase();
    filteredData = filteredData.filter(v => 
      v.make_name.toLowerCase().includes(makeLower)
    );
  }
  
  // Filter by year if provided
  if (year) {
    const yearNum = parseInt(year);
    if (!isNaN(yearNum)) {
      filteredData = filteredData.filter(v => 
        v.year_from <= yearNum && (v.year_to == null || v.year_to >= yearNum)
      );
    }
  }
  
  return filteredData;
}

/**
 * API Route handler for car details proxy
 */
export async function GET(request: NextRequest) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const makeName = searchParams.get('makeName') || undefined;
  const year = searchParams.get('year') || undefined;
  
  try {
    // Build the URL to the external API
    const params = new URLSearchParams();
    if (makeName) params.append('makeName', makeName);
    if (year) params.append('year', year);
    
    const apiUrl = `http://206.189.22.2:3000/car-details?${params.toString()}`;
    
    // Set timeout for the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // Fetch data from the external API
    const response = await fetch(apiUrl, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Return the data with proper CORS headers
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
    });
  } catch (error: any) {
    console.error('API proxy error:', error);
    
    // If there's an error, return the filtered fallback data
    const fallbackData = filterFallbackData(makeName, year);
    
    return NextResponse.json(fallbackData, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      }
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