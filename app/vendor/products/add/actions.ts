'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'

/**
 * 1. CREATE PRODUCT ACTION
 */
export async function createProduct(prevState: any, formData: FormData) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Session expired. Please login again.' }

  try {
    const baseUrl = 'https://api.easygear.ng/api/v1'

    /** * FIX: Added trailing slash. Laravel often redirects /products
     * to /products/, converting POST to GET in the process.
     */
    const endpoint = `${baseUrl}/products/`

    const apiPayload = new FormData()

    // Mapping fields
    apiPayload.append('vendor_id', formData.get('vendor_id') as string)
    apiPayload.append('name', formData.get('name') as string)
    apiPayload.append('sku', formData.get('sku') as string)
    apiPayload.append('category_id', formData.get('category_id') as string)
    apiPayload.append('price', formData.get('price') as string)
    apiPayload.append('description', formData.get('description') as string)

    // Hidden logic fields required by the API structure
    apiPayload.append(
      'short_description',
      (formData.get('short_description') as string) ||
        (formData.get('name') as string),
    )
    apiPayload.append('quantity', (formData.get('quantity') as string) || '1')
    apiPayload.append('weight', '0.5')
    apiPayload.append('dimensions', 'N/A')
    apiPayload.append('status', 'active')
    apiPayload.append('is_active', '1')
    apiPayload.append('is_featured', '0')

    // Handling image upload
    const images = formData.getAll('images[]')
    images.forEach((file) => {
      if (file instanceof File && file.size > 0) {
        apiPayload.append('images[]', file)
      }
    })

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        // Important: Let the browser set the Content-Type for FormData
      },
      body: apiPayload,
    })

    const result = await response.json()

    if (response.ok) {
      revalidatePath('/vendor/products')
      return { success: true, error: null }
    }

    // Capture Laravel validation errors
    const errorMessage = result.errors
      ? Object.values(result.errors).flat().join(', ')
      : result.message || 'Server rejected the request'

    return { success: false, error: errorMessage }
  } catch (err) {
    console.error('CREATE_PRODUCT_ERROR:', err)
    return { success: false, error: 'Connection to server failed.' }
  }
}

/**
 * 2. DELETE PRODUCT ACTION
 */
export async function deleteProduct(productId: number) {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value

  if (!token) return { error: 'Auth token missing.' }

  try {
    const baseUrl = 'https://api.easygear.ng/api/v1'

    // Using FormData for method spoofing which is safer for some PHP backends
    const apiPayload = new FormData()
    apiPayload.append('_method', 'DELETE')

    const res = await fetch(`${baseUrl}/products/${productId}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
      body: apiPayload,
    })

    if (res.ok) {
      revalidatePath('/vendor/products')
      return { success: true }
    }

    const errorData = await res.json().catch(() => ({}))
    return {
      success: false,
      error: errorData.message || 'The server refused to delete this product.',
    }
  } catch (err) {
    console.error('DELETE_PRODUCT_ERROR:', err)
    return { success: false, error: 'Network communication failure.' }
  }
}
