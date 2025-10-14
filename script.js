  //animazione fade in per la yerza sezione//
  document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // si anima solo la prima volta
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('.vantaggio, .abatel, .titolo-vantaggi')
      .forEach((el) => {
        el.classList.add('hidden');
        observer.observe(el);
      });
  });
const elements = document.querySelectorAll('.hidden');

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      observer.unobserve(entry.target); // animazione solo la prima volta
    }
  });
}, { threshold: 0.1 }); // entra in scena quando almeno 10% visibile

elements.forEach(el => observer.observe(el));
document.addEventListener("DOMContentLoaded", () => {
  const fibraBox = document.querySelector(".fibra-box");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        fibraBox.classList.add("show");
        observer.unobserve(fibraBox); // lo fa solo una volta
      }
    });
  }, { threshold: 0.2 });

  observer.observe(fibraBox);
});

// js di impianti elettrici civili//
document.addEventListener("DOMContentLoaded", () => {
  const immagine = document.querySelector('.sinistra');

  if(immagine){
    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(immagine);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll('.sinistra, .approccio');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        // non unobserve, così resta visibile
      }
    });
  }, { threshold: 0.1 }); // threshold più basso per catturare subito l'elemento

  elementi.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll('.approccio, .civile');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  elementi.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll('.approccio, .civile, .visione');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });

  elementi.forEach(el => observer.observe(el));
});
 document.addEventListener("DOMContentLoaded", () => {
    const elementi = document.querySelectorAll(".destra2"); // seleziona tutti gli elementi con classe "destra"

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible"); 
          observer.unobserve(entry.target); // opzionale: smette di osservarlo dopo la prima volta
        }
      });
    }, { threshold: 0.2 }); // 20% visibile prima di attivarsi

    elementi.forEach(el => observer.observe(el));
  });

document.addEventListener("DOMContentLoaded", function () {
  const elementi = document.querySelectorAll('.work-process-container'); 

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visibili');
        observer.unobserve(entry.target); // così non sparisce più quando esci
      }
    });
  }, { threshold: 0.2 });

  elementi.forEach(el => observer.observe(el));
});

const faders = document.querySelectorAll('.fade-right, .fade-left');

const appearOptions = {
  threshold: 0.5
};

const appearOnScroll = new IntersectionObserver(function(entries, observer){
  entries.forEach(entry => {
    if(!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, appearOptions);

faders.forEach(fader => {
  appearOnScroll.observe(fader);
});

document.addEventListener("DOMContentLoaded", function() {
  const images = document.querySelectorAll('.fade-in-scroll');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.5 }); // quando il 50% dell'immagine è visibile

  images.forEach(img => observer.observe(img));
});
document.addEventListener("DOMContentLoaded", function () {
  const elementi = document.querySelectorAll(".svolgimento, .analisi");

  function checkVisibilita() {
    const triggerBottom = window.innerHeight * 0.85;

    elementi.forEach(el => {
      const boxTop = el.getBoundingClientRect().top;

      if (boxTop < triggerBottom) {
        el.classList.add("visibili");
      } else {
        el.classList.remove("visibili"); // opzionale se vuoi che sparisca quando esce
      }
    });
  }

  window.addEventListener("scroll", checkVisibilita);
  checkVisibilita();
});




document.addEventListener('DOMContentLoaded', () => {
  const descrizione = document.querySelector('.abatel-description');

  if (!descrizione) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show'); // fa partire l'animazione
          obs.unobserve(entry.target);        // solo la prima volta
        }
      });
    }, { threshold: 0.2 });

    observer.observe(descrizione);
  } else {
    // fallback per browser vecchi
    const rect = descrizione.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      descrizione.classList.add('show');
    }
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const pulsante = document.querySelector(".pulsante-sipario");

  function checkVisibility() {
    const rect = pulsante.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      pulsante.classList.add("visible");
      window.removeEventListener("scroll", checkVisibility); // rimuove dopo l'attivazione
    }
  }

  window.addEventListener("scroll", checkVisibility);
  checkVisibility(); // per il caso in cui il bottone sia già visibile al caricamento
});


const ethernetImg = document.querySelector('.ethernet');

function handleScroll() {
  const triggerPoint = window.innerHeight * 0.9; // quando l'immagine entra nel viewport
  const imgTop = ethernetImg.getBoundingClientRect().top;

  if(imgTop < triggerPoint) {
    ethernetImg.classList.add('show'); // attiva animazione
  }
}

window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll); // se è già visibile al caricamento



document.addEventListener("DOMContentLoaded", function() {
  const elements = document.querySelectorAll(
    ".terzo-servizio, .quarto-servizio, .quinto-servizio, .sesto-servizio, .settimo-servizio, .ottavo-servizio, .prima-scritta"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
        }
      });
    },
    {
      threshold: 0.1  // l'elemento viene animato quando il 10% entra nel viewport
    }
  );

  elements.forEach(el => observer.observe(el));
});


const primoServizio = document.querySelector('.primo-servizio');

window.addEventListener('scroll', () => {
  const triggerPoint = window.innerHeight / 1.3; // quando l'immagine entra nello schermo

  const imageTop = primoServizio.getBoundingClientRect().top;

  if(imageTop < triggerPoint) {
    primoServizio.classList.add('animate-zoom');
  }
});




const img2 = document.querySelector('.secondo-servizio');

window.addEventListener('scroll', () => {
    const triggerPoint = window.innerHeight * 0.8; // 80% della finestra
    const imgTop = img2.getBoundingClientRect().top;

    if (imgTop < triggerPoint) {
        img2.classList.add('animate-slide');
    }
});




const img3 = document.querySelector('.terzo-servizio');

window.addEventListener('scroll', () => {
    const triggerPoint = window.innerHeight * 0.8;
    const imgTop = img3.getBoundingClientRect().top;

    if (imgTop < triggerPoint) {
        img3.classList.add('animate-drop');
    }
});



document.addEventListener("DOMContentLoaded", function () {
  const quartoServizio = document.querySelector(".container-quarto .quarto-servizio");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function animateQuartoServizio() {
    if (isInViewport(quartoServizio)) {
      quartoServizio.classList.add("animate-rise");
      quartoServizio.style.opacity = "1";
      quartoServizio.style.transform = "translateY(-930%) translateX(30px)";
      quartoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
      window.removeEventListener("scroll", animateQuartoServizio);
    }
  }

  // Stato iniziale invisibile e fuori posizione
  quartoServizio.style.opacity = "0";
  quartoServizio.style.transform = "translateY(-870%) translateX(100px)";
  quartoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  window.addEventListener("scroll", animateQuartoServizio);
  animateQuartoServizio(); // in caso sia già visibile al load
});




document.addEventListener("DOMContentLoaded", function () {
  const quintoServizio = document.querySelector(".container-quinto .quinto-servizio");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function animateQuintoServizio() {
    if (isInViewport(quintoServizio)) {
      quintoServizio.style.opacity = "1";
      quintoServizio.style.transform = "translateY(-1120%) translateX(0)";
      quintoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
      window.removeEventListener("scroll", animateQuintoServizio);
    }
  }

  // Stato iniziale invisibile e spostato a sinistra
  quintoServizio.style.opacity = "0";
  quintoServizio.style.transform = "translateY(-1120%) translateX(-100px)";
  quintoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  window.addEventListener("scroll", animateQuintoServizio);
  animateQuintoServizio(); // in caso sia già visibile al load
});




document.addEventListener("DOMContentLoaded", function () {
  const sestoServizio = document.querySelector(".container-sesto .sesto-servizio");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function animateSestoServizio() {
    if (isInViewport(sestoServizio)) {
      sestoServizio.style.opacity = "1";
      sestoServizio.style.transform = "translateY(-1110%) rotate(0deg)";
      sestoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
      window.removeEventListener("scroll", animateSestoServizio);
    }
  }

  // Stato iniziale invisibile e ruotato
  sestoServizio.style.opacity = "0";
  sestoServizio.style.transform = "translateY(-1110%) rotate(-15deg)";
  sestoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  window.addEventListener("scroll", animateSestoServizio);
  animateSestoServizio(); // in caso sia già visibile al load
});




document.addEventListener("DOMContentLoaded", function () {
  const settimoServizio = document.querySelector(".container-settimo .settimo-servizio");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function animateSettimoServizio() {
    if (isInViewport(settimoServizio)) {
      settimoServizio.style.opacity = "1";
      settimoServizio.style.transform = "translateY(-1400%) translateX(0)";
      settimoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
      window.removeEventListener("scroll", animateSettimoServizio);
    }
  }

  // Stato iniziale: invisibile e spostato in basso a sinistra
  settimoServizio.style.opacity = "0";
  settimoServizio.style.transform = "translateY(-1350%) translateX(-100px)";
  settimoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  window.addEventListener("scroll", animateSettimoServizio);
  animateSettimoServizio(); // in caso sia già visibile al load
});




document.addEventListener("DOMContentLoaded", function () {
  const ottavoServizio = document.querySelector(".container-ottavo .ottavo-servizio");

  function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return rect.top <= window.innerHeight && rect.bottom >= 0;
  }

  function animateOttavoServizio() {
    if (isInViewport(ottavoServizio)) {
      ottavoServizio.style.opacity = "1";
      ottavoServizio.style.transform = "translateY(-1505%) translateX(0)";
      ottavoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";
      window.removeEventListener("scroll", animateOttavoServizio);
    }
  }

  // Stato iniziale: invisibile, spostato in basso a destra
  ottavoServizio.style.opacity = "0";
  ottavoServizio.style.transform = "translateY(-1450%) translateX(100px)";
  ottavoServizio.style.transition = "transform 0.8s ease-out, opacity 0.8s ease-out";

  window.addEventListener("scroll", animateOttavoServizio);
  animateOttavoServizio(); // in caso sia già visibile al load
});




// JS per animazione on scroll
// Seleziona l'immagine
const cabAbatel = document.querySelector('.ftt-cab-abatel');

// Funzione per controllare se l'elemento è visibile nello viewport
function isInViewport(element) {
  const rect = element.getBoundingClientRect();
  return (
    rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.bottom >= 0
  );
}

// Listener sullo scroll
window.addEventListener('scroll', () => {
  if (isInViewport(cabAbatel)) {
    cabAbatel.classList.add('show');
  }
  // Trigger iniziale
if (isInViewport(cabAbatel)) {
  cabAbatel.classList.add('show');
}
});


