import Zooming from 'zooming';
import Glide from '@glidejs/glide';

const menuTrigger = document.querySelector('.menu-trigger');
const pager = document.querySelector('.pager');
const accordions = document.querySelector('.accordion');

if ( menuTrigger ) {
  menuTrigger.addEventListener('click', (e) => {
    e.preventDefault();
    if ( document.body.dataset.menuOpen === "false" ) {
      document.body.dataset.menuOpen = "true"
    } else {
      document.body.dataset.menuOpen = "false"
    }
  })
}

// image lightbox zooming
document.addEventListener('DOMContentLoaded', function () {
  const zooming = new Zooming({
    bgColor: 'rgb(0,0,0)',
    bgOpacity: 0.95
  })

  zooming.listen('.img-zoomable')
})

if ( accordions ) {
  accordions.addEventListener('click', (e) => {
    const isButton = e.target.nodeName === 'BUTTON';
    if ( !isButton ) {
      return
    }
    let exp = accordions.querySelector(`#${e.target.dataset.expandable}`);
    if ( e.target.getAttribute('aria-expanded') === "false") {
      e.target.setAttribute('aria-expanded', 'true');
      exp.setAttribute('aria-hidden', "false")
    } else {
      e.target.setAttribute('aria-expanded', 'false');
      exp.setAttribute('aria-hidden', "true")
    }

  })
}

// Slider
const CustomLength = function(Glide, Components, Events) {
  return {
    mount () {
      Events.emit('slider.length', Components.Sizes.length)
    }
  }
}
const slider = new Glide('.glide', {
  gap: 0,
  type: 'carousel',
  perView: 1,
  autoplay: 6000
})

let totalSlides;
slider.on(['slider.length'], (length) => {
  totalSlides = length
})

slider.on(['mount.after', 'run'], () => {
    const page = parseInt(slider.index, 10) + 1;
    pager.innerText = page + ' of ' + totalSlides;
})
slider.mount({
  CustomLength
})