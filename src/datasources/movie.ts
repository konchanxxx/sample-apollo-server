import { RESTDataSource, AugmentedRequest } from '@apollo/datasource-rest';
import type { KeyValueCache } from '@apollo/utils.keyvaluecache';

class Movie {
  id: string;
  title: string;
  year: number;
}

export class MoviesAPI extends RESTDataSource {
  override baseURL = 'https://movies-api.example.com/';
  private token: string;

  constructor(options: { token: string; cache: KeyValueCache }) {
    super(options);
    this.token = options.token;
  }

  override willSendRequest(path: string, request: AugmentedRequest) {
    request.headers.authorization = this.token;
  }

  async getMovie(id: string): Promise<Movie> {
    return this.get<Movie>(`movies/${encodeURIComponent(id)}`);
  }

  async updateMovie(movie: Movie): Promise<Movie> {
    return this.patch(
      'movies',
      { body: { id: movie.id, movie } }
    )
  }
}
