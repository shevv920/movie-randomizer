import Swiper, { Manipulation } from 'swiper';
import 'swiper/css';

import './index.css';

window.addEventListener('DOMContentLoaded', main);
let links           = [];
let movies          = [];
let rollTimeSeconds = 3;
let isRolling       = false;
let swipeInterval   = null;
let randomMovie     = null;


const fetchFilm = async (id) => {
  const apiKey = localStorage.getItem('apiKey');
  if (!apiKey) return;
  const res = await fetch(`https://kinopoiskapiunofficial.tech/api/v2.2/films/${id}`, {
    method : 'GET',
    headers: {
      'X-API-KEY'   : apiKey,
      'Content-Type': 'application/json',
    },
  });

  const json = await res.json();

  return json;
};

const extractId = (link) => {
  const regex = /https:\/\/www.kinopoisk.ru\/[a-z]*\/(\d+)*\/?/;

  return link.trim().match(regex)?.[1];
};

const createSlideElementFromMovie = (movie) => {
  const root = document.createElement('div');
  root.classList.add('swiper-slide');
  root.setAttribute('kinopoiskId', movie.kinopoiskId);
  const img  = document.createElement('img');
  img.src    = movie.posterUrlPreview;
  img.width  = 220;
  img.height = 320;
  root.append(img);
  return root;
};

function main() {

  const swiper = new Swiper('.swiper', {
    modules             : [Manipulation],
    direction           : 'horizontal',
    loop                : true,
    centeredSlides      : true,
    loopAdditionalSlides: 0,
    slidesPerView       : 3,
    autoplay            : {
      delay               : 100,
      disableOnInteraction: false,
      waitForTransition   : false,
    }
  });

  const settingsIcon  = document.querySelector('#settings-icon');
  const settingsModal = document.querySelector('.settings-modal-wrapper');
  const saveButton    = document.querySelector('#save-button');
  const resetButton   = document.querySelector('#reset-button');
  const inputsWrapper = document.querySelector('.inputs-wrapper');
  const rollButton    = document.querySelector('.roll-button');
  const apiKeyInput   = document.querySelector('#api-key-input');

  settingsIcon.addEventListener('click', () => {
    if (isRolling) {
      clearInterval(swipeInterval);
    }
    settingsModal.classList.toggle('display-none');
  });

  settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
      settingsModal.classList.toggle('display-none');
    }
  });

  saveButton.addEventListener('click', async () => {
    const key = apiKeyInput.value;
    localStorage.setItem('apiKey', key);
    const inputs = inputsWrapper.querySelectorAll('input');
    links        = [...inputs].map((input) => input.value);
    settingsModal.classList.toggle('display-none');
    const linksFetches = links.filter(l => !!l?.trim()).map(link => fetchFilm(extractId(link)));
    movies             = await Promise.all(linksFetches);
    const elems        = movies.map(createSlideElementFromMovie);

    swiper.addSlide(0, elems);
  });

  resetButton.addEventListener('click', () => {
    const inputs = inputsWrapper.querySelectorAll('input[type="text"]');
    inputs.forEach(input => input.value = '');
    links = [];
    swiper.removeAllSlides();
  });

  const hideShownMovie = () => document.querySelector('#movie-description-wrapper').classList.add('display-none');

  const setShownMovie = (movie) => {
    const movieTextElem = document.querySelector('#movie-title');
    const movieYearElem = document.querySelector('#movie-year');
    const movieSloganElem = document.querySelector('#movie-slogan');

    movieTextElem.textContent = movie.nameRu || 'Unknown';
    movieYearElem.textContent = movie.year || 'Unknown';
    movieSloganElem.textContent = movie.slogan || 'Unknown';
  };

  const onRollEnd = () => {
    if (!isRolling) return;
    const movieWrapper = document.querySelector('#movie-description-wrapper');
    movieWrapper.classList.remove('display-none');
    clearInterval(swipeInterval);
    const indexToSlide = movies.findIndex((m) => m.kinopoiskId === randomMovie.kinopoiskId);
    swiper.slideTo(indexToSlide, 1000);
    setTimeout(() => setShownMovie(randomMovie), 1000);

    isRolling = false;
  };

  const startRoll = () => {
    if (isRolling) return;
    if (!movies.length) return;
    isRolling = true;
    hideShownMovie();
    clearInterval(swipeInterval);
    randomMovie = movies.slice().sort(() => 0.5 - Math.random())[0];
    swipeInterval = setInterval(() => {
      swiper.slideNext(100, false);
    }, 20);
    setTimeout(onRollEnd, (rollTimeSeconds - 1) * 1000);
  };

  rollButton.addEventListener('click', startRoll);
}