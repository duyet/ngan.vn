import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Ngan.vn' }],
    links: [{ rel: 'stylesheet', href: '/landing.css' }],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="landing-center">
      <a href="/cake" className="landing-logo">
        <img
          src="/wp-content/uploads/2019/09/logo-small.png"
          alt="Ngan.vn — Cakes & Sweets"
          width={500}
          height={234}
        />
      </a>
    </div>
  )
}
