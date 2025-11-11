"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { AlertCircle, CheckCircle2, Upload, X, Image as ImageIcon } from "lucide-react";
import { AgentMetadata } from "@/lib/ipfs";
import { registerAgent } from "@/lib/solana";

export default function RegisterPage() {
  const wallet = useWallet();
  const { connection } = useConnection();
  const { connected } = wallet;
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isUploadingMetadata, setIsUploadingMetadata] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [metadataUri, setMetadataUri] = useState("");

  // Handle image file selection
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setError("Only JPEG, PNG, GIF, and WebP images are allowed");
        return;
      }

      setImageFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  // Upload image to IPFS
  const uploadImageToIPFS = async (): Promise<string> => {
    if (!imageFile) {
      throw new Error("No image file selected");
    }

    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", imageFile);

      const response = await fetch("/api/ipfs/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload image");
      }

      const data = await response.json();
      return data.url;
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Upload metadata to IPFS
  const uploadMetadataToIPFS = async (imageUrl: string): Promise<string> => {
    setIsUploadingMetadata(true);
    try {
      const metadata: AgentMetadata = {
        name: formData.name,
        description: formData.description,
        image: imageUrl,
        properties: {
          category: formData.category || "General",
        },
      };

      const response = await fetch("/api/ipfs/upload-metadata", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to upload metadata");
      }

      const data = await response.json();
      return data.url;
    } finally {
      setIsUploadingMetadata(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!connected) {
      setError("Please connect your wallet first");
      return;
    }

    if (!imageFile) {
      setError("Please upload an image for your agent");
      return;
    }

    // Validate form
    if (formData.name.length > 50) {
      setError("Name must be 50 characters or less");
      return;
    }
    if (formData.description.length > 500) {
      setError("Description must be 500 characters or less");
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload image to IPFS
      const imageUrl = await uploadImageToIPFS();

      // Step 2: Upload metadata (including image URL) to IPFS
      const metadataUrl = await uploadMetadataToIPFS(imageUrl);
      setMetadataUri(metadataUrl);

      // Step 3: Register agent on Solana blockchain
      const txSignature = await registerAgent({
        name: formData.name,
        metadataUri: metadataUrl,
        description: formData.description,
        wallet,
        connection,
      });
      console.log("Agent registered on blockchain! TX:", txSignature);

      setSuccess(true);
      setFormData({ name: "", description: "", category: "" });
      setImageFile(null);
      setImagePreview("");
    } catch (err: any) {
      setError(err.message || "Failed to register agent");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Register New Agent</h1>
        <p className="text-muted-foreground mb-8">
          Register your AI agent on the AgentSea marketplace with IPFS storage
        </p>

        {!connected && (
          <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
            <div>
              <p className="font-medium text-yellow-500">Wallet Not Connected</p>
              <p className="text-sm text-muted-foreground">
                Please connect your Solana wallet to register an agent
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-md flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium text-green-500">Agent Registered Successfully!</p>
              <p className="text-sm text-muted-foreground">
                Your agent has been registered on the blockchain
              </p>
              {metadataUri && (
                <p className="text-xs text-muted-foreground mt-2">
                  Metadata URI: <a href={metadataUri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{metadataUri}</a>
                </p>
              )}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Agent Image <span className="text-red-500">*</span>
            </label>
            {!imagePreview ? (
              <label
                htmlFor="image-upload"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="h-12 w-12 text-muted-foreground mb-3" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF or WebP (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="image-upload"
                  type="file"
                  className="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handleImageChange}
                />
              </label>
            ) : (
              <div className="relative w-full h-64 border-2 border-border rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-2">
              Agent Name <span className="text-red-500">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              maxLength={50}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="AI Trading Bot"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.name.length}/50 characters
            </p>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select a category</option>
              <option value="Trading">Trading</option>
              <option value="Analytics">Analytics</option>
              <option value="Content Creation">Content Creation</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Development">Development</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              maxLength={500}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Describe what your AI agent does..."
            />
            <p className="text-xs text-muted-foreground mt-1">
              {formData.description.length}/500 characters
            </p>
          </div>

          <button
            type="submit"
            disabled={!connected || isSubmitting || !imageFile}
            className="w-full inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground hover:bg-primary/90 h-12 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploadingImage && "Uploading image to IPFS..."}
            {isUploadingMetadata && "Uploading metadata to IPFS..."}
            {!isUploadingImage && !isUploadingMetadata && isSubmitting && "Registering on blockchain..."}
            {!isSubmitting && "Register Agent"}
          </button>
        </form>

        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="font-semibold mb-2">How it works</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Upload your agent image to IPFS (decentralized storage)</li>
            <li>• Metadata is automatically created and stored on IPFS</li>
            <li>• Your agent is registered on Solana blockchain with the IPFS metadata URI</li>
            <li>• Users can stake $AGENTS tokens and provide ratings (0-100)</li>
            <li>• Reputation is calculated on-chain based on stakes and feedback</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
