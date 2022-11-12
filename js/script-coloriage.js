
// coloriage
(function( $ ) {
  let mainHolder, colorHolder;
  let svgObject, svgOutline, svgColor;
  const fillSpeed = 0.3;
  let chosenColor = '#4B6EEB'

  $('.palette').each(function(){
    $(this).on("click", function(){
     chosenColor = $(this).css('background-color');
      let indexSVG = $(this).attr('id')
     $('.nuageColor').each(function(){
      $(this).attr("src", '../assets/images/icon/' + indexSVG +'.svg')
    })
  });
  })

  function colorMe() {
    TweenMax.to(this, fillSpeed, { fill: chosenColor });
  }

  $.fn.makeSVGcolor = function(svgURL) {
    mainHolder = this
    $( this ).load(svgURL, function() {
      svgObject  = $('svg', this)
      svgColor   = $('g#Color', svgObject).children()
      svgColor.css("cursor", "crosshair")
      svgOutline = $('g:nth-child(1)', svgObject).children()
      svgOutline.css("cursor", "crosshair")
      $(svgColor).on('click', colorMe)

    });
  }
}( jQuery ));

//populate page with illustrations
let coloriageNb = 10;
let coloriages = [];

for (let i = 1; i <= coloriageNb; i ++){
let coloriageId = "coloriage"+ i
coloriages.push(coloriageId)
}

$.each(coloriages, function(i, name){
  parseInt(i)
  let nb = i + 1
  let cont;

   cont =  $('.grid-container');
  cont.append("<div class='coloriage' id='" + name + "'></div>")
  $('#'+ name).makeSVGcolor("./assets/images/coloriage_svg/0" + nb  + ".svg")
  $('.coloriage').draggable();
})



//animation onscroll des illustration qui arrivent.
