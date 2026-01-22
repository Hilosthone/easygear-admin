'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

/**
 * 1. CREATE PRODUCT
 * Standard multipart/form-data registration
 */
export async function createProduct(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Session expired. Please log in again.' }

  try {
    const baseUrl = 'https://api.easygear.ng/api/v1'
    const targetUrl = `${baseUrl}/products`
    const apiData = new FormData()

    const vendorId = formData.get('vendor_id') as string
    if (!vendorId) return { error: 'Vendor Identity missing.' }

    apiData.append('vendor_id', vendorId)
    apiData.append('user_id', vendorId)
    apiData.append('name', formData.get('name') as string)
    apiData.append('price', formData.get('price') as string)
    apiData.append('quantity', formData.get('quantity') as string)
    apiData.append('category_id', formData.get('category_id') as string)
    apiData.append('description', formData.get('description') as string)

    const shortDesc =
      (formData.get('short_description') as string) ||
      (formData.get('name') as string).substring(0, 50)
    apiData.append('short_description', shortDesc)

    const sku =
      (formData.get('sku') as string) ||
      `EG-${Math.random().toString(36).toUpperCase().substring(2, 7)}`
    apiData.append('sku', sku)
    apiData.append('weight', (formData.get('weight') as string) || '0')
    apiData.append(
      'dimensions',
      (formData.get('dimensions') as string) || 'N/A',
    )
    apiData.append('status', 'active')
    apiData.append('is_featured', '0')

    const imageFiles = formData.getAll('images[]')
    imageFiles.forEach((file) => {
      if (file instanceof File && file.size > 0)
        apiData.append('images[]', file)
    })

    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
      body: apiData,
    })

    if (!response.ok) {
      const result = await response.json()
      return { error: result.message || 'Registration failed' }
    }

    revalidatePath('/vendor/products')
    return { success: true }
  } catch (err) {
    console.error('CREATE_ERROR:', err)
    return { error: 'Network communication failure.' }
  }
}

/**
 * 2. DELETE PRODUCT
 * Uses numeric ID and Method Spoofing.
 * Even if the frontend shows slugs, the "Destroy" route typically requires the ID.
 */
export async function deleteProduct(productId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Session expired.' }

  try {
    const baseUrl = 'https://api.easygear.ng/api/v1'

    // Create FormData for Laravel method spoofing
    const apiData = new FormData()
    apiData.append('_method', 'DELETE')

    const response = await fetch(`${baseUrl}/products/${productId}`, {
      method: 'POST', // POST is the wrapper for spoofing
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: apiData,
    })

    if (response.ok) {
      revalidatePath('/vendor/products')
      return { success: true }
    }

    // Secondary Fallback: Direct DELETE
    if (response.status === 405) {
      const fallback = await fetch(`${baseUrl}/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      if (fallback.ok) {
        revalidatePath('/vendor/products')
        return { success: true }
      }
    }

    const result = await response.json()
    return { error: result.message || 'Deletion rejected by server.' }
  } catch (err) {
    console.error('DELETE_ERROR:', err)
    return { error: 'Network communication failure.' }
  }
}
