export interface Product {
  id: string
  business_id: string
  name: string
  description?: string
  price: number
  category: string
  image_url?: string
  image_focal_x: number  // Punto focal horizontal (0-100), default 50
  image_focal_y: number  // Punto focal vertical (0-100), default 50
  available: boolean
  created_at: string
}
 