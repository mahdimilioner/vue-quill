export interface RenderAngle {
  id: string
  label: string
  hint: string
  rotateX: number
  rotateY: number
  scale: number
}

export const PRODUCT_RENDER =
  'https://media.base44.com/images/public/6b038232617793dfe75ad6bd/6443a17f487abad5884a393121f34edd_generated_09ae3789.png'

export const RENDER_ANGLES: RenderAngle[] = [
  {
    id: 'front',
    label: 'نمای روبه‌رو',
    hint: 'تمیز و مستقیم، مناسب کاتالوگ',
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  {
    id: 'three-quarter',
    label: 'نمای سه‌چهارم',
    hint: 'حجم بدنه و گریپ دیده می‌شود',
    rotateX: -6,
    rotateY: -20,
    scale: 1.02,
  },
  {
    id: 'top',
    label: 'نمای از بالا',
    hint: 'دید از بالای بدنه و مته',
    rotateX: -36,
    rotateY: -10,
    scale: 1.04,
  },
  {
    id: 'bottom',
    label: 'نمای از پایین',
    hint: 'باتری و صفحه زیرین دستگاه',
    rotateX: 36,
    rotateY: 10,
    scale: 1.04,
  },
]
