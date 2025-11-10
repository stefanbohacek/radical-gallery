import ready from "/scripts/modules/ready.js";
import PhotoSwipeLightbox from "./../libs/photoswipe/5.4.4/photoswipe-lightbox.esm.js";
import PhotoSwipe from "./../libs/photoswipe/5.4.4/photoswipe.esm.js";
import PhotoSwipeDynamicCaption from "./../libs/photoswipe-dynamic-caption/1.2.7/photoswipe-dynamic-caption-plugin.esm.js";

ready(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: "#gallery",
    children: "a",
    pswpModule: PhotoSwipe,
  });

  const captionPlugin = new PhotoSwipeDynamicCaption(lightbox, {
    type: "auto",
    captionContent: ".pswp-caption-content",
  });
  lightbox.init();
});
