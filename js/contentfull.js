// import {DrawSVGPlugin} from "../node_modules/gsap/DrawSVGPlugin.js"
// import {ScrollTrigger} from "../node_modules/gsap/ScrollTrigger.js"
//
// gsap.registerPlugin(DrawSVGPlugin);
// gsap.registerPlugin(ScrollTrigger)
//

const sid = "0mhqf7pgbfso"
const environmentId = "master"
const at = "w77z_ekcGz3LhjplKHNEz2qxTuRGXjtNzTo8MPlWEmU"

var client = contentful.createClient({
    space: `${sid}`,
    accessToken: `${at}`,
});

//get tag from menu title (illu,textile,deco)
const page = sessionStorage.getItem('page');
let tags = [page]


//add class to menu to show the selected 'page'
function goToPage(selectedPage) {
    let pages = ['textile', 'decoration', 'illustration']
    console.log(selectedPage)
    let pageButton = document.querySelector("#" + selectedPage)

    let index = pages.indexOf(selectedPage);
    if (index !== -1) {
        pages.splice(index, 1);
    }

    pageButton.classList.add("show")
    pages.forEach(link => {
        document.querySelector("#" + link).classList.remove("show")
    });
    const sectionSelected = document.querySelector('.selected');
    sectionSelected.style.display = "none";
}

function changePage(newTag) {
    tags = [newTag]
    goToPage(newTag)
    updateArt()
}


const toTitleCase = (phrase) => {
    const words = phrase.split(" ");
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
};
const toFormatString = (phrase) => {
    return phrase.split(/(?=[A-Z])/).join(' ').toLowerCase()
}

const sectionGrid = document.querySelector(".masonry")
const shuffleBtn = document.querySelector(".shuffle")
const sectionNav = document.querySelector(".tags")


let allArt = []

function fetchArt() {
    client.getEntries({order: 'sys.createdAt'})
        .then((entries) => {
            allArt = entries.items
                .filter(entry => entry.fields.mainImage)
                .map(function (entry) {
                    let tagsArr = entry.metadata.tags
                    let tags = []
                    tagsArr.forEach((tag) => {
                        tags.push(tag.sys.id)
                    })
                    return {
                        imageURL: entry.fields.mainImage.fields.file.url,
                        entryId: entry.sys.id,
                        tags: tags
                    }
                })
        }).then(() => filterArt())
        .then(() => displayArt())
        .then(() => animateGrid())
        .then(() => displayTags())
}

let selectedArt = []

function filterArt() {
    allArt.forEach((entry) => {
        for (let i = 0; i < tags.length; i++) {
            if (entry.tags.includes(tags[i])) {
                if (selectedArt.indexOf(entry) === -1) {
                    selectedArt.push(entry)
                }
            }
        }
    })
}

let allTags = []

function selectTag(tagToAdd) {
    let button = document.getElementById(`${tagToAdd}`)
    let formatedId = toTitleCase(tagToAdd)
    //if the tag already in array delete it
    if (tags.includes(formatedId)) {
        for (var i = 0; i < tags.length; i++) {
            if (tags[i] === formatedId) {
                tags.splice(i, 1);
            }
        }
        button.classList.remove("active")
    } else {
        tags.push(formatedId);
    }
    updateArt()
}

let pagesTitle = ['textile', 'decoration', 'illustration']

function displayTags() {
    selectedArt.forEach((entry) => {
        entry.tags.forEach((tag) => {
            if (allTags.indexOf(tag) === -1 && pagesTitle.indexOf(tag) === -1) {
                allTags.push(tag)
                let tagTitle = toFormatString(tag)
                sectionNav.innerHTML = sectionNav.innerHTML + `<a id="${tag}" onclick="selectTag('${tag}')">${tagTitle}</a>`
            }
        })
    })
}


function updateTags() {
    allTags = []
    console.log(tags)
    sectionNav.innerHTML = '';
    selectedArt.forEach((entry, index) => {
        entry.tags.forEach((tag) => {
            if (allTags.indexOf(tag) === -1 && pagesTitle.indexOf(tag) === -1) {
                allTags.push(tag)
                let tagTitle = toFormatString(tag)
                sectionNav.innerHTML = sectionNav.innerHTML + `<a id="${tag}" onclick="selectTag('${tag}')">${tagTitle}</a>`
            }
            if (tags.includes(tag) && pagesTitle.indexOf(tag) === -1) {
                let button = document.getElementById(`${tag}`)
                button.classList.add("active")
            }

        })
    })
}

function displayArt() {
    sectionGrid.style.display = "flex";
    sectionNav.style.display = "flex";
    sectionGrid.innerHTML = "";
    shuffleBtn.style.display = "flex";
    selectedArt.forEach((entry) => {
        const sectionGrid = document.querySelector(".masonry")
        sectionGrid.innerHTML = sectionGrid.innerHTML + `
        <div class="mItem"><img class="img" onclick="itemClicked('${entry.entryId}')" src="${entry.imageURL}"></div>`
    })

}

function updateArt() {
    filterArt()
    selectedArt.forEach((entry, index) => {
        for (let i = 0; i < tags.length; i++) {
            if (entry.tags.indexOf(tags[i]) === -1) {
                delete selectedArt[index]
            }
        }
    })
    displayArt()
    animateGrid()
    updateTags()
}


//illustration clicked, get illu info display mockup
function itemClicked(id) {
    sectionGrid.style.display = "none";
    shuffleBtn.style.display = "none";
    sectionNav.style.display = "none";
    const sectionMock = document.querySelector(".mock")
    const sectionMain = document.querySelector(".main")
    const sectionDetails = document.querySelector(".details")
    const sectionSelected = document.querySelector(".selected")
    sectionSelected.style.display = "flex";

    sectionMock.innerHTML = '<a class="prev" onclick="plusSlides(-1)">&#10094;</a>\n' +
        '<a class="next" onclick="plusSlides(1)">&#10095;</a>';
    sectionMain.innerHTML = '';
    sectionDetails.innerHTML = '';


    client.getEntry(`${id}`)
        .then(function (entry) {

            //mockup images
            //make an array of all the mockup images ids
            let mockupsIds = []
            entry.fields.mockup.forEach(function (image) {
                let mockupId = image.sys.id
                mockupsIds.push(mockupId)
            })
            let i = 0;
            mockupsIds.forEach((imageId) => client.getAsset(`${imageId}`)
                .then(function (asset) {
                        i += 1;
                        let mockupURL = 'https:' + asset.fields.file.url
                        sectionMock.innerHTML = sectionMock.innerHTML + ` <img class="mockup" src="${mockupURL}">`
                    }
                ))

            //main image
            let mainImageId = entry.fields.mainImage.sys.id
            client.getAsset(`${mainImageId}`)
                .then(function (asset) {
                    let mainImageURL = 'https:' + asset.fields.file.url;
                    sectionMain.innerHTML = sectionMain.innerHTML + `<img class="mainImg" src="${mainImageURL}">`
                })

            let listingId = entry.fields.listingId;

            checkListingsState(listingId);

            let title = entry.fields.titleIllu;
            let description = entry.fields.subtitle;
            sectionDetails.innerHTML = ` <h1>${title}</h1><p>${description}</p>`
        })
}

// retrieve listing link from its id, append button redirecting to the etsy page listing if the id match active listing
function checkListingsState(id) {
    $(document).ready(function () {
        let apiKey = "cmthbaozju83tamoex32ig5e";
        let listingId = parseInt(id);
        let etsyURL = "https://openapi.etsy.com/v2/listings/" + listingId + ".js?&api_key=" + apiKey + "&fields=url,state";

        $.ajax({
            url: etsyURL,
            dataType: 'jsonp',
            success: function (data) {
                if (data.ok) {

                    if (data.results[0].state === "active") {
                        let link = data.results[0].url;
                        let button = '<div class="shop-btn"><a href="' + link + '" target="_blank">Order on etsy</a></div>'
                        $(".btn-container").html(button)
                    }
                }
            }
        });
    });

}


function animateGrid() {
    gsap.defaults({ease: "power4"});
    gsap.set(".mItem", {y: 50, x: 50, opacity: 1});

    ScrollTrigger.batch(".mItem", {
        interval: 0.1,
        batchMax: 3,
        onEnter: batch => gsap.to(batch, {
            opacity: 1,
            x: 0,
            y: 0,
            stagger: {each: 0.05, grid: [1, 3]},
            overwrite: true
        }),
        onLeave: batch => gsap.set(batch, {opacity: 0, x: -100, y: -50, overwrite: true}),
        onEnterBack: batch => gsap.to(batch, {opacity: 1, x: 0, y: 0, stagger: 0.10, overwrite: true}),
        onLeaveBack: batch => gsap.set(batch, {opacity: 0, x: 50, y: 50, overwrite: true})
    });

}

ScrollTrigger.addEventListener("refreshInit", () => {
        gsap.set(".mItem", {y: -50, x: -50, opacity: 0})
    }
);

function main() {
    fetchArt()
   changePage(page)
}

main()
