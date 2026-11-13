/**
 * Fehler, die bewusst an den Client gehen. Alles andere wird als 500 ohne Details beantwortet,
 * damit keine internen Infos (SQL, Pfade, Stacktraces) nach außen gelangen.
 */
export class AppError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export const notFound = (what = 'Nicht gefunden') => new AppError(404, 'not_found', what);
export const forbidden = (msg = 'Keine Berechtigung') => new AppError(403, 'forbidden', msg);
export const badRequest = (msg: string) => new AppError(400, 'bad_request', msg);
