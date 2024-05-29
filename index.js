let nbChap = 0;
const specialChapter = {
  91: 90.1,
  127: 125.5,
  128: 125.6,
  129: 125.7,
  130: 125.8,
};
const chapters = [];
let tries = 0;
let score = 0;
let correctChapter = -1;

function loadImage() {
  const chapterId = Math.floor(Math.random() * nbChap) + 1;
  const chapter = chapters[chapterId];
  correctChapter = chapter.numChapitre;
  const randomPage = Math.floor(Math.random() * chapter.pages.length);
  const imageUrl = chapter.pages[randomPage];
  $("#randomMangaPage").attr("src", imageUrl);
  $("#message").text(""); // Clear message
}

function adjustCropHeight() {
  const img = document.getElementById("randomMangaPage");
  const height = 190;
  if (height) {
    $(".crop").height(height);
  } else {
    img.onload = function () {
      $(".crop").height(190);
    };
  }
}

function submitAnswer() {
  lose = 0;
  if (lose == 1) {
    nextImage();
  } else {
    const guessedChapter = $("#chapter").val();
    if (guessedChapter == correctChapter) {
      adjustCropHeight();
      score++;
      $("#message").text("Bravo ! Vous avez deviné correctement !");
      $("#score").text("Score : " + score);
      $(".crop").height(875);
      tries = 0;
    } else {
      tries++;
      if (tries < 5) {
        console.log(lose);
        $("#message").text("Désolé, ce n'est pas le chapitre " + guessedChapter + ". Essayez encore !");
        $(".crop").height(tries * 220);
      } else {
        $("#message").text("Désolé, la bonne réponse était le chapitre " + correctChapter + ".");
        $(".crop").height(900);
        lose = 1;
        console.log(lose);
      }
    }
  }
}

function openChapter() {
  window.open(`https://cubari.moe/read/gist/cmF3L0ltU2FrdXNoaS9Pc2hpTm9Lb0ZSL21hc3Rlci9Pc2hpTm9Lby5qc29u/${correctChapter}/1/`, "_blank");
}

function nextImage() {
  $(".crop").height(190);
  tries = 0;
  loadImage();
}

$(document).ready(function () {
  let counter = 1;
  try {
    while (typeof eval(`eps${nbChap + 1}`) != "undefined") {
      nbChap++;
      const pages = eval(`eps${nbChap}`).map((url) => {
        const urlParam = new URLSearchParams(url);
        const id = urlParam.get("id");
        return `https://drive.google.com/thumbnail?id=${id}&sz=w1000`;
      });
      let numChapitre;
      if (Object.keys(specialChapter).includes("" + nbChap)) {
        numChapitre = specialChapter[nbChap];
      } else {
        numChapitre = counter;
        counter++;
      }
      chapters.push({ numChapitre: numChapitre, pages: pages });
    }
  } catch (e) {
    console.log(e);
  }

  loadImage();
  setTimeout(adjustCropHeight, 500); // Wait a bit for the image to load

  $("#chapter").keypress(function (event) {
    if (event.key === "Enter") {
      submitAnswer();
    }
  });
});
