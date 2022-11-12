// import Splitting from "splitting";
// ~~~~~~~~~~~~~ top arrow doesnt exist ~~~~~~~~~~~~~
// toTopArrow = document.querySelector('.arrow')

// if (toTopArrow.style)
// window.onscroll = function () {
//     scrollFunction()
// };

// function scrollFunction() {
//     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//         toTopArrow.style.display = "block";
//     } else {
//         toTopArrow.style.display = "none";
//     }
// }

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

// function resize() {
// if ($(window).width() < 600) {
//     $('.grid').removeClass('desktop').addClass('mobile');

// }
// else {
//     $('.grid').removeClass('mobile').addClass('desktop');

// }


// }

// $(window).on('resize', function() {
// resize()
// });


let offset = 260
let addOffset = 90

function calcOffset() {
    if ($(window).width() < 600) {
        offset = 240

    } else if ($(window).width() < 900) {
        offset = 280
    } else {
        offset = 240
        addOffset = 0
    }
}

$(window).on('resize', function () {
    calcOffset()
});
$(window).on('load', function () {
    calcOffset()
});


// populate page with palettes
let paletteContainer = document.querySelectorAll('.container-palette');
let r = document.querySelector(':root')

for (let i = 0; i < 8; i++) {
    paletteContainer.forEach(cont => {
        let p = document.createElement("div");
        p.className = 'palette'
        p.id = `p${i + 1}`;
        cont.append(p);
        //get value of css variable define in roots
        p.style.backgroundColor = window.getComputedStyle(r).getPropertyValue(`--pal-${i}`);
    })

}

let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mockup");
    if (n > slides.length) {
        slideIndex = 1
    }
    if (n < 1) {
        slideIndex = slides.length
    }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    if (slides[slideIndex - 1]) {
        slides[slideIndex - 1].style.display = "block";
    }
}

function shuffle() {
    const a = $(".masonry > div").remove().toArray();
    for (let i = a.length - 1; i >= 1; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const bi = a[i];
        a[i] = a[j];
        a[j] = bi;
    }
    $(".masonry").append(a);
}

function splitAnimatedText() {
    let textEl = $(".shuffle");
    let text = textEl.text();
    let characters = text.split("");
    textEl.text('')
    $.each(characters, function (i, singleChar) {
        textEl.append(`<span class='char' style='--char-index:${i}'>` + singleChar + `</span`);
        console.log(singleChar)
    });
}

// splitAnimatedText()


function setPage(newTag) {
    sessionStorage.setItem("page", newTag);
}

