'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

const BASE_URL = 'https://api.easygear.ng/api/v1'

console.log('SERVER: actions.ts initialized')

/**
 * 1. CREATE PRODUCT ACTION
 * Targeting /vendor/products because /products is GET only.
 */
export async function createProduct(prevState: any, formData: FormData) {
  console.log('--- 🚀 SERVER ACTION STARTED ---')

  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value

    if (!token) {
      console.error('❌ DEBUG: No auth token found.')
      return { success: false, error: 'Session expired. Please login again.' }
    }

    const apiPayload = new FormData()

    // 1. Map basic fields
    const fields = [
      'vendor_id',
      'name',
      'sku',
      'category_id',
      'price',
      'description',
      'quantity',
    ]

    fields.forEach((field) => {
      const value = formData.get(field)
      if (value) apiPayload.append(field, value as string)
    })

    // 2. Map logic defaults
    apiPayload.append(
      'short_description',
      (formData.get('short_description') as string) ||
        (formData.get('name') as string),
    )
    apiPayload.append('weight', (formData.get('weight') as string) || '0.5')
    apiPayload.append(
      'dimensions',
      (formData.get('dimensions') as string) || 'N/A',
    )
    apiPayload.append('status', (formData.get('status') as string) || 'active')
    apiPayload.append('is_active', '1')
    apiPayload.append(
      'is_featured',
      formData.get('is_featured') === '1' ? '1' : '0',
    )

    // 3. Handle Images
    const imageFiles = formData.getAll('images[]')
    imageFiles.forEach((file, index) => {
      if (file instanceof File && file.size > 0) {
        console.log(`Adding image ${index}: ${file.name}`)
        apiPayload.append('images[]', file)
      }
    })

    // 4. API Request - Switched to /vendor/products for creation
    console.log('📡 Sending POST to:', `${BASE_URL}/vendor/products`)
    const response = await fetch(`${BASE_URL}/vendor/products`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: apiPayload,
    })

    const result = await response.json()

    console.log('--- 📡 API RESPONSE ---')
    console.log('Status:', response.status)
    console.log('Body:', JSON.stringify(result, null, 2))

    if (response.ok || response.status === 201) {
      console.log('✅ PRODUCT CREATED SUCCESSFULLY')
      revalidatePath('/vendor/products')
      return { success: true, error: null }
    }

    const errorMessage = result.errors
      ? Object.values(result.errors).flat().join(', ')
      : result.message || 'Server rejected the request'

    console.error('❌ API ERROR:', errorMessage)
    return { success: false, error: errorMessage }
  } catch (err) {
    console.error('💥 CRITICAL ERROR:', err)
    return { success: false, error: 'Connection to server failed.' }
  }
}

/**
 * 2. DELETE PRODUCT ACTION
 */
export async function deleteProduct(productId: number) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth_token')?.value
    if (!token) return { success: false, error: 'Auth token missing.' }

    console.log(`--- 🗑️ DELETING PRODUCT: ${productId} ---`)

    // Use /vendor/products/${id} for deletion if it's a vendor-scoped action
    const res = await fetch(`${BASE_URL}/vendor/products/${productId}`, {
      method: 'DELETE', // Try native DELETE first
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    })

    if (res.ok) {
      revalidatePath('/vendor/products')
      return { success: true }
    }

    // Fallback for APIs that require POST spoofing for DELETE
    const result = await res.json().catch(() => ({}))
    return { success: false, error: result.message || 'Delete failed.' }
  } catch (err) {
    console.error('Delete Error:', err)
    return { success: false, error: 'Network communication failure.' }
  }
}