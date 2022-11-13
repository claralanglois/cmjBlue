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


// function splitAnimatedText() {
//     let textEl = $(".shuffle");
//     let text = textEl.text();
//     let characters = text.split("");
//     textEl.text('')
//     $.each(characters, function (i, singleChar) {
//         textEl.append(`<span class='char' style='--char-index:${i}'>` + singleChar + `</span`);
//         console.log(singleChar)
//     });
// }

// splitAnimatedText()
// function shuffle() {
//     const a = $(".masonry > div").remove().toArray();
//     for (let i = a.length - 1; i >= 1; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         const bi = a[i];
//         a[i] = a[j];
//         a[j] = bi;
//     }
//     $(".masonry").append(a);
// }

function setPage(newTag) {
    sessionStorage.setItem("page", newTag);
}

