import desktop from '@/router/desktop'
import mobile from '@/router/mobile'
const supperRouter = isTouchDevice ? mobile : desktop
export default supperRouter
