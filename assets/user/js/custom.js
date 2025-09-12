(function () {
  "use strict";

  var tinyslider = function () {
    var el = document.querySelectorAll(".testimonial-slider");

    if (el.length > 0) {
      var slider = tns({
        container: ".testimonial-slider",
        items: 1,
        axis: "horizontal",
        controlsContainer: "#testimonial-nav",
        swipeAngle: false,
        speed: 700,
        nav: true,
        controls: true,
        autoplay: true,
        autoplayHoverPause: true,
        autoplayTimeout: 3500,
        autoplayButtonOutput: false,
      });
    }
  };
  tinyslider();
});

document.addEventListener("DOMContentLoaded", function () {
  let loadMoreBtn = document.getElementById("loadMore");
  let loader = document.getElementById("loader");
  let products = document.querySelectorAll(".product-item-wrapper");
  let visibleCount = 8;
  let increment = 4;

  if (loadMoreBtn && loader && products.length > 0) {
    loadMoreBtn.addEventListener("click", function () {
      loader.style.display = "inline-block";

      setTimeout(() => {
        let hiddenProducts = Array.from(products).slice(
          visibleCount,
          visibleCount + increment
        );

        hiddenProducts.forEach((product) => {
          product.style.display = "block";
        });

        visibleCount += increment;
        loader.style.display = "none";

        if (visibleCount >= products.length) {
          loadMoreBtn.style.display = "none";
        }
      }, 800);
    });

    if (products.length <= visibleCount) {
      loadMoreBtn.style.display = "none";
    }
  }
});
