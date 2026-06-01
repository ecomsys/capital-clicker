import { useLocation } from "react-router-dom"
import { NAVBAR_ROUTES } from "@/config/bottomNavbar"

export function useShouldShowNavbar() {
  const location = useLocation()
  const currentPath = location.pathname

  // Если путь точно в списке — показываем
  if (NAVBAR_ROUTES.includes(currentPath)) return true
  
  // Если есть параметры в пути (например, /profile/123) — проверяем базовый путь
  const basePath = currentPath.split('/')[1]
  if (NAVBAR_ROUTES.includes(`/${basePath}`)) return true
  
  return false
}