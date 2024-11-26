/**
 * @typedef {import("jquery")} $
 * @typedef {import("gsap")} gsap
 * @typedef {import("gsap/Draggable")} Draggable
 */

gsap.registerPlugin(Draggable);

const body = document.body;
const select = (e) => document.querySelector(e);
const selectAll = (e) => document.querySelectorAll(e);

initScripts();

/**
 * Fire all scripts
 */
function initScripts() {
  getImages();
  initPlayButton();
}

async function getImages() {
  let res = await fetch("/get-images", { method: "POST" });
  const imagesUrl = await res.json();

  const images = imagesUrl.map((url) => {
    const image = new Image();
    image.src = url;
    image.classList.add("image");
    return image;
  });

  const promises = images.map(function (image) {
    return new Promise(function (res) {
      image.onload = res;
    });
  });

  const loadedImages = await Promise.all(promises);
  $(".image-container").empty();
  loadedImages.forEach(function ({ target }) {
    $(target).appendTo(".image-container");
    $(target).on("click", imageClick);
  });
}
function imageClick() {
  $(this).siblings().removeClass("active");
  $(this).addClass("active");
}

function initPlayButton() {
  $(function () {
    $("#play").on("click", function () {
      if (!$(".image.active").length) return;
      document.location.href =
        "/play?image-url=" + encodeURIComponent($(".image.active").attr("src"));
    });
  });
}
