import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // Get IP address from request headers
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : req.headers.get('x-real-ip') || 'Unknown';
    
    // Get geolocation data from IP
    let country = 'Unknown';
    let city = 'Unknown';
    let region = 'Unknown';
    
    try {
      // Use a free geolocation API
      const geoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      if (geoResponse.ok) {
        const geoData = await geoResponse.json();
        country = geoData.country_name || 'Unknown';
        city = geoData.city || 'Unknown';
        region = geoData.region || 'Unknown';
      }
    } catch {
      return NextResponse.json(
        { error: "Failed to save visitor data" },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      ipAddress: ip,
      country,
      city,
      region,
      timestamp: new Date().toISOString()
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to save visitor data" },
      { status: 500 }
    );
  }
} 