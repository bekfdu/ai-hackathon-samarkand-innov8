interface VisionAPIResponse {
  success: boolean;
  extractedText?: string;
  error?: string;
}

export class VisionService {
  private static async getAPIKey(): Promise<string | null> {
    try {
      // In a Supabase environment, we would get this from edge functions
      // For now, we'll use localStorage as fallback
      return localStorage.getItem('vision_api_key');
    } catch (error) {
      console.error('Error getting API key:', error);
      return null;
    }
  }

  static async extractTextFromImage(imageFile: File): Promise<VisionAPIResponse> {
    try {
      const apiKey = await this.getAPIKey();
      if (!apiKey) {
        return {
          success: false,
          error: 'Vision API key not configured. Please set it in your profile.'
        };
      }

      // Convert image to base64
      const base64Image = await this.fileToBase64(imageFile);
      
      // Call Google Cloud Vision API
      const response = await fetch(`https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requests: [
            {
              image: {
                content: base64Image.split(',')[1] // Remove data:image/jpeg;base64, prefix
              },
              features: [
                {
                  type: 'TEXT_DETECTION',
                  maxResults: 1
                }
              ]
            }
          ]
        })
      });

      if (!response.ok) {
        throw new Error(`Vision API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.responses && data.responses[0] && data.responses[0].textAnnotations) {
        const extractedText = data.responses[0].textAnnotations[0].description;
        return {
          success: true,
          extractedText
        };
      } else {
        return {
          success: false,
          error: 'No text found in the image'
        };
      }
    } catch (error) {
      console.error('Vision API error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to extract text from image'
      };
    }
  }

  private static async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  }

  static setAPIKey(apiKey: string): void {
    localStorage.setItem('vision_api_key', apiKey);
  }

  static getStoredAPIKey(): string | null {
    return localStorage.getItem('vision_api_key');
  }
}