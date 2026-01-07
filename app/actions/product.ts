// app/actions/product.ts
'use server'

import { revalidatePath } from 'next/cache'

export async function publishProduct(formData: any) {
  const API_BASE_URL = 'https://api.easygear.ng/api/v1'
  const token = 'YOUR_AUTH_TOKEN_HERE' // Ensure this is correct!

  try {
    console.log("📡 Initiating Sync to EasyGear Terminal...")

    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: formData.title,
        sku: formData.sku,
        description: formData.description,
        variants: formData.variants.map((v: any) => ({
          label: v.name,
          price: parseFloat(v.price) || 0,
          quantity: parseInt(v.stock) || 0,
        })),
        image_urls: formData.images, // Sending Base64 strings here
        logistics: formData.settings,
      }),
    })

    const responseData = await response.json()

    if (!response.ok) {
      console.error("❌ TERMINAL REJECTED:", responseData)
      return { error: responseData.message || 'Terminal rejected the data.' }
    }

    console.log("✅ SYNC SUCCESSFUL")
    revalidatePath('/vendor/inventory')
    return { success: true }

  } catch (error: any) {
    // THIS LOGS TO YOUR TERMINAL WINDOW (The one in your screenshot)
    console.error("🚨 CONNECTION_ERROR_LOG:", error.message)
    
    if (error.message.includes('fetch failed')) {
      return { error: "Network Error: Is the API URL correct and reachable?" }
    }
    
    return { error: `Connection failed: ${error.message}` }
  }
}

// export async function publishProduct(formData: any) {
//   // SIMULATE API DELAY
//   await new Promise((resolve) => setTimeout(resolve, 2000))

//   // MOCK SUCCESS (Comment this out once you get the real token)
//   console.log('Mock Syncing data:', formData)
//   return { success: true }
// }