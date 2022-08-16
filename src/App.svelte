<script>
  import Carousel from 'svelte-carousel';
  import { apiKey, rollTime } from './stores.js';
  import { clickOutside } from './clickOutside';

  let movies       = [];
  let autoplay     = false;
  let currentIndex = 1;
  let isRolling    = false;
  let movieLinks   = new Array(7).fill('');

  let settingsModalOpen = false;


  function handleRollClick() {
    if (autoplay || isRolling || !movies.length) return;

    autoplay  = true;
    isRolling = true;

    setTimeout(() => {
      isRolling = false;
      autoplay  = false;
    }, $rollTime * 1000);

  }

  function handleSettingsClick() {
    settingsModalOpen = true;
  }

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

    return await res.json();
  };

  const extractId = (link) => {
    const regex = /https:\/\/www.kinopoisk.ru\/[a-z]*\/(\d+)*\/?/;

    return link.trim().match(regex)?.[1];
  };

  const handleSaveButtonClick = async () => {
    const linksFetches = movieLinks
      .filter(l => !!l?.trim())
      .map(link => fetchFilm(extractId(link)));

    const fetchedMovies = await Promise.all(linksFetches);
    movies = [];
    setTimeout(() => {
      movies = [...fetchedMovies.sort(() => 0.5 - Math.random())];
      settingsModalOpen = false;
    }, 500);
  };

  const handleResetClick = () => {
    $rollTime = 15;
    movieLinks = movieLinks.map(() => '');
  };
</script>

<main>
  <div class="wrapper">
    <div id="settings-icon" on:click={handleSettingsClick}>
      <svg width="20" height="20" viewBox="0 0 20 20" fill="#f66600" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.7 20L7.2 16.85C6.88333 16.7333 6.55 16.575 6.2 16.375C5.85 16.175 5.54167 15.9667 5.275 15.75L2.325 17.1L0 13L2.7 11.025C2.66667 10.875 2.64583 10.7042 2.6375 10.5125C2.62917 10.3208 2.625 10.15 2.625 10C2.625 9.85 2.62917 9.67917 2.6375 9.4875C2.64583 9.29583 2.66667 9.125 2.7 8.975L0 7L2.325 2.9L5.275 4.25C5.54167 4.03333 5.85 3.825 6.2 3.625C6.55 3.425 6.88333 3.275 7.2 3.175L7.7 0H12.3L12.8 3.15C13.1167 3.26667 13.4542 3.42083 13.8125 3.6125C14.1708 3.80417 14.475 4.01667 14.725 4.25L17.675 2.9L20 7L17.3 8.925C17.3333 9.09167 17.3542 9.27083 17.3625 9.4625C17.3708 9.65417 17.375 9.83333 17.375 10C17.375 10.1667 17.3708 10.3417 17.3625 10.525C17.3542 10.7083 17.3333 10.8833 17.3 11.05L20 13L17.675 17.1L14.725 15.75C14.4583 15.9667 14.1542 16.1792 13.8125 16.3875C13.4708 16.5958 13.1333 16.75 12.8 16.85L12.3 20H7.7ZM10 13.25C10.9 13.25 11.6667 12.9333 12.3 12.3C12.9333 11.6667 13.25 10.9 13.25 10C13.25 9.1 12.9333 8.33333 12.3 7.7C11.6667 7.06667 10.9 6.75 10 6.75C9.1 6.75 8.33333 7.06667 7.7 7.7C7.06667 8.33333 6.75 9.1 6.75 10C6.75 10.9 7.06667 11.6667 7.7 12.3C8.33333 12.9333 9.1 13.25 10 13.25ZM10 11.75C9.51667 11.75 9.10417 11.5792 8.7625 11.2375C8.42083 10.8958 8.25 10.4833 8.25 10C8.25 9.51667 8.42083 9.10417 8.7625 8.7625C9.10417 8.42083 9.51667 8.25 10 8.25C10.4833 8.25 10.8958 8.42083 11.2375 8.7625C11.5792 9.10417 11.75 9.51667 11.75 10C11.75 10.4833 11.5792 10.8958 11.2375 11.2375C10.8958 11.5792 10.4833 11.75 10 11.75ZM8.9 18.5H11.1L11.45 15.7C12 15.5667 12.5208 15.3583 13.0125 15.075C13.5042 14.7917 13.95 14.45 14.35 14.05L17 15.2L18 13.4L15.65 11.675C15.7167 11.3917 15.7708 11.1125 15.8125 10.8375C15.8542 10.5625 15.875 10.2833 15.875 10C15.875 9.71667 15.8583 9.4375 15.825 9.1625C15.7917 8.8875 15.7333 8.60833 15.65 8.325L18 6.6L17 4.8L14.35 5.95C13.9667 5.51667 13.5333 5.15417 13.05 4.8625C12.5667 4.57083 12.0333 4.38333 11.45 4.3L11.1 1.5H8.9L8.55 4.3C7.98333 4.41667 7.45417 4.61667 6.9625 4.9C6.47083 5.18333 6.03333 5.53333 5.65 5.95L3 4.8L2 6.6L4.35 8.325C4.28333 8.60833 4.22917 8.8875 4.1875 9.1625C4.14583 9.4375 4.125 9.71667 4.125 10C4.125 10.2833 4.14583 10.5625 4.1875 10.8375C4.22917 11.1125 4.28333 11.3917 4.35 11.675L2 13.4L3 15.2L5.65 14.05C6.05 14.45 6.49583 14.7917 6.9875 15.075C7.47917 15.3583 8 15.5667 8.55 15.7L8.9 18.5Z"
              fill="#F66600"/>
      </svg>
    </div>
  </div>
  <div class="swiper">
    <div class="slides-wrapper">
      {#if movies.length}
        <Carousel
                particlesToShow={3}
                autoplayDuration={0}
                duration={125}
                autoplay={autoplay}
                timingFunction="linear"
                dots={false}
                arrows={false}
                swiping={true}
                on:pageChange={event => currentIndex = (1 + event.detail) % movies.length}
        >
          {#each (movies) as movie, index (movie?.kinopoiskId)}
            <div class="swiper-slide">
              {#if movie?.posterUrlPreview}
                <img src={movie?.posterUrlPreview} width="220" height="320" alt="{movie?.posterUrlPreview}">
              {:else}
                <svg width="220" height="320" viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="220" height="320" fill="#1F1F1F"/>
                  <path fill-rule="evenodd" clip-rule="evenodd"
                        d="M110.41 187.092C103.515 187.092 98 183.634 98 177.397C98 171.159 103.515 167.702 110.41 167.702C117.305 167.702 122.82 171.161 122.82 177.396C122.82 183.634 117.305 187.092 110.41 187.092ZM119.378 177.397C119.378 174.971 115.24 173.939 110.419 173.939C105.596 173.939 101.461 174.98 101.461 177.397C101.461 179.815 105.597 180.855 110.419 180.855C115.24 180.864 119.378 179.823 119.378 177.397ZM98.3512 251.501L104.903 251.501L104.903 251.157L98.3512 246.658L98.3512 240.429L105.931 248.739L106.274 248.395L98.343 233.159L103.858 233.159L108.681 246.666L109.022 246.666L107.819 233.159L112.992 233.159L111.789 246.666L112.132 246.666L116.953 233.159L122.469 233.159L114.538 248.395L114.881 248.739L122.46 240.429L122.46 246.658L115.909 251.157L115.909 251.501L122.46 251.501L122.46 256L98.3348 256L98.3348 251.501L98.3512 251.501ZM98.3512 228.988L98.3512 223.102L112.825 223.447L112.825 223.102L98.3512 216.178L98.3512 210.982L122.478 210.982L122.478 216.866L108.003 216.522L108.003 216.866L122.479 223.793L122.479 228.989L98.3512 228.989L98.3512 228.988ZM98.3512 200.943L98.3512 206.827L122.478 206.827L122.478 200.943L111.789 200.943L111.789 196.1L122.478 196.1L122.478 190.215L98.3512 190.215L98.3512 196.1L107.661 196.1L107.661 200.943L98.3512 200.943ZM98.3512 147.967L98.3512 164.58L122.478 164.58L122.478 158.695L102.487 158.695L102.487 153.851L122.478 153.851L122.478 147.967L98.3512 147.967ZM110.41 144.853C103.515 144.853 98 141.395 98 135.157C98 128.929 103.515 125.462 110.41 125.462C117.305 125.462 122.82 128.921 122.82 135.157C122.82 141.385 117.305 144.853 110.41 144.853ZM119.378 135.157C119.378 132.731 115.24 131.699 110.419 131.699C105.596 131.699 101.461 132.74 101.461 135.157C101.461 137.583 105.597 138.615 110.419 138.615C115.24 138.615 119.378 137.583 119.378 135.157ZM98.3512 116.464L98.3512 122.348L122.478 122.348L122.478 117.152L108.003 110.226L108.003 109.882L122.478 110.226L122.478 104.342L98.3512 104.342L98.3512 109.538L112.825 116.464L112.825 116.808L98.3512 116.464ZM114.204 88.754L114.889 83.2141C119.712 84.2548 122.82 86.6724 122.82 91.8353C122.82 98.0636 117.305 101.22 110.41 101.22C103.515 101.22 98 98.0718 98 91.8353C98 86.7813 101.101 84.2548 105.58 83.2141L106.958 88.754C104.543 89.0981 101.444 90.1062 101.444 91.8353C101.444 93.9087 105.58 94.9834 110.402 94.9834C115.19 94.9834 119.36 93.9087 119.36 91.8353C119.378 90.1389 116.619 89.1075 114.204 88.754ZM98.3524 74.9042L98.3524 80.4441L122.478 80.4441L122.478 74.9042L111.789 74.9042L111.789 74.56L122.478 70.4051L122.478 64L110.068 70.0609L98.3512 64.1768L98.3512 70.0609L109.04 74.56L109.04 74.9042L98.3512 74.9042L98.3524 74.9042Z"
                        fill="white"/>
                </svg>
              {/if}
            </div>
          {/each}
        </Carousel>
      {:else}
        {#each new Array(3).fill(null) as _}
          <div class="swiper-slide">
            <svg width="220" height="320" viewBox="0 0 220 320" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="220" height="320" fill="#1F1F1F"/>
              <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M110.41 187.092C103.515 187.092 98 183.634 98 177.397C98 171.159 103.515 167.702 110.41 167.702C117.305 167.702 122.82 171.161 122.82 177.396C122.82 183.634 117.305 187.092 110.41 187.092ZM119.378 177.397C119.378 174.971 115.24 173.939 110.419 173.939C105.596 173.939 101.461 174.98 101.461 177.397C101.461 179.815 105.597 180.855 110.419 180.855C115.24 180.864 119.378 179.823 119.378 177.397ZM98.3512 251.501L104.903 251.501L104.903 251.157L98.3512 246.658L98.3512 240.429L105.931 248.739L106.274 248.395L98.343 233.159L103.858 233.159L108.681 246.666L109.022 246.666L107.819 233.159L112.992 233.159L111.789 246.666L112.132 246.666L116.953 233.159L122.469 233.159L114.538 248.395L114.881 248.739L122.46 240.429L122.46 246.658L115.909 251.157L115.909 251.501L122.46 251.501L122.46 256L98.3348 256L98.3348 251.501L98.3512 251.501ZM98.3512 228.988L98.3512 223.102L112.825 223.447L112.825 223.102L98.3512 216.178L98.3512 210.982L122.478 210.982L122.478 216.866L108.003 216.522L108.003 216.866L122.479 223.793L122.479 228.989L98.3512 228.989L98.3512 228.988ZM98.3512 200.943L98.3512 206.827L122.478 206.827L122.478 200.943L111.789 200.943L111.789 196.1L122.478 196.1L122.478 190.215L98.3512 190.215L98.3512 196.1L107.661 196.1L107.661 200.943L98.3512 200.943ZM98.3512 147.967L98.3512 164.58L122.478 164.58L122.478 158.695L102.487 158.695L102.487 153.851L122.478 153.851L122.478 147.967L98.3512 147.967ZM110.41 144.853C103.515 144.853 98 141.395 98 135.157C98 128.929 103.515 125.462 110.41 125.462C117.305 125.462 122.82 128.921 122.82 135.157C122.82 141.385 117.305 144.853 110.41 144.853ZM119.378 135.157C119.378 132.731 115.24 131.699 110.419 131.699C105.596 131.699 101.461 132.74 101.461 135.157C101.461 137.583 105.597 138.615 110.419 138.615C115.24 138.615 119.378 137.583 119.378 135.157ZM98.3512 116.464L98.3512 122.348L122.478 122.348L122.478 117.152L108.003 110.226L108.003 109.882L122.478 110.226L122.478 104.342L98.3512 104.342L98.3512 109.538L112.825 116.464L112.825 116.808L98.3512 116.464ZM114.204 88.754L114.889 83.2141C119.712 84.2548 122.82 86.6724 122.82 91.8353C122.82 98.0636 117.305 101.22 110.41 101.22C103.515 101.22 98 98.0718 98 91.8353C98 86.7813 101.101 84.2548 105.58 83.2141L106.958 88.754C104.543 89.0981 101.444 90.1062 101.444 91.8353C101.444 93.9087 105.58 94.9834 110.402 94.9834C115.19 94.9834 119.36 93.9087 119.36 91.8353C119.378 90.1389 116.619 89.1075 114.204 88.754ZM98.3524 74.9042L98.3524 80.4441L122.478 80.4441L122.478 74.9042L111.789 74.9042L111.789 74.56L122.478 70.4051L122.478 64L110.068 70.0609L98.3512 64.1768L98.3512 70.0609L109.04 74.56L109.04 74.9042L98.3512 74.9042L98.3524 74.9042Z"
                    fill="white"/>
            </svg>
          </div>
        {/each}
      {/if}
    </div>
    <div class="top-arrow">
      <svg width="24" height="16" viewBox="0 0 24 16" fill="#ff6600" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 0H0L12 16L24 0Z" fill="#FF6600"/>
      </svg>
    </div>
    <div class="bottom-arrow">
      <svg width="24" height="16" viewBox="0 0 24 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 16L24 16L12 1.04907e-06L0 16Z" fill="#FF6600"/>
      </svg>
    </div>
  </div>
  <div id="roll-button-wrapper">
    <div class="roll-button" on:click={handleRollClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.775 4.80001L12.05 8.52501L11.05 7.52501L13.025 5.55001H12C10.2167 5.55001 8.6875 6.18751 7.4125 7.46251C6.1375 8.73751 5.5 10.2667 5.5 12.05C5.5 12.5333 5.54583 12.9917 5.6375 13.425C5.72917 13.8583 5.84167 14.2667 5.975 14.65L4.9 15.725C4.56667 15.125 4.33333 14.5208 4.2 13.9125C4.06667 13.3042 4 12.6833 4 12.05C4 9.86668 4.7875 7.98751 6.3625 6.41251C7.9375 4.83751 9.81667 4.05001 12 4.05001H13.075L11.075 2.05001L12.05 1.07501L15.775 4.80001ZM8.175 19.275L11.9 15.55L12.875 16.525L10.875 18.525H12C13.7833 18.525 15.3125 17.8875 16.5875 16.6125C17.8625 15.3375 18.5 13.8083 18.5 12.025C18.5 11.5417 18.4583 11.0833 18.375 10.65C18.2917 10.2167 18.1667 9.80835 18 9.42501L19.075 8.35001C19.4083 8.95001 19.6458 9.55418 19.7875 10.1625C19.9292 10.7708 20 11.3917 20 12.025C20 14.2083 19.2125 16.0875 17.6375 17.6625C16.0625 19.2375 14.1833 20.025 12 20.025H10.875L12.875 22.025L11.9 23L8.175 19.275Z"
              fill="#F66600"/>
      </svg>
    </div>
  </div>
  {#if !isRolling && movies[currentIndex] && movies[currentIndex]?.nameRu}
    <div id="movie-description-wrapper">
      <div id="title-title">Название:
        <span class="movie-text">
          {movies[currentIndex]?.nameRu || movies[currentIndex]?.nameEn || movies[currentIndex]?.nameOriginal}
        </span>
      </div>
      <div id="year-title">Год:
        <span class="movie-text">
          {movies[currentIndex]?.year}
        </span>
      </div>
      <div id="slogan-title">Слоган:
        <span class="movie-text">
          {movies[currentIndex]?.slogan}
        </span>
      </div>
    </div>
  {/if}
  {#if settingsModalOpen}
    <div class="settings-modal-wrapper">
      <div class="settings-modal" use:clickOutside on:outclick={() => (settingsModalOpen = false)}>
        <label class="label">
          <span>Roll time:</span>
          <input type="number" bind:value={$rollTime}>
        </label>
        <label class="label">
          <span>Api Key:</span>
          <input type="password" id="api-key-input" bind:value={$apiKey}>
        </label>
        <div class="inputs-wrapper">
          {#each movieLinks as movieLink}
            <input type="text" bind:value={movieLink}>
          {/each}
        </div>
        <button id="save-button" class="button button-primary" type="button" on:click={handleSaveButtonClick}>Save</button>
        <button id="reset-button" class="button button-secondary" type="button" on:click={handleResetClick}>Reset</button>
      </div>
    </div>
  {/if}
</main>


<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }

  .wrapper {
    display: flex;
    flex-direction: column;
  }

  #settings-icon {
    align-self: flex-end;
    margin-right: 16px;
    margin-top: 16px;
    cursor: pointer;
  }

  .swiper {
    display: flex;
    place-content: center;
    position: relative;
    z-index: 10;
  }

  .slides-wrapper {
    display: flex;
    position: relative;
    width: 756px;
    height: 368px;
    border: 4px solid var(--primary);
    background: var(--bg-primary);
    z-index: 100;
    overflow: hidden;
  }

  .swiper-slide {
    background-color: var(--bg-primary);
    padding: 18px 14px;
    z-index: 1;
  }

  .top-arrow {
    position: absolute;
    left: 49%;
    top: 4px;
    z-index: 100;
  }

  .bottom-arrow {
    position: absolute;
    left: 49%;
    bottom: 0;
    z-index: 100;
  }

  .settings-modal-wrapper {
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgb(0, 0, 0);
    background-color: rgba(0, 0, 0, 0.4);
  }

  .settings-modal {
    background-color: var(--bg-primary);
    margin: 1% auto;
    padding: 24px;
    border: 1px solid transparent;
    width: 398px;
    height: 720px;
  }

  .inputs-wrapper {
    margin: 8px 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .label {
    margin: 0 0 12px 0;
    display: flex;
    flex-direction: column;
    color: var(--primary);
    font-family: 'Raleway', serif;
    font-style: normal;
    font-weight: 500;
    font-size: 16px;
    line-height: 19px;
  }

  .button {
    width: 350px;
    height: 48px;
    text-align: center;
    border: none;
    cursor: pointer;
  }

  .button-primary {
    background-color: var(--primary);
    color: var(--fg-primary);
  }

  .button-secondary {
    color: var(--primary);
    background-color: transparent;
  }

  #roll-button-wrapper {
    margin: 32px 0 0 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .roll-button {
    cursor: pointer;
  }

  #movie-description-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    place-content: center;
    color: var(--primary);
  }

  .movie-text {
    color: var(--fg-primary);
    font-weight: bold;
  }
</style>