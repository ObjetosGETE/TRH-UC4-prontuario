(function ($) {
  "use strict";

  const BREAKPOINT = 767;

  let layoutMode = getLayout();
  let correctCount = 0;
  let totalCorrect = countCorrectDocs();
  let gameStarted = false;

  function getLayout() {
    return $(window).width() <= BREAKPOINT ? "mobile" : "desktop";
  }

  function countCorrectDocs() {
    return layoutMode === "desktop" ? $(".doc.c").length : $(".doc.cm").length;
  }

  function resetGame() {
    correctCount = 0;
    layoutMode = getLayout();
    totalCorrect = countCorrectDocs();
    gameStarted = false;

    $(".doc").show().draggable("enable");
    $(".zona-soltar-responsiva").css(
      "background-image",
      "url('assets/img/pasta_vazia.png')"
    );
    $(".img-pasta-mobile").attr("src", "assets/img/pasta_vazia.png");
  }

  function updateFolderImageIfFirstDoc() {
    if (correctCount !== 0) return;
    $(".zona-soltar-responsiva").css(
      "background-image",
      "url('assets/img/pasta_docs.png')"
    );
    $(".img-pasta-mobile").attr("src", "assets/img/pasta_docs.png");
  }

  function openFinalModal() {
    $("#modalFimDoJogo").modal("show");
  }

  function mostrarTelaDeConferencia() {
    $(".tela-1").addClass("d-none");
    $(".tela-2").removeClass("d-none");
  }

  function validateDesktop($doc) {
    if ($doc.hasClass("i")) {
      $("#audio-errado")[0]?.play();
      $("#modalFeedbackNegativa").modal("show");
      return;
    }
    $("#audio-acerto")[0]?.play();
    correctCount++;
    if (correctCount === totalCorrect) setTimeout(openFinalModal, 500);
  }

  function validateMobile($doc) {
    if ($doc.hasClass("im")) {
      $("#audio-errado")[0]?.play();
      $("#modalFeedbackNegativa").modal("show");
      return;
    }
    $("#audio-acerto")[0]?.play();
    correctCount++;
    if (correctCount === totalCorrect) setTimeout(openFinalModal, 500);
  }

  function validateDoc($doc) {
    layoutMode === "desktop" ? validateDesktop($doc) : validateMobile($doc);
  }

  $(".doc").draggable({
    helper: "clone",
    appendTo: "body",
    cursor: "move",
    start: (e, ui) =>
      ui.helper.css({
        position: "fixed",
        left: e.pageX - ui.helper.width() / 2,
        top: e.pageY - ui.helper.height() / 2,
        zIndex: 10000,
        pointerEvents: "none",
      }),
    drag: (e, ui) =>
      ui.helper.css({
        left: e.pageX - ui.helper.width() / 2,
        top: e.pageY - ui.helper.height() / 2,
      }),
  });

  $(".zonaDeSoltar").droppable({
    accept: (el) => $(el).is(".doc:visible"),
    hoverClass: "zona-hover",
    drop: (e, ui) => {
      if (!ui.draggable.is(":visible")) return;
      gameStarted = true;
      ui.draggable.hide().draggable("disable");
      updateFolderImageIfFirstDoc();
      validateDoc(ui.draggable);
    },
  });

  $(".conferir").on("click", mostrarTelaDeConferencia);

  $(window).on("resize", handleResize);
  handleResize();
  $("#modalIntroducao").modal("show");

  function applyScale() {
    const scale = Math.min($(window).width() / 1920, $(window).height() / 1080);
    $(".tela-responsiva").css({
      transform: `scale(${scale})`,
      "transform-origin": "center center",
    });
  }

  function handleResize() {
    const now = getLayout();

    if (now === "mobile") {
      $(".tela-responsiva").css("transform", "scale(1)");
      $(".tela-mobile").removeClass("d-none");
      $(".tela-responsiva").addClass("d-none");
    } else {
      applyScale();
      $(".tela-mobile").addClass("d-none");
      $(".tela-responsiva").removeClass("d-none");
    }

    if (!gameStarted && now !== layoutMode) resetGame();
    layoutMode = now;
  }
})(jQuery);
