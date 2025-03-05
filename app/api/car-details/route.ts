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
// function filterFallbackData(makeName?: string, year?: string) {
//   let filteredData = [...FALLBACK_VEHICLE_DATA];
  
//   // Filter by make if provided
//   if (makeName) {
//     const makeLower = makeName.toLowerCase();
//     filteredData = filteredData.filter(v => 
//       v.make_name.toLowerCase().includes(makeLower)
//     );
//   }
  
//   // Filter by year if provided
//   if (year) {
//     const yearNum = parseInt(year);
//     if (!isNaN(yearNum)) {
//       filteredData = filteredData.filter(v => 
//         v.year_from <= yearNum && (v.year_to == null || v.year_to >= yearNum)
//       );
//     }
//   }
  
//   return filteredData;
// }

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