import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import cakes from '~/data/cakes.json'

export const Route = createFileRoute('/cake')({
  head: () => ({
    meta: [
      { title: 'Ngan.vn - Cakes & Sweets' },
    ],
    links: [
      // Same load order as the original WordPress page
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Montserrat:400,700' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Lato:400,700,300,300italic,400italic,700italic' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Raleway:200' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Caveat' },
      { rel: 'stylesheet', href: '/theme/assets/css/bootstrap.min.css' },
      { rel: 'stylesheet', href: '/theme/assets/css/jquery.smartmenus.bootstrap.css' },
      { rel: 'stylesheet', href: '/theme/assets/css/font-awesome.min.css' },
      { rel: 'stylesheet', href: '/theme/assets/css/magnific-popup.css' },
      { rel: 'stylesheet', href: '/theme/style.css' },
      { rel: 'stylesheet', href: '/cake-extra.css' },
    ],
  }),
  component: CakePage,
})

/** Original absolute URLs → same paths served by this site. */
function rel(url: string): string {
  return url.replace(/^https:\/\/ngan\.vn/, '').replace(
    '/wp-content/themes/kale/assets/',
    '/theme/assets/',
  )
}

function relSrcset(srcset: string): string | undefined {
  if (!srcset) return undefined
  return srcset
    .split(',')
    .map((part) => rel(part.trim()))
    .join(', ')
}

const FILTERS = [
  { filter: '*', label: ' Tất cả' },
  { filter: '.category-banh-hoa', label: 'Bánh hoa' },
  { filter: '.category-banh-bup-be', label: 'Bánh búp bê' },
  { filter: '.category-banh-trang-tri-hinh-ve', label: 'Bánh trang trí hình vẽ' },
  { filter: '.category-banh-tang-banh-cuoi', label: 'Bánh tầng, bánh cưới' },
  { filter: '.category-banh-mau-khac', label: 'Bánh mẫu khác' },
  { filter: '.category-banh-mau-don-gian', label: 'Bánh mẫu đơn giản' },
  { filter: '.category-cupcake', label: 'Cupcake' },
]

const NAV_CATEGORIES = [
  { slug: 'banh-hoa', label: 'Bánh hoa' },
  { slug: 'banh-bup-be', label: 'Bánh búp bê' },
  { slug: 'banh-trang-tri-hinh-ve', label: 'Bánh trang trí hình vẽ' },
  { slug: 'banh-tang-banh-cuoi', label: 'Bánh tầng, bánh cưới' },
  { slug: 'banh-mau-khac', label: 'Bánh mẫu khác' },
  { slug: 'banh-mau-don-gian', label: 'Bánh mẫu đơn giản' },
  { slug: 'cupcake', label: 'Cupcake' },
]

const LEGACY_SCRIPTS = [
  '/theme/assets/js/jquery.min.js',
  '/theme/assets/js/imagesloaded.pkgd.min.js',
  '/theme/assets/js/jquery.isotope.js',
  '/theme/assets/js/jquery.magnific-popup.min.js',
  '/cake-init.js',
]

function CakePage() {
  // The gallery reuses the original theme's jQuery stack (isotope masonry,
  // Magnific Popup) for a 1:1 behavioral match. Loaded sequentially after
  // hydration so React never fights their DOM mutations.
  useEffect(() => {
    let cancelled = false
    const cleanup: HTMLScriptElement[] = []
    async function loadSequentially() {
      for (const src of LEGACY_SCRIPTS) {
        if (cancelled) return
        await new Promise<void>((resolve, reject) => {
          const existing = document.querySelector(`script[src="${src}"]`)
          if (existing) return resolve()
          const s = document.createElement('script')
          s.src = src
          s.onload = () => resolve()
          s.onerror = () => reject(new Error(`failed to load ${src}`))
          document.body.appendChild(s)
          cleanup.push(s)
        })
      }
    }
    loadSequentially().catch(console.error)
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <>
      <div className="farewell-banner">
        <p>
          Cảm ơn bạn đã cùng đồng hành với ngan.vn trong suốt những năm vừa
          qua. Hẹn gặp lại các bạn ở một diện mạo mới trong hành trình mới nhé{' '}
          <span className="farewell-heart">❤</span>
        </p>
      </div>

      <div className="main-wrapper">
        <div className="container">
          {/* Header */}
          <div className="header">
            {/* Header Row 2 */}
            <div className="header-row-2">
              <div className="logo">
                <a href="/" className="custom-logo-link" rel="home">
                  <img
                    width={500}
                    height={234}
                    src="/wp-content/uploads/2019/09/logo-small.png"
                    className="custom-logo"
                    alt="Ngan.vn"
                    fetchPriority="high"
                    srcSet="/wp-content/uploads/2019/09/logo-small.png 500w, /wp-content/uploads/2019/09/logo-small-300x140.png 300w"
                    sizes="(max-width: 500px) 100vw, 500px"
                  />
                </a>
              </div>
            </div>
            {/* /Header Row 2 */}

            {/* Header Row 3 */}
            <div className="header-row-3">
              <nav className="navbar navbar-default">
                <div className="navbar-header">
                  <button
                    type="button"
                    className="navbar-toggle collapsed"
                    data-toggle="collapse"
                    data-target=".header-row-3 .navbar-collapse"
                    aria-expanded="false"
                  >
                    <span className="sr-only">Toggle Navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                </div>
                <div className="navbar-collapse collapse">
                  <ul id="menu-home-menu" className="nav navbar-nav">
                    <li className="menu-item menu-item-home current-menu-item current_page_item menu-item-has-children dropdown active">
                      <a href="/cake" data-toggle="dropdown" className="dropdown-toggle" aria-haspopup="true">
                        Gallery <span className="caret"></span>
                      </a>
                      <ul role="menu" className="dropdown-menu">
                        {NAV_CATEGORIES.map((c) => (
                          <li key={c.slug} className="menu-item">
                            <a href={`/cake?filter=${c.slug}`} data-filter={`.category-${c.slug}`}>
                              {c.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                    <li className="menu-item">
                      <a href="/">Blog</a>
                    </li>
                    <li className="menu-item social-menu-item">
                      <a href="http://facebook.com/me.ngan.vn">
                        <img src="/theme/assets/icon/facebook.svg" alt="Facebook" />
                      </a>
                    </li>
                    <li className="menu-item social-menu-item">
                      <a href="http://instagram.com/nganluu.nn">
                        <img src="/theme/assets/icon/instagram.svg" alt="Instagram" />
                      </a>
                    </li>
                    <li className="search">
                      <a href="#main-search" id="toggle-main_search" data-toggle="dropdown">
                        <i className="fa fa-search"></i>
                      </a>
                      <div className="dropdown-menu main_search">
                        <form name="main_search" method="get" action="/cake">
                          <input type="text" name="s" className="form-control" placeholder="Type here" />
                        </form>
                      </div>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
            {/* /Header Row 3 */}
          </div>
          {/* /Header */}

          <div className="blog-feed">
            <div className="row">
              <div className="wpb_wrapper">
                <div className="zk-heading vc_custom_1506740627653 layout1 text-center">
                  <h2 className="heading vc_custom_1506740627633" style={{ fontSize: 40 }}>
                    <span className="style1">Cakes &amp; Sweets</span>
                  </h2>
                  <div
                    className="sub-heading vc_custom_1506740627645"
                    style={{
                      fontSize: 11,
                      color: '#aaaaaa',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Cảm ơn bạn đã đến với ngan.vn - nơi chứa đựng những điều dễ
                    thương và ngọt ngào ❤️
                  </div>
                </div>
              </div>

              <div className="main-column col-md-12">
                {/* Blog Feed */}
                <div className="blog-feed">
                  <div className="portfolio-content">
                    <div className="portfolio-filter-wrap text-center">
                      <ul className="portfolio-filter hover-style-one">
                        {FILTERS.map((f, i) => (
                          <li key={f.filter} className={i === 0 ? 'active' : undefined}>
                            <a href="#" data-filter={f.filter}>
                              {f.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="portfolio portfolio-gutter portfolio-style-4 portfolio-container portfolio-masonry portfolio-column-count-3">
                      {cakes.map((item) => (
                        <div
                          key={item.id}
                          id={`post-${item.id}`}
                          className={`entry portfolio-item  post-${item.id} post type-post status-publish format-standard has-post-thumbnail hentry ${item.categories
                            .map((c) => `category-${c}`)
                            .join(' ')}`}
                        >
                          <div className="portfolio-item-content">
                            <div className="item-thumbnail">
                              <a href={rel(item.link ?? '#')}>
                                <img
                                  width={item.width}
                                  height={item.height}
                                  src={rel(item.src)}
                                  className="img-responsive wp-post-image"
                                  alt={item.alt}
                                  decoding="async"
                                  srcSet={relSrcset(item.srcset)}
                                  sizes={`(max-width: ${item.width}px) 100vw, ${item.width}px`}
                                />
                              </a>
                            </div>

                            <div className="portfolio-description">
                              <div className="action-btns text-center">
                                <a
                                  title={item.title}
                                  href={rel(item.zoom ?? item.src)}
                                  className="portfolio-gallery-set"
                                >
                                  <img src="/theme/assets/icon/zoom-in.svg" className="zoom_icon" alt="" />
                                </a>
                              </div>

                              <h4>
                                <a href={rel(item.link ?? '#')}>{item.title}</a>
                              </h4>
                              <ul className="portfolio-cat">
                                {item.catLabels.map(([url, label]) => (
                                  <li key={url}>
                                    <a href={rel(url)}>{label}</a>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                {/* /Blog Feed */}
              </div>
            </div>
            <hr />
          </div>
        </div>
        {/* /Container */}
      </div>
      {/* /Main Wrapper */}

      {/* Footer */}
      <div className="footer">
        <div className="footer-copyright">
          <ul className="credit">
            <li>
              <a
                href="//www.dmca.com/Protection/Status.aspx?id=f3eceade-9da2-461b-96d9-8715e5f8a24c"
                title="DMCA.com Protection Status"
                className="dmca-badge"
              >
                <img
                  src="//images.dmca.com/Badges/dmca-badge-w150-5x1-01.png?ID=f3eceade-9da2-461b-96d9-8715e5f8a24c"
                  alt="DMCA.com Protection Status"
                />
              </a>{' '}
              <a href="/">
                (c) ngan.vn with <span style={{ color: '#ff9112' }}>❤</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* /Footer */}

      {/* Floating Messenger button (original: floaty.js) */}
      <a id="floaty_link" href="https://www.facebook.com/me.ngan.vn" target="_blank" rel="noreferrer">
        <div className="floaty">
          <img src="/wp-content/uploads/img/fb-messenger.png" alt="Messenger" />
        </div>
      </a>
    </>
  )
}
