const spaceId = "0mhqf7pgbfso"
const environmentId = "master"
const accessToken = "w77z_ekcGz3LhjplKHNEz2qxTuRGXjtNzTo8MPlWEmU"

var client = contentful.createClient({
    space: `${spaceId}`,
    accessToken: `${accessToken}`,
});


const page = sessionStorage.getItem('page');

let tags = [page]
console.log(tags)

showLink(page)


function showLink(selectedPage) {
    let pages = ['textile', 'decoration', 'illustration']
    let selectItem = document.querySelector("#" + selectedPage)
    let index = pages.indexOf(selectedPage);
    if (index !== -1) {
        pages.splice(index, 1);
    }
    selectItem.classList.add("show")

    pages.forEach(link => {
        document.querySelector("#" + link).classList.remove("show")
    });
    const sectionSelected = document.querySelector('.selected');
    sectionSelected.style.display = "none";
}

function changeTag(newTag) {
    tags = [newTag]
    DisplaySelectedItem()
    showLink(newTag)
}


let tagList = []

const toTitleCase = (phrase) => {
    return phrase
        .toLowerCase()
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
};


function selectTag(tagToAdd) {
    let button = document.getElementById(`${tagToAdd}`)
    let formatedId = toTitleCase(tagToAdd)
    //if the tag already in array delete it
    if (tags.includes(formatedId)) {
        for (var i = 0; i < tags.length; i++) {
            if (tags[i] === formatedId) {
                tags.splice(i, 1);
            }
            button.classList.remove("active")
        }
    } else {
        tags.push(formatedId);
        button.classList.add("active")
    }
    console.log(tags)
    DisplaySelectedItem()
}

const sectionGrid = document.querySelector(".masonry")
const shuffleBtn = document.querySelector(".shuffle")
const sectionNav = document.querySelector(".tags")
//tag menu

client.getEntries({order: 'sys.createdAt'})
    .then(function (entries) {
        entries.items.forEach(function (entry) {
            var menu = entry.fields.tagTitle;

            if (menu) {
                tagList.push(menu)
                sectionNav.innerHTML = sectionNav.innerHTML + `<a id="${menu}" class="poop" onclick="selectTag('${menu}')">${menu}</a>`
            }

        })
    });

function DisplaySelectedItem() {
    sectionGrid.style.display = "flex";
    sectionNav.style.display = "flex";
    sectionGrid.innerHTML = "";
    shuffleBtn.style.display = "flex";


    client.getEntries(
        {
            order: 'sys.createdAt',
            'metadata.tags.sys.id[all]': tags.join()
        }
    )
        .then(function (entries) {
            entries.items.map(function (entry) {

                const sectionGrid = document.querySelector(".masonry")

                //load the images with the necessary informations to load the associated details in product page(id, url main image, url mockup)
                var imageURL = 'https:' + entry.fields.mainImage.fields.file.url;
                var entryId = entry.sys.id
                sectionGrid.innerHTML = sectionGrid.innerHTML + `
               <div class="mItem"><img class="img" onclick="itemClicked('${entryId}')" src="${imageURL}"></div>`
            });
        })
}

DisplaySelectedItem()


function itemClicked(id) {
    sectionGrid.style.display = "none";
    shuffleBtn.style.display = "none";
    sectionNav.style.display = "none";
    const sectionMock = document.querySelector(".mock")
    const sectionMain = document.querySelector(".main")
    const sectionDetails = document.querySelector(".details")
    const sectionSelected = document.querySelector(".selected")
    sectionSelected.style.display = "flex";

    sectionMock.innerHTML = '    <a class="prev" onclick="plusSlides(-1)">&#10094;</a>\n' +
        '            <a class="next" onclick="plusSlides(1)">&#10095;</a>';
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
                        sectionMock.innerHTML = sectionMock.innerHTML + ` <img class="mockup" src="${mockupURL}">
                `
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
                        let button = '<a href="' + link + '" target="_blank">shop!</a>'
                        console.log(button)
                        $(".shop-btn").html(button)
                    }
                }
            }
        });
    });

}

//
// todo create an entry "selected item" with main img /  mockup imgs / etsy ID / description / name
