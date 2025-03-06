import { NextRequest } from 'next/server';

// Define vehicle data type
interface VehicleData {
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

// Mock vehicle database
const vehicleDatabase: VehicleData[] = [
  {
    id: "toyota-corolla",
    make_name: "Toyota",
    model_name: "Corolla",
    year_from: "2020",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "50", unit: "liters" }],
    engine_capacity: "1.8",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Ftoyota_corolla.jpg?alt=media"
  },
  {
    id: "toyota-camry",
    make_name: "Toyota",
    model_name: "Camry",
    year_from: "2018",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "60", unit: "liters" }],
    engine_capacity: "2.5",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Ftoyota_camry.jpg?alt=media"
  },
  {
    id: "toyota-rav4",
    make_name: "Toyota",
    model_name: "RAV4",
    year_from: "2019",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "55", unit: "liters" }],
    engine_capacity: "2.0",
    body_type: "SUV",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Ftoyota_rav4.jpg?alt=media"
  },
  {
    id: "bmw-3series",
    make_name: "BMW",
    model_name: "3 Series",
    year_from: "2019",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "59", unit: "liters" }],
    engine_capacity: "2.0",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fbmw_3series.jpg?alt=media"
  },
  {
    id: "mercedes-cclass",
    make_name: "Mercedes-Benz",
    model_name: "C-Class",
    year_from: "2019",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "66", unit: "liters" }],
    engine_capacity: "2.0",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fmercedes_cclass.jpg?alt=media"
  },
  {
    id: "ford-ranger",
    make_name: "Ford",
    model_name: "Ranger",
    year_from: "2019",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "80", unit: "liters" }],
    engine_capacity: "2.2",
    body_type: "Pickup",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fford_ranger.jpg?alt=media"
  },
  {
    id: "honda-civic",
    make_name: "Honda",
    model_name: "Civic",
    year_from: "2019",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "47", unit: "liters" }],
    engine_capacity: "1.5",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fhonda_civic.jpg?alt=media"
  },
  {
    id: "vw-golf",
    make_name: "Volkswagen",
    model_name: "Golf",
    year_from: "2018",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "50", unit: "liters" }],
    engine_capacity: "1.4",
    body_type: "Hatchback",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fvw_golf.jpg?alt=media"
  },
  {
    id: "nissan-xtrail",
    make_name: "Nissan",
    model_name: "X-Trail",
    year_from: "2017",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "60", unit: "liters" }],
    engine_capacity: "2.5",
    body_type: "SUV",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Fnissan_xtrail.jpg?alt=media"
  },
  {
    id: "audi-a4",
    make_name: "Audi",
    model_name: "A4",
    year_from: "2016",
    year_to: "2023",
    fuel_tank_capacity: [{ value: "58", unit: "liters" }],
    engine_capacity: "2.0",
    body_type: "Sedan",
    image: "https://firebasestorage.googleapis.com/v0/b/ntf-web-3fb77.appspot.com/o/vehicle_images%2Faudi_a4.jpg?alt=media"
  }
];

/**
 * API Route handler for car details - proxies requests to the external API
 */
export async function GET(request: NextRequest) {
  // Get search parameters
  const { searchParams } = new URL(request.url);
  const makeName = searchParams.get('makeName');
  const year = searchParams.get('year');
  
  console.log(`Car details API called with make: ${makeName}, year: ${year}`);
  
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
    
    console.log(`Proxying request to: ${externalApiUrl}?${params.toString()}`);
    
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
        console.error(`External API error: ${response.status}`);
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
      console.error('Error calling external API:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error processing request:', error);
    
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