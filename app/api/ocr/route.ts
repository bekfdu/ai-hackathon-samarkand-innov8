import { NextRequest, NextResponse } from 'next/server'

const OCR_ENDPOINT = "https://educhecktexttest1111.onrender.com/detect"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { image, image_base64 } = body

    // Accept both formats for flexibility
    const base64Image = image_base64 || image

    if (!base64Image) {
      return NextResponse.json(
        { error: 'Image data is required (image_base64 field)' },
        { status: 400 }
      )
    }

    console.log('OCR API: Processing image, base64 length:', base64Image.length)

    try {
      console.log('OCR API: Sending request to Google Vision API endpoint')
      
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 35000) // 35 second timeout

      const response = await fetch(OCR_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'EduCheck-OCR/1.0',
        },
        body: JSON.stringify({
          image_base64: base64Image
        }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)
      
      console.log('OCR API: Response status:', response.status, response.statusText)

      if (response.ok) {
        const data = await response.json()
        console.log('OCR API: Success response received')
        
        // Handle your server's response format
        let extractedText = ""
        let confidence = 0.95
        let detectedLanguage = 'uzbek'
        
        if (data.texts && Array.isArray(data.texts) && data.texts.length > 0) {
          // The first element usually contains the full text
          if (data.texts[0] && data.texts[0].description) {
            extractedText = data.texts[0].description.trim()
          } else {
            // Fallback: combine all text descriptions
            extractedText = data.texts
              .map((text: any) => text.description || '')
              .filter((desc: string) => desc.trim() !== '')
              .join(' ')
              .trim()
          }
        }
        
        if (!extractedText || extractedText.trim() === '') {
          return NextResponse.json({
            error: "No text found in image",
            text: "",
            confidence: 0,
            language: 'unknown',
            success: false
          }, { status: 200 })
        }

        // Simple language detection
        if (/[а-яё]/i.test(extractedText)) {
          detectedLanguage = 'russian'
        } else if (/[a-z]/i.test(extractedText) && !/[ўғқҳ]/i.test(extractedText)) {
          detectedLanguage = 'english'
        } else if (/[çğıöşü]/i.test(extractedText)) {
          detectedLanguage = 'turkish'
        }

        return NextResponse.json({
          text: extractedText,
          confidence: confidence,
          language: detectedLanguage,
          success: true,
          boundingBoxes: data.texts
        })
      } else {
        const errorText = await response.text()
        console.log('OCR API: Error response:', response.status, errorText)
        
        // Handle specific HTTP errors
        if (response.status === 413) {
          return NextResponse.json({
            error: "Image file too large",
            success: false
          }, { status: 413 })
        } else if (response.status === 429) {
          return NextResponse.json({
            error: "Too many requests",
            success: false
          }, { status: 429 })
        } else if (response.status >= 500) {
          return NextResponse.json({
            error: "Server error",
            success: false
          }, { status: 500 })
        } else {
          return NextResponse.json({
            error: `API Error: ${response.status}`,
            success: false
          }, { status: response.status })
        }
      }
    } catch (error) {
      console.log('OCR API: Request failed:', error)
      
      if (error instanceof Error && error.name === 'AbortError') {
        return NextResponse.json({
          error: "Request timeout",
          success: false
        }, { status: 408 })
      }
      
      throw error
    }

  } catch (error) {
    console.error('OCR API: Server error:', error)
    
    return NextResponse.json({
      error: "Internal server error",
      success: false
    }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'OCR API is running',
    endpoint: '/api/ocr',
    method: 'POST',
    required: ['image_base64'],
    format: 'Base64 encoded image string',
    maxSize: '5MB',
    supportedFormats: ['JPG', 'PNG', 'GIF', 'WebP']
  })
}
