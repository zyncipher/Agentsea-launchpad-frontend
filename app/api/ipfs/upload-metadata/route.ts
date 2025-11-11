import { NextRequest, NextResponse } from "next/server";
import { uploadJSONToPinata, AgentMetadata } from "@/lib/ipfs";

export async function POST(request: NextRequest) {
  try {
    const metadata: AgentMetadata = await request.json();

    if (!metadata.name || !metadata.description) {
      return NextResponse.json(
        { error: "Name and description are required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;

    if (!apiKey || !apiSecret) {
      console.error("Pinata API credentials not configured");
      return NextResponse.json(
        { error: "IPFS service not configured" },
        { status: 500 }
      );
    }

    const result = await uploadJSONToPinata(metadata, apiKey, apiSecret);

    return NextResponse.json({
      success: true,
      ipfsHash: result.ipfsHash,
      url: result.url,
    });
  } catch (error) {
    console.error("Error in upload-metadata API:", error);
    return NextResponse.json(
      { error: "Failed to upload metadata" },
      { status: 500 }
    );
  }
}
