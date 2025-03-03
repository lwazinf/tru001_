import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { generateSha512 } from './genSha';

// Constants
const PRIVATE_KEY = "LGHols43XVKH4pi4WdRwbdTM7ZYnYo19";
const API_KEY = "qH5FgfIwE6qdpSI9XvpP51C9DLZ7POum";

export async function POST(request: NextRequest) {
  try {
    // Get request data
    const requestData = await request.json();
    console.log("Received request data:", requestData);
    
    // Base payment data
    const baseData = {
      siteCode: "NEE-NEE-003",
      countryCode: "ZA",
      currencyCode: "ZAR",
      cancelUrl: "https://www.youtube.com/watch?v=b1SJ3UF4AWE",
      errorUrl: "https://www.needtofuel.com/auth",
      successUrl: "https://www.needtofuel.com/dash",
      notifyUrl: "https://hook.eu2.make.com/3kq4t19wngrc3ojq3hfipodwhotlz1he",
      isTest: true,
    };
    
    // Merge request data with base data (request data takes precedence)
    const mergedData = {
      ...baseData,
      ...requestData,
    };
    
    // 1. Concatenate post variables in the exact order they appear in the post variables table
    // Following the Ozow documentation order, but only include what we actually use
    const orderedData = [
      mergedData.siteCode,
      mergedData.countryCode,
      mergedData.currencyCode,
      mergedData.amount,
      mergedData.transactionReference,
      mergedData.bankReference,
      mergedData.cancelUrl,
      mergedData.errorUrl,
      mergedData.successUrl,
      mergedData.notifyUrl,
      mergedData.isTest ? "true" : "false"
    ];
    
    // Concatenate the ordered values
    const concatenatedString = orderedData.join('');
    
    // 2. Append private key
    const stringWithKey = concatenatedString + PRIVATE_KEY;
    
    // 3. Convert to lowercase
    const lowercaseString = stringWithKey.toLowerCase();
    
    // 4. Generate SHA512 hash
    const hashCheck = generateSha512(lowercaseString);
    
    console.log("Hash Generation:");
    console.log("1. Concatenated String:", concatenatedString);
    console.log("2. With Private Key (partial):", concatenatedString.substring(0, 20) + "..." + PRIVATE_KEY.substring(0, 3) + "...");
    console.log("3. Lowercase String (partial):", lowercaseString.substring(0, 30) + "...");
    console.log("4. Final Hash:", hashCheck);
    
    // Final data object for the API (exclude privateKey)
    const dataToSend = {
      siteCode: mergedData.siteCode,
      countryCode: mergedData.countryCode,
      currencyCode: mergedData.currencyCode,
      amount: mergedData.amount,
      transactionReference: mergedData.transactionReference,
      bankReference: mergedData.bankReference,
      cancelUrl: mergedData.cancelUrl,
      errorUrl: mergedData.errorUrl,
      successUrl: mergedData.successUrl,
      notifyUrl: mergedData.notifyUrl,
      isTest: mergedData.isTest,
      hashCheck: hashCheck
    };
    
    console.log("Final payment data:", dataToSend);

    // API configuration
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://stagingapi.ozow.com/PostPaymentRequest',
      headers: { 
        'ApiKey': API_KEY, 
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
      },
      data: dataToSend
    };

    // Make the API call
    const response = await axios.request(config);
    
    // Log the response to server console
    console.log("Payment API Response:", JSON.stringify(response.data, null, 2));
    
    // Return the response to the client
    return NextResponse.json(
      { 
        success: true, 
        data: response.data 
      }, 
      { status: 200 }
    );
  } catch (error: any) {
    // Log error to server console
    console.error("Payment API Error:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
      console.error("Response status:", error.response.status);
    }
    
    // Return error to client
    return NextResponse.json(
      { 
        success: false, 
        error: error.message 
      }, 
      { status: 500 }
    );
  }
}

// GET method to explain the endpoint usage
export async function GET() {
  return NextResponse.json(
    { 
      message: "This endpoint processes payment requests to Ozow. Please use POST method." 
    }, 
    { status: 200 }
  );
}
