/* Gallery behavior for /cake — adapted from the original theme's kale.js.
   Requires: jquery, imagesloaded, isotope, magnific-popup (loaded before this). */
(function ($) {
  'use strict'

  var $grid = $('.portfolio-masonry')

  // Magnific Popup — same options as the original site, but each item opens
  // its own gallery: the grid image plus the extra photos the old WP detail
  // page had (data-variants, extracted from the backup).
  $('.portfolio-content').on('click', '.portfolio-gallery-set', function (event) {
    event.preventDefault()
    var $link = $(this)
    var $thumb = $link.closest('.portfolio-item-content').find('.item-thumbnail img')
    var title = $link.attr('title') || ''
    var variants = $link.data('variants')
    if (!variants || !variants.length) {
      variants = [{ src: $link.attr('href'), thumb: $link.attr('href') }]
    }

    function markActive(mfp) {
      mfp.container
        .find('.mfp-thumb')
        .removeClass('active')
        .eq(mfp.index)
        .addClass('active')
    }

    $.magnificPopup.open({
      items: variants.map(function (v) {
        return { src: v.src }
      }),
      type: 'image',
      removalDelay: 300,
      mainClass: 'mfp-fade mfp-with-zoom',
      gallery: { enabled: true },
      image: {
        // Title + note under the zoomed image
        titleSrc: function () {
          return title
        },
      },
      zoom: {
        enabled: true,
        duration: 300,
        easing: 'ease-in-out',
        opener: function () {
          // Zoom from the grid thumbnail, not the hidden icon
          return $thumb.length ? $thumb : $link
        },
      },
      callbacks: {
        // Mini-thumbnail strip for jumping between variants
        open: function () {
          if (variants.length < 2) return
          var mfp = this
          var $strip = $('<div class="mfp-thumb-strip"></div>')
          $strip.on('click', function (e) {
            e.stopPropagation() // don't let the overlay close the popup
          })
          variants.forEach(function (v, i) {
            $('<img class="mfp-thumb" alt="" />')
              .attr('src', v.thumb)
              .on('click', function () {
                mfp.goTo(i)
              })
              .appendTo($strip)
          })
          mfp.container.append($strip)
          markActive(mfp)
        },
        change: function () {
          markActive(this)
        },
      },
    })
  })

  // Isotope masonry — identical options to the original site
  imagesLoaded($grid[0], function () {
    setTimeout(function () {
      $grid.isotope({
        itemSelector: '.portfolio-item',
        resizesContainer: false,
        layoutMode: 'masonry',
        filter: '*',
      })
      applyFilterFromUrl()
    }, 5)
  })

  function applyFilter(filterValue) {
    $grid.isotope({ filter: filterValue })
    var $tabs = $('.portfolio-filter li')
    $tabs.removeClass('active')
    $tabs
      .has('a[data-filter="' + filterValue + '"]')
      .addClass('active')
  }

  function applyFilterFromUrl() {
    var slug = new URLSearchParams(window.location.search).get('filter')
    if (slug) applyFilter('.category-' + slug)
  }

  // Filter tabs
  $('.portfolio-filter').on('click', 'a', function (event) {
    event.preventDefault()
    applyFilter($(this).attr('data-filter'))
  })

  // Old detail-page links (thumbnail + title) now open the lightbox
  $grid.on('click', '.item-thumbnail a, .portfolio-description h4 a', function (event) {
    event.preventDefault()
    $(this)
      .closest('.portfolio-item-content')
      .find('.portfolio-gallery-set')
      .trigger('click')
  })

  // Old category-page links now apply the matching filter
  $grid.on('click', '.portfolio-cat a', function (event) {
    var m = $(this).attr('href').match(/\/banh-kem\/([\w-]+)\/?$/)
    if (m) {
      event.preventDefault()
      applyFilter('.category-' + m[1])
      history.replaceState(null, '', '/cake?filter=' + m[1])
    }
  })

  $('body').addClass('js')
})(jQuery)
