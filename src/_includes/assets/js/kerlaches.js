import Zooming from 'zooming';
// image lightbox zooming
document.addEventListener('DOMContentLoaded', function () {
  const zooming = new Zooming({
    bgColor: 'rgb(0,0,0)',
    bgOpacity: 0.95
  })

  zooming.listen('.img-zoomable')
})