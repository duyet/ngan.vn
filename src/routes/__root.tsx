/// <reference types="vite/client" />
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
  useRouterState,
} from '@tanstack/react-router'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Ngan.vn' },
      { property: 'og:title', content: 'Ngan.vn - Cakes and Sweets' },
      {
        property: 'og:description',
        content:
          'Chào đón bạn ghé thăm trang web của chúng mình - nơi chứa đựng những điều dễ thương và ngọt ngào ❤️',
      },
      { property: 'og:image', content: 'https://ngan.vn/wp-content/uploads/2018/12/logo-ngan-black.png' },
    ],
    links: [
      { rel: 'icon', href: '/wp-content/uploads/2018/12/logo-ngan-black.png' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  // /cake reproduces the original WordPress gallery page: it needs the
  // exact body classes the Kale theme CSS targets (body.custom-background, …).
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isCake = pathname.startsWith('/cake')
  const bodyClass = isCake
    ? 'home page-template-gallery-page page custom-background wp-custom-logo wp-theme-kale js'
    : 'landing'

  return (
    <html lang="vi">
      <head>
        <HeadContent />
      </head>
      <body className={bodyClass}>
        <Outlet />
        <Scripts />
      </body>
    </html>
  )
}
