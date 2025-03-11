$(document).ready(function() {
  //  $(window).on("resize", resizeBodyConteudo);
  //  resizeBodyConteudo();
    $("#modalIntroducao").modal("show");

    let correctCount = 0;
    const totalCorrect = $(".doc.c").length;

    function updateFolderImageIfFirstDoc($doc) {
      if ($doc.hasClass('doc')) {
        $("#zonaDeSoltar").css("background-image", "url('assets/img/pasta_docs.png')");
      }
    }

    function openFinalModal() {
      $("#modalFimDoJogo").modal("show");
    }
  
    function validateDoc($doc) {
      if ($doc.hasClass('i')) {

        $("#audio-errado")[0].play();
        $("#modalFeedbackNegativa").modal("show");
      } else if ($doc.hasClass('c')) {

        $("#audio-acerto")[0].play();

        correctCount++;

        if (correctCount === totalCorrect) {
          setTimeout(openFinalModal, 500);
        }
      }
    }
  
    $(".doc").draggable({
      helper: "clone", 
      revert: function(dropped) {
        if (!dropped) {
          $(this).fadeIn();
          return true;
        }
        return false;
      },
      cursor: "move",
      containment: "document",
      zIndex: 100,
      start: function(event, ui) {

        $(this).fadeOut();
        $("#audio-clique")[0].play();
      }
    });
  
    $("#zonaDeSoltar").droppable({
      accept: ".doc", 
      hoverClass: "zona-hover",
      drop: function(event, ui) {
        var $original = ui.draggable;

        updateFolderImageIfFirstDoc($original);

        $original.hide().draggable("disable");

        validateDoc($original);
      }
    });
  });
  

//   function escalaProporcao(largura, altura) {
//     var larguraScreen = $(window).width();
//     var alturaScreen = $(window).height();
//     var proporcaoAltura = (alturaScreen * 100) / altura;
//     var proporcaoLargura = (larguraScreen * 100) / largura;
//     var proporcao, larguraAltura, larguraAlturaAuto;
  
//     if (proporcaoAltura < proporcaoLargura) {
//       larguraAltura = "height";
//       larguraAlturaAuto = "width";
//       proporcao = proporcaoAltura / 100;
//     } else {
//       larguraAltura = "width";
//       larguraAlturaAuto = "height";
//       proporcao = proporcaoLargura / 100;
//     }
  
//     return [proporcao, larguraAltura, larguraAlturaAuto];
//   }
  
//   function resizeBodyConteudo() {
//     var proporcao1920 = escalaProporcao(1920, 1080)[0];
  
//     $(".conteudo").css({
//       transform: "scale(" + proporcao1920 + ")",
//       "transform-origin": "center center",
//     });
  
//     var proporcao900;
  
//     if ($(window).width() < 992) {
//       proporcao900 = escalaProporcao(900, 576)[0];
//     } else {
//       proporcao900 = 1;
//     }
//   }