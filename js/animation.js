import {DrawSVGPlugin} from "../node_modules/gsap/DrawSVGPlugin.js"
import {ScrollTrigger} from "../node_modules/gsap/ScrollTrigger.js"
import {Flip} from "../node_modules/gsap/Flip.js"

gsap.registerPlugin(DrawSVGPlugin);
gsap.registerPlugin(ScrollTrigger)
gsap.registerPlugin(Flip);

// gsap.to(".svg1", {duration: 1, morphSVG:".svg2"});


// let test = new gsap.timeline();
// test.fromTo('.femme',
//     {
//
//         drawSVG: '0%',
//     },
//     {
//
//         duration: 10,
//         drawSVG: '100%',
//     });
// test.fromTo('.femme2',
//     {
//
//         drawSVG: '0%',
//     },
//     {
//
//         duration: 10,
//         drawSVG: '100%',
//     });

// animatePath()

// ScrollTrigger.create({
//     animation: test,
//     trigger: '.trigger',
//     markers: true,
//     start: "top 10%",
//     end: "+=300",
//     toggleActions: "restart pause reverse pause"
// })



document.querySelector(".shuffle").addEventListener("click", () => {
    flipState()
});

function switchItUp() {
    let images = gsap.utils.toArray(".img")
    const imageContainer = gsap.utils.toArray(".mItem");

    gsap.utils.shuffle(images);
    images.forEach((img, i) => imageContainer[i].append(img));
}

function flipState() {
    let state = Flip.getState(".img");
    let state2 = Flip.getState(".mItem");

    Flip.from(state2, {
        absolute: true,
    })

    switchItUp();

    Flip.from(state, {
        targets: ".img",
        ease: "sine.inOut",
        absolute: true,
        onEnter: (elements) => {
            return gsap.from(elements, {
                yPercent: 100,
                opacity: 0,
                ease: "sine.out"
            });
        },
        onLeave: (elements) => {
            return gsap.to(elements, {
                scale: 0.3,
                rotation: 360,
                opacity: 0,
                ease: "sine.out"
            });
        }
    });
}
