import Zooming from 'zooming'
import Glide from '@glidejs/glide'

// image lightbox zooming
document.addEventListener('DOMContentLoaded', function () {
  const zooming = new Zooming({
    bgColor: 'rgb(0,0,0)',
    bgOpacity: 0.95
  })

  zooming.listen('.img-zoomable')
})

// Slider
const CustomLength = function(Glide, Components, Events) {
  return {
    mount () {
      Events.emit('slider.length', Components.Sizes.length)
    }
  }
}
const slider = new Glide('.glide', { gap: 0 })
const pager = document.querySelector('.pager');
let totalSlides;
slider.on(['slider.length'], (length) => {
  totalSlides = length
})

slider.on(['mount.after', 'run'], () => {
    pager.innerText = slider.index + ' of ' + totalSlides;
})
slider.mount({
  CustomLength
})