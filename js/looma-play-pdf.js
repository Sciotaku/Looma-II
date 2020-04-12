/*
Owner: VillageTech Solutions (villagetechsolutions.org)
Date: 2020 03
Revision: Looma 2.0.0
Author: Skip
filename: looma-play-pdf.js
Description: display layer built on pdf.js for showing chapters in PDFs
 */

"use strict";

pdfjsLib.GlobalWorkerOptions.workerSrc = "js/pdfjs/pdf.worker.min.js";

//DEBUG  const filename = '../content/textbooks/Class1/Math/Math-1-1051.pdf';
const initialZoom = 2.3;
let currentScale = initialZoom;

let filename, filepath, startPage; //filename, filepath, startPage, initial zoom level and len (number of pages) are passed in by the PHP
var endPage, maxPages, currentPage, pdfdoc;  //pdfdoc holds the 'doc' object returned by pdf.js
var lastScrollTop = 0;
var zooming = false;
var abortSignal = false;
var didScroll = false;

function makePageDivs(doc, start, finish) {
    // allocate a canvas and a text-layer for each of the pages of this DOC from page = START to page = FINISH
    for (var page = start; page <= finish; page++) {
        $('<canvas/>', {id:'pdf-canvas'+page, class: 'pdf-canvas'}).appendTo('#pdf');
        $('<div/>', {id:'pdf-text'+page, class: 'pdf-text textLayer'}).appendTo('#pdf');
    }
}  // end makePageDivs

async function drawPage (doc, pagenum)  {
    doc.getPage(pagenum).then (page => {
        const pdf_canvas = document.getElementById('pdf-canvas'+pagenum);
        const pdf_context = pdf_canvas.getContext('2d');
        
        // if pagerendering [this page] then render.cancel (this page).then(render)
        
        
        $('#pdf-text'+pagenum).empty();
        let viewport = page.getViewport({scale:currentScale});
        pdf_canvas.width = viewport.width;
        pdf_canvas.height = viewport.height;
        
        // pagerendering[this page] = true;
        
        
        page.render ({canvasContext:pdf_context, viewport:viewport})
            .promise.then(function() {
            // Returns a promise, on resolving it will return text contents of the page
              return page.getTextContent();})
            .then(function(textContent) {
            
            //var pdf_canvas = $("#pdf-canvas");  // PDF canvas
            var canvas_height = pdf_canvas.height;  // Canvas height
            var canvas_width = pdf_canvas.width;  // Canvas width
            var canvas_top = pdf_canvas.offsetTop;  // Canvas top
            var canvas_left = pdf_canvas.offsetLeft;  // Canvas left
            
            // Assign CSS to the text-layer element
            $("#pdf-text"+pagenum).css({ left:   canvas_left + 'px',
                top:    canvas_top + 'px',
                height: canvas_height + 'px',
                width:  canvas_width + 'px' });
            
            // Pass the data to the method for rendering of text over the pdf canvas.
            pdfjsLib.renderTextLayer({
                textContent: textContent,
                container: $("#pdf-text"+pagenum).get(0),
                viewport: viewport,
                textDivs: []
            });
            // .then(pagerendering [ this page ] = false;
            
            
            
            // the text layer should render on top of the canvas,
            // but it is being drawn below the canvas
            // this next statement compensates for the mis-placement of text layer
            // and puts the text right on top of the corresponding text in the canvas
            $("#pdf-text"+pagenum).css('top', pdf_canvas.top);
            
            //showPageNum(pagenum);
        });
    });
}  //end drawPage

async function drawMultiplePages(doc, start, finish) {
    // display the pages of this DOC from page = START to page = FINISH
    for (var page = start; page <= /*start*/ finish; page++) {
        
        //$('<canvas/>', {id:'pdf-canvas'+page, class: 'pdf-canvas'}).appendTo('#pdf');
        //$('<div/>', {id:'pdf-text'+page, class: 'pdf-text textLayer'}).appendTo('#pdf');
    
        await drawPage(pdfdoc, page);
        //if (abortSignal) {abortSignal = false; return;}
    }
}  // end drawMultiplePages

function abortDrawing() {
    abortSignal = true;
}
function enablePageControls() {
    
    $('#next-page').off('click').one('click', function (e) {
        e.preventDefault();
        if (currentPage < endPage) showPage(currentPage + 1);
    });
    $('#prev-page').off('click').one('click', function (e) {
        e.preventDefault();
        if (currentPage > startPage) showPage(currentPage - 1);
    });
}
function showPage(pagenum) {
    if (startPage <= pagenum && pagenum <= endPage) {
        console.log('showing page ' + pagenum);
        currentPage = pagenum;
    
        $('#pdf').stop(true,true)
            .off('scroll')
            .animate({
            scrollTop: $("#pdf-canvas" + pagenum)[0].offsetTop
        }, 1500).on('scroll',function() {didScroll = true;});
    }
    showPageNum(pagenum);
    didScroll = false;
    enablePageControls();
} // end showPage

function showPageNum (p) {
    console.log('called showpagenum with ' + p);
    $('#pagenum').text(p - startPage + 1);
}

function getScrolledPage() {
    for (var i = startPage; i <= endPage; i++) {
        if (isScrolledIntoView(($('#pdf-canvas' + i)))) {
            showPageNum(i);
            currentPage = i;
            break;
        }
    }
}
// detect SCROLL and reset page# indicator to currently displayed page
function isScrolledIntoView($elem){ // or window.addEventListener("scroll"....
    var inview;
    var viewTop = $('#pdf').scrollTop();
    var viewTopThird = viewTop + $('#pdf').height() / 3;
    var viewBottomThird = viewTop + $('#pdf').height() * 2 / 3;
    var viewBottom = viewTop + $('#pdf').height();
    var pageTop = $elem[0].offsetTop;
    var pageBottom = $elem[0].offsetTop + $elem.height();
    if (viewTop >= lastScrollTop){  // direction of scroll is 'down'
        inview = ( viewTop <= pageTop && pageTop <= viewTopThird );
    } else {                       // direction of scroll is 'up'
        inview = ( viewBottomThird <= pageBottom && pageBottom <= viewBottom );
    }
    lastScrollTop = viewTop <= 0 ? 0 : viewTop; // For Mobile or negative scrolling
    return inview;
}
function turnOffControls() {$('.toolbar-button').prop('disabled', true);}  // end turnOffControls

function turnOnControls()  {$('.toolbar-button').prop('disabled', false);}  // end turnOnControls

function enableZoomControls() {
    $('#zoom-out').one('click', async function () {
        $('#zoom-btn').text(Math.round((currentScale * 0.8 / initialZoom) * 100).toString() + '%');
        await setZoom(currentScale * 0.8);
    });
    
    $('#zoom-in').one('click', async function () {
        $('#zoom-btn').text(Math.round((currentScale * 1.25 / initialZoom) * 100).toString() + '%');
        await setZoom(currentScale * 1.25);
    });
}
function disableZoomControls() {
    $('#zoom-out, #zoom-in').off('click')
}
async function setZoom(zoom) {
    if (zoom !== currentScale && !zooming) {
        //abortDrawing();
        currentScale = zoom;
        //$('#pdf').empty();
        //turnOffControls();
        disableZoomControls();
        zooming = true;
        await drawMultiplePages(pdfdoc, startPage, endPage);
        zooming = false;
        enableZoomControls();
        //turnOnControls();
    }
} // end setZoom

function displayThumb (doc, pagenum)  {
        doc.getPage(pagenum).then (page => {
        const thumb_canvas = document.getElementById('thumb-canvas'+pagenum);
        const thumb_context = thumb_canvas.getContext('2d');
        let viewport = page.getViewport({scale:0.25});
        thumb_canvas.width = viewport.width;
        thumb_canvas.height = viewport.height;
        page.render ({canvasContext:thumb_context, viewport:viewport});
        });
}  //end displayThumb

async function displayMultipleThumbs (doc, start, finish) {
         for (var page = start; page <= finish; page++) {
            
             $('<canvas/>', {id:'thumb-canvas'+page, class: 'thumb-canvas'}).appendTo('#thumbs');
             $('#thumb-canvas'+page).attr('data-page',page);
             displayThumb(pdfdoc, page);
         }
} // end displayMultipleThumbs

async function drawThumbs() {
    await displayMultipleThumbs(pdfdoc, startPage, endPage);
    $('#showthumbs').click(function () {$('#thumbs').toggle();});
    $('.thumb-canvas').click(function() {
        $('#thumbs').hide();
        showPage($(this).attr('data-page'));
    });
    $('#showthumbs').show();
}
window.onload = function() {

// *********  PAGE controls ***************
    
    enablePageControls();
    
// *********  ZOOM controls ***************
    
    enableZoomControls();

    $('#zoom-btn').click ( function(){$('#zoom-dropdown').toggle();});
    
    $('.zoom-item').click( /*async*/ function() {
            var zoom = $(this).data('zoom');
            var level = $(this).data('level');
        /*await*/ setZoom(level);
            $('#zoom-btn').text(zoom);
            $('#zoom-dropdown').hide();
        });

// *********  FULLSCREEN controls ***************
    
    $('#fullscreen-control').click(function () {
        if (document.fullscreenElement) {
            currentScale = currentScale * 1 / 1.08;
            //$('#pdf').css( overflowX, "auto");
        }
        else {
            currentScale = currentScale * 1.08;
            //$('#pdf').css( overflowX, "none");
        }
        LOOMA.toggleFullscreen;
        drawMultiplePages(pdfdoc, startPage, endPage);
        return false;
    });
    
    //$("#pdf").scroll(getScrolledPage);
    
// *********  SCROLL controls ***************

    $('#pdf').scroll(function() {didScroll = true;});
    
    // the SETINTERVAL call de-bounces scroll events, so the handler "getScrolledPage" is only called every "wait" msec
    setInterval(function() {
        if ( didScroll ) {getScrolledPage();didScroll = false; }
        }, 250);
    
    $('#find').change(); //FIND operation not implemented this version
    
    // get calling PARAMs
    filename = $('#pdf').data('fn');
    filepath = $('#pdf').data('fp');
    startPage = $('#pdf').data('page') ? $('#pdf').data('page') : 1;
    if ($('#pdf').data('len') && $('#pdf').data('len') >0)
        endPage = startPage + $('#pdf').data('len') - 1; else endPage = startPage + 999;
    currentScale = $('#pdf').data('zoom') ? $('#pdf').data('zoom') : initialZoom;
    
    // load the PDF file
    //turnOffControls();
    pdfjsLib.getDocument(filepath + filename).promise.then(
        async function(doc) {
            pdfdoc = doc;
            currentPage = startPage;
            maxPages = doc._pdfInfo.numPages || 1;
            if (endPage > maxPages) endPage = maxPages;
            $('#maxpages').text(endPage - startPage + 1);
            console.log('loaded file ' + filepath + filename + ' with ' + maxPages + ' pages');
           
            makePageDivs(doc, startPage, endPage);
            
           // displayFirstPage(doc,startPage);
            
            await drawMultiplePages(doc, startPage, endPage).promise;
            showPageNum(startPage);
            //turnOnControls();
        }).then( () =>  {drawThumbs();});
    
};
