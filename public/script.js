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



const lavoraSection = document.getElementById('lavoraContent');

window.addEventListener('scroll', () => {
  const rect = lavoraSection.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.8) {
    lavoraSection.classList.add('visible');
  }
});


document.addEventListener("DOMContentLoaded", () => {
    const btn = document.querySelector(".btn-lavora");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          btn.classList.add("animate");
          observer.unobserve(btn);
        }
      });
    }, { threshold: 0.5 });

    observer.observe(btn);
  });


const btnTornaSu = document.getElementById('btn-torna-su');

window.addEventListener('scroll', () => {
  if(window.scrollY > 300){ // compare dopo 300px
    btnTornaSu.classList.add('show');
  } else {
    btnTornaSu.classList.remove('show');
  }
});

btnTornaSu.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener("DOMContentLoaded", function() {
  const linee = document.querySelectorAll('.linea-fade-up');

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('show');
        observer.unobserve(entry.target); // animazione una sola volta
      }
    });
  }, { threshold: 0.1 });

  linee.forEach(linea => observer.observe(linea));
});




document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll(".contenitore h4, .contenitore h3, .contenitore p");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        observer.unobserve(entry.target); // Animazione una volta sola
      }
    });
  }, { threshold: 0.1 }); // Appena visibile il 10%

  elementi.forEach(el => observer.observe(el));
});


window.addEventListener('scroll', () => {
  const img = document.querySelector('.presa');
  const posizione = img.getBoundingClientRect().top;
  const altezzaFinestra = window.innerHeight;

  if (posizione < altezzaFinestra * 0.8) {
    img.classList.add('visibile');
  }
});

  document.addEventListener("DOMContentLoaded", () => {
    const elemento = document.querySelector(".capo-lista");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visibile");
          observer.unobserve(entry.target); // attiva una sola volta
        }
      });
    }, { threshold: 0.2 });

    if (elemento) {
      observer.observe(elemento);
    }
  });

    document.addEventListener("DOMContentLoaded", () => {
    const elemento = document.querySelector(".descrzione-fibra-ottica");

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visibile");
          observer.unobserve(entry.target); // attiva solo una volta
        }
      });
    }, { threshold: 0.2 });

    if (elemento) {
      observer.observe(elemento);
    }
  });


  document.addEventListener("DOMContentLoaded", () => {
  const descrizione = document.querySelector(".descrizione-sceglierci");

  function mostraAnimazione() {
    const posizione = descrizione.getBoundingClientRect().top;
    const altezzaFinestra = window.innerHeight;

    // Quando l'elemento entra in vista (75% dello schermo)
    if (posizione < altezzaFinestra * 0.75) {
      descrizione.classList.add("mostrato");
      window.removeEventListener("scroll", mostraAnimazione); // evita ri-trigger
    }
  }

  window.addEventListener("scroll", mostraAnimazione);
  mostraAnimazione(); // per il caso in cui sia già visibile
});


document.addEventListener("DOMContentLoaded", () => {
  const work = document.querySelector(".work");

  function mostraWork() {
    const posizione = work.getBoundingClientRect().top;
    const altezzaFinestra = window.innerHeight;

    if (posizione < altezzaFinestra * 0.85) {
      work.classList.add("visibile");
      window.removeEventListener("scroll", mostraWork);
    }
  }

  window.addEventListener("scroll", mostraWork);
  mostraWork(); // se già visibile
});

document.addEventListener("DOMContentLoaded", () => {
  const workProcess = document.querySelector(".work-process");

  function mostraWorkProcess() {
    const posizione = workProcess.getBoundingClientRect().top;
    const altezzaFinestra = window.innerHeight;

    if (posizione < altezzaFinestra * 0.85) { // entra in vista
      workProcess.classList.add("visibile");
      window.removeEventListener("scroll", mostraWorkProcess);
    }
  }

  window.addEventListener("scroll", mostraWorkProcess);
  mostraWorkProcess(); // se già visibile
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".btn-sipario10");

  function mostraBtn() {
    const posizione = btn.getBoundingClientRect().top;
    const altezzaFinestra = window.innerHeight;

    if (posizione < altezzaFinestra * 0.9) {
      btn.classList.add("visibile");
      window.removeEventListener("scroll", mostraBtn);
    }
  }

  window.addEventListener("scroll", mostraBtn);
  mostraBtn(); // se già visibile
});


document.addEventListener("DOMContentLoaded", () => {
  const titolo = document.querySelector('.accontentarsi');
  const testo = document.querySelector('.descrzione-ftt-cab');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 }); // trigger quando il 20% entra

  if (titolo) observer.observe(titolo);
  if (testo) observer.observe(testo);
});

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.querySelector(".link-contatti");

  function mostraBtn() {
    const posizione = btn.getBoundingClientRect().top;
    const altezzaFinestra = window.innerHeight;

    if (posizione < altezzaFinestra * 0.9) {
      btn.classList.add("visibile");
      window.removeEventListener("scroll", mostraBtn);
    }
  }

  window.addEventListener("scroll", mostraBtn);
  mostraBtn(); // se già visibile
});





// Seleziona titolo e testo
const titolo = document.querySelector('.perchè-sceglierci h2');
const testo = document.querySelector('.perchè-sceglierci p');

function animazioniScroll() {
  const titoloRect = titolo.getBoundingClientRect();
  const testoRect = testo.getBoundingClientRect();

  if(titoloRect.top < window.innerHeight && titoloRect.bottom > 0){
    titolo.classList.add('visible');
  }

  if(testoRect.top < window.innerHeight && testoRect.bottom > 0){
    testo.classList.add('visible');
  }
}

// Controlla al load e allo scroll
window.addEventListener('scroll', animazioniScroll);
window.addEventListener('load', animazioniScroll);




// Seleziona l'immagine
// Seleziona tutte le immagini con la classe .server

window.addEventListener('load', () => {
  const img = document.querySelector('.fili-ottica');
  img.classList.add('animate');
});


// Seleziona tutti gli elementi da animare
// Rileva quando l'elemento entra nel viewport
// Seleziona tutti gli elementi da animare
const sezioni = document.querySelectorAll('.sezione-testuale');

function animazioneScroll() {
  const windowHeight = window.innerHeight;

  sezioni.forEach(el => {
    const posizione = el.getBoundingClientRect().top; // distanza dall'alto del viewport
    const triggerPoint = windowHeight * 0.8; // quando 80% dello schermo dall'alto

    if(posizione < triggerPoint) {
      el.classList.add('visible'); // aggiunge classe per animazione
    }
  });
}

// Esegui al caricamento e allo scroll
window.addEventListener('scroll', animazioneScroll);
window.addEventListener('load', animazioneScroll);


const workRectangle = document.querySelector('.work-process-rectangle');

  function animateRectangle() {
    const rectTop = workRectangle.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.9;

    if (rectTop < triggerPoint) {
      workRectangle.classList.add('visible');
    }
  }

  window.addEventListener('scroll', animateRectangle);
  window.addEventListener('load', animateRectangle);

document.addEventListener("DOMContentLoaded", () => {
  const titolo = document.querySelector(".titolO");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animazione una sola volta
        }
      });
    },
    {
      threshold: 0.1 // il 10% del titolo deve essere visibile per far partire l'animazione
    }
  );

  observer.observe(titolo);
});

document.addEventListener("DOMContentLoaded", () => {
  const immagini = document.querySelectorAll(".fili-ottica");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animazione una sola volta
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  immagini.forEach(img => observer.observe(img));
});


document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll(".osservazione");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          observer.unobserve(entry.target); // animazione una sola volta
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  elementi.forEach(el => observer.observe(el));
});


const Rectangle = document.querySelector('.rectangle');

  function animateRectangle() {
    const rectTop = Rectangle.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.9;

    if (rectTop < triggerPoint) {
      Rectangle.classList.add('visible');
    }
  }

  window.addEventListener('scroll', animateRectangle);
  window.addEventListener('load', animateRectangle);


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target); // per non rianimare ogni volta
        }
      });
    },
    {
      threshold: 0.2, // l'elemento si anima quando è almeno al 20% visibile
    }
  );

  // Osserva tutti gli elementi con animazione
  document.querySelectorAll(".industria").forEach((el) => {
    observer.observe(el);
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  const sezione = document.querySelector(".contenitore-testo");
  observer.observe(sezione);
});


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  const elementi = document.querySelectorAll(".linea-sezione");
  elementi.forEach(el => observer.observe(el));
});

document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  const elementi = document.querySelectorAll(".collegamento-cavi, .mainframe");
  elementi.forEach(el => observer.observe(el));
});


document.addEventListener("DOMContentLoaded", () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  }, { threshold: 0.2 });

  const elementi = document.querySelectorAll(".sicurezza");
  elementi.forEach(el => observer.observe(el));
});



// Seleziona tutti i pulsanti
// Seleziona tutti i pulsanti
const pulsanti = document.querySelectorAll('.pulsanti-container a');

// Funzione per controllare se l'elemento è visibile nello schermo
function checkVisibility() {
  const windowHeight = window.innerHeight;
  
  pulsanti.forEach(function(pulsante){
    const rect = pulsante.getBoundingClientRect();
    
    // Se la parte superiore dell'elemento entra nello schermo
    if(rect.top < windowHeight * 0.9){
      pulsante.classList.add('visible');
    }
  });
}

// Controlla al caricamento della pagina
window.addEventListener('load', checkVisibility);

// Controlla quando si scrolla
window.addEventListener('scroll', checkVisibility);

// Seleziono il rettangolo work-process
const rettangoloWork = document.querySelector('.work-process-rectangle');

// Funzione che controlla se il rettangolo è visibile nello schermo
function animaWork() {
  const posizioneRettangolo = rettangoloWork.getBoundingClientRect().top;
  const altezzaFinestra = window.innerHeight;
  
  // Quando la parte superiore del rettangolo entra nello schermo (90%)
  if (posizioneRettangolo < altezzaFinestra * 0.9) {
    rettangoloWork.classList.add('visible');
  }
}

// Controllo al caricamento della pagina
window.addEventListener('load', animaWork);

// Controllo durante lo scroll
window.addEventListener('scroll', animaWork);


document.addEventListener("DOMContentLoaded", () => {
  const elementi = document.querySelectorAll(".contenitore-testo");

  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3 // attiva quando il 30% è visibile
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // opzionale: disattiva dopo l’attivazione
      }
    });
  }, options);

  elementi.forEach(el => observer.observe(el));
});



// Seleziona tutti i wrapper dei servizi
const serviziItems = document.querySelectorAll('.servizi-item');

function animateServizi() {
  serviziItems.forEach(item => {
    const topItem = item.getBoundingClientRect().top;
    const trigger = window.innerHeight * 0.9; // punto in cui scatta l'animazione

    if (topItem < trigger) {
      item.classList.add('show');
    }
  });
}

// Eventi scroll e load
window.addEventListener('scroll', animateServizi);
window.addEventListener('load', animateServizi);


// Seleziona tutti i blocchi animabili
const blocchiAnimati = document.querySelectorAll('.anim-right, .anim-left');

function animateOnScroll() {
  blocchiAnimati.forEach(blocco => {
    const topBlocco = blocco.getBoundingClientRect().top;
    const triggerPoint = window.innerHeight * 0.9; // punto in cui scatta l'animazione

    if (topBlocco < triggerPoint) {
      blocco.classList.add('visible');
    }
  });
}

// Aggiungi eventi scroll e load
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);



document.addEventListener("DOMContentLoaded", () => {
  const elemento = document.querySelector(".work-process-");

  if (!elemento) return;

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // opzionale: disattiva dopo l’attivazione
      }
    });
  }, {
    root: null,
    rootMargin: "0px",
    threshold: 0.3 // attiva quando il 30% è visibile
  });

  observer.observe(elemento);
});
