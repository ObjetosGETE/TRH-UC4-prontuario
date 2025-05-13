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
          $(".zona-soltar-responsiva").css(
            "background-image",
            "url('assets/img/pasta_docs.png')"
          );
          primeiraImagemAtualizada = true;
          console.log("Imagem da pasta atualizada para pasta_docs.png");
        }

        if (acertosNaRodada === corretosPorRodada[rodadaAtual]) {
          if (rodadaAtual < totalRodadas) {
            setTimeout(() => {
              $("#modalNovaRodada").modal("show");
              setTimeout(() => {
                $("#modalNovaRodada").modal("hide");
                avancarRodada();
              }, 9000);
            }, 900);
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

function escalaProporcao(largura, altura) {
  var larguraScreen = $(window).width();
  var alturaScreen = $(window).height();
  var proporcaoAltura = (alturaScreen * 100) / altura;
  var proporcaoLargura = (larguraScreen * 100) / largura;
  var proporcao, larguraAltura, larguraAlturaAuto;

  if (proporcaoAltura < proporcaoLargura) {
    larguraAltura = "height";
    larguraAlturaAuto = "width";
    proporcao = proporcaoAltura / 100;
  } else {
    larguraAltura = "width";
    larguraAlturaAuto = "height";
    proporcao = proporcaoLargura / 100;
  }

  console.log(proporcao, proporcaoAltura, proporcaoLargura);
  return [proporcao, larguraAltura, larguraAlturaAuto];
}

function resizeBodyConteudo() {
  var proporcao1920 = escalaProporcao(1920, 1080)[0];

  $(".conteudo").css({
    transform: "scale(" + proporcao1920 + ")",
    "transform-origin": "center center",
  });

  var proporcao900;

  if ($(window).width() < 992) {
    proporcao900 = escalaProporcao(900, 576)[0];
  } else {
    proporcao900 = 1;
  }
}

$(window).on("load", function () {
  $("#modalIntroducao").modal("show");

  iniciarJogoDocumentos();
  ativarDragNosItensVisiveis();
  abreResposta();

  resizeBodyConteudo();
  $(window).resize(function () {
    resizeBodyConteudo();
  });
});
