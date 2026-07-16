/* Gallery behavior for /cake — adapted from the original theme's kale.js.
   Requires: jquery, imagesloaded, isotope, magnific-popup (loaded before this). */
(function ($) {
  'use strict'

  var $grid = $('.portfolio-masonry')

  // Magnific Popup — identical options to the original site
  $('.portfolio-gallery-set').magnificPopup({
    type: 'image',
    removalDelay: 300,
    mainClass: 'mfp-fade mfp-with-zoom',
    gallery: { enabled: true },
    image: {
      // Title + note under the zoomed image
      titleSrc: function (item) {
        return item.el.attr('title') || ''
      },
    },
    zoom: {
      enabled: true,
      duration: 300,
      easing: 'ease-in-out',
      opener: function (openerElement) {
        // Zoom from the grid thumbnail, not the hidden icon
        var $thumb = openerElement
          .closest('.portfolio-item-content')
          .find('.item-thumbnail img')
        return $thumb.length ? $thumb : openerElement
      },
    },
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

  // Nav dropdown categories filter in place when already on /cake
  $('.navbar-nav .dropdown-menu').on('click', 'a[data-filter]', function (event) {
    event.preventDefault()
    applyFilter($(this).attr('data-filter'))
    history.replaceState(null, '', $(this).attr('href'))
    $(this).closest('.dropdown').removeClass('open')
  })

  // Search icon toggle (original: bootstrap dropdown + focus timeout)
  $('#toggle-main_search').on('click', function (event) {
    event.preventDefault()
    $(this).parent().toggleClass('open')
    setTimeout(function () {
      $('.main_search .form-control').focus()
    }, 200)
  })

  // Live search: filter grid items by title (replaces WP server-side search)
  $('.main_search form').on('submit', function (event) {
    event.preventDefault()
  })
  $('.main_search .form-control').on('input', function () {
    var q = $(this).val().toLowerCase().trim()
    if (!q) {
      applyFilter('*')
      return
    }
    $grid.isotope({
      filter: function () {
        return (
          $(this).find('h4 a').text().toLowerCase().indexOf(q) !== -1
        )
      },
    })
  })

  // Mobile navbar collapse (original: bootstrap.js)
  $('.navbar-toggle').on('click', function () {
    $('.header-row-3 .navbar-collapse').toggleClass('in')
  })

  // Mobile dropdown toggle
  $('.navbar-nav > li.dropdown > a').on('click', function (event) {
    if (window.matchMedia('(max-width: 767px)').matches) {
      event.preventDefault()
      $(this).parent().toggleClass('open')
    } else {
      // Desktop: first click keeps you on /cake showing everything
      event.preventDefault()
      applyFilter('*')
      history.replaceState(null, '', '/cake')
    }
  })

  $('body').addClass('js')
})(jQuery)
