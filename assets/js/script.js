let rodadaAtual = 1;
const totalRodadas = 3;
let corretosPorRodada = {};
let acertosNaRodada = 0;
let primeiraImagemAtualizada = false;

function iniciarJogoDocumentos() {
  corretosPorRodada = {
    1: $(".btn-doc.rodada-1.c").length,
    2: $(".btn-doc.rodada-2.c").length,
    3: $(".btn-doc.rodada-3.c").length,
  };

  $(".zonaDeSoltar").droppable({
    accept: ".btn-doc",
    drop: function (event, ui) {
      const item = ui.draggable;

      if (item.hasClass("usado")) return;

      if (item.hasClass("c")) {
        $("#audio-acerto")[0].play();
        item.addClass("usado").fadeOut();
        acertosNaRodada++;

        if (!primeiraImagemAtualizada) {
          $(".zona-soltar-responsiva img").attr(
            "src",
            "assets/img/pasta_docs.png"
          );
          primeiraImagemAtualizada = true;
          console.log("Imagem da pasta atualizada para pasta_docs.png");
        }

        if (acertosNaRodada === corretosPorRodada[rodadaAtual]) {
          desativarDocumentosVisiveis();

          if (rodadaAtual < totalRodadas) {
            setTimeout(() => {
              $("#modalNovaRodada").modal("show");
              setTimeout(() => {
                $("#modalNovaRodada").modal("hide");
                avancarRodada();
              }, 2000);
            }, 500);
          } else {
            setTimeout(() => {
              avancarRodada();
            }, 2000);
          }
        }
      } else if (item.hasClass("i")) {
        $("#audio-errado")[0].play();
        $("#modalFeedbackNegativa").modal("show");
      }
    },
  });
}

function avancarRodada() {
  const rodadaAnterior = rodadaAtual;
  rodadaAtual++;
  acertosNaRodada = 0;

  console.log(
    `Avançando para rodada ${rodadaAtual}. Escondendo rodada ${rodadaAnterior}`
  );

  $(`.rodada-${rodadaAnterior}`).fadeOut(400, function () {
    $(`.rodada-${rodadaAnterior}`).addClass("d-none");

    if (rodadaAtual > totalRodadas) {
      setTimeout(() => {
        $(".btn-doc").fadeOut();
        setTimeout(() => {
          $("#modalFimDoJogo").modal("show");
        }, 500);
      }, 500);
    } else {
      console.log(`Exibindo rodada ${rodadaAtual}`);
      $(`.rodada-${rodadaAtual}`)
        .removeClass("d-none")
        .hide()
        .fadeIn(() => {
          ativarDragNosItensVisiveis();
        });
    }
  });
}

function desativarDocumentosVisiveis() {
  $(".btn-doc:visible").draggable("disable").css({
    "pointer-events": "none",
    opacity: "0.5",
  });
}

function ativarDragNosItensVisiveis() {
  $(".btn-doc:visible").draggable({
    containment: ".tela-1",
    scroll: false,
    revert: function (dropValid) {
      return dropValid && $(this).hasClass("c") ? false : true;
    },
  });
}
function abreResposta() {
  $("#abre-resposta").on("click", function () {
    $(".tela-1").addClass("d-none");
    $(".tela-2").removeClass("d-none");
  });
}

$(window).on("load", function () {
  $("#modalIntroducao").modal("show");

  iniciarJogoDocumentos();
  ativarDragNosItensVisiveis();
  abreResposta();
});
