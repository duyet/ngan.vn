import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [{ title: 'Ngan.vn' }],
    links: [
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Caveat|Noto+Serif:400,400i,700|Dancing+Script&subset=vietnamese',
      },
      { rel: 'stylesheet', href: '/landing.css' },
    ],
  }),
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="paper">
      <header className="paper-header">
        <a href="/" className="paper-logo">
          <img
            src="/wp-content/uploads/2019/09/logo-small.png"
            alt="Ngan.vn — Cakes & Sweets"
            width={500}
            height={234}
          />
        </a>
      </header>

      <main className="paper-body">
        <article className="letter">
          <div className="letter-date">2026</div>
          <h1 className="letter-title">Gửi bạn thân mến,</h1>
          <p>
            Cảm ơn bạn đã cùng đồng hành với ngan.vn trong suốt những năm vừa
            qua. Hẹn gặp lại các bạn ở một diện mạo mới trong hành trình mới
            nhé <span className="heart">❤</span>
          </p>
          <p className="letter-signature">— Ngân</p>
        </article>

        <div className="divider" aria-hidden="true">
          ✿
        </div>

        <a href="/cake" className="cake-link">
          Cakes &amp; Sweets →
        </a>
      </main>

      <footer className="paper-footer">
        <a href="https://facebook.com/me.ngan.vn" className="social-link">
          Facebook
        </a>
        <span className="dot">·</span>
        <a href="https://instagram.com/nganluu.nn" className="social-link">
          Instagram
        </a>
        <p className="copyright">
          (c) ngan.vn with <span className="heart">❤</span>
        </p>
      </footer>
    </div>
  )
}
