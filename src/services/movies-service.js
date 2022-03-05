export default class MoviesService {
  moviesApi = 'https://api.themoviedb.org/3/';

  keyApi = '59f69f7f6b264af6fb64cf0bc7b4e4ed';

  guestSession = async () => {
    try {
      const res = await fetch(`${this.moviesApi}authentication/guest_session/new?api_key=${this.keyApi}`);
      if (!res.ok) {
        throw new Error(`Could not fetch guestSession, received ${res.status}`);
      }
      const inText = await res.json();
      this.guestSessionId = inText.guest_session_id;
      return inText.guest_session_id;
    } catch {
      throw new Error();
    }
  };

  getRatedMovies = async (page) => {
    try {
      const res = await fetch(
        `${this.moviesApi}guest_session/${this.guestSessionId}/rated/movies?api_key=${this.keyApi}&page=${page}`,
      );
      if (!res.ok) {
        throw new Error(`Could not fetch guestSession, received ${res.status}`);
      }
      return await res.json();
    } catch {
      throw new Error();
    }
  };

  postRatedMovies = async (movieId, values) => {
    try {
      const res = await fetch(
        `${this.moviesApi}movie/${movieId}/rating?api_key=${this.keyApi}&guest_session_id=${this.guestSessionId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json;charset=utf-8',
          },
          body: JSON.stringify({ value: values }),
        },
      );
      if (!res.ok) {
        throw new Error(`Could not fetch guestSession, received ${res.status}`);
      }
      return await res.json();
    } catch {
      throw new Error();
    }
  };

  getMovie = async (url) => {
    try {
      const res = await fetch(`${this.moviesApi}${url}`);

      if (!res.ok) {
        throw new Error(`Could not fetch ${url} , received ${res.status}`);
      }
      return await res.json();
    } catch {
      throw new Error();
    }
  };

  getSearchMovies(searchValue, page) {
    return this.getMovie(`search/movie?api_key=${this.keyApi}&query=${searchValue}&page=${page}`);
  }
}
