import axios from "axios";

const PINATA_API_URL = "https://api.pinata.cloud";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

export interface IPFSUploadResponse {
  ipfsHash: string;
  url: string;
}

export interface AgentMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: {
    category?: string;
    creator?: string;
    [key: string]: any;
  };
}

/**
 * Upload a file to IPFS via Pinata
 * Note: This should be called from a server-side API route to keep API keys secure
 */
export async function uploadFileToPinata(
  file: File,
  apiKey: string,
  apiSecret: string
): Promise<IPFSUploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: file.name,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinFileToIPFS`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return {
      ipfsHash,
      url: `${PINATA_GATEWAY}/${ipfsHash}`,
    };
  } catch (error) {
    console.error("Error uploading file to Pinata:", error);
    throw new Error("Failed to upload file to IPFS");
  }
}

/**
 * Upload JSON metadata to IPFS via Pinata
 * Note: This should be called from a server-side API route to keep API keys secure
 */
export async function uploadJSONToPinata(
  metadata: AgentMetadata,
  apiKey: string,
  apiSecret: string
): Promise<IPFSUploadResponse> {
  try {
    const response = await axios.post(
      `${PINATA_API_URL}/pinning/pinJSONToIPFS`,
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: apiKey,
          pinata_secret_api_key: apiSecret,
        },
      }
    );

    const ipfsHash = response.data.IpfsHash;
    return {
      ipfsHash,
      url: `${PINATA_GATEWAY}/${ipfsHash}`,
    };
  } catch (error) {
    console.error("Error uploading JSON to Pinata:", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
}

/**
 * Fetch metadata from IPFS
 */
export async function fetchFromIPFS<T = AgentMetadata>(
  ipfsHash: string
): Promise<T> {
  try {
    const response = await axios.get(`${PINATA_GATEWAY}/${ipfsHash}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching from IPFS:", error);
    throw new Error("Failed to fetch data from IPFS");
  }
}

/**
 * Get IPFS URL from hash
 */
export function getIPFSUrl(ipfsHash: string): string {
  return `${PINATA_GATEWAY}/${ipfsHash}`;
}

/**
 * Extract IPFS hash from URL
 */
export function extractIPFSHash(url: string): string | null {
  const match = url.match(/\/ipfs\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}
