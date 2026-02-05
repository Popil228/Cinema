namespace CinemaProject.Server.Interfaces
{
    public interface ITmdbImportService
    {
        Task<ImportResult> SyncGenresAsync();
        Task<ImportResult> ImportMovieByIdAsync(int tmdbId);
        Task<ImportResult> ImportMoviesBySearchAsync(string query, int maxResults = 10);
        Task<ImportResult> ImportMarvelDcMinecraftMoviesAsync();
    }

    public class ImportResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public int ImportedCount { get; set; }
        public int SkippedCount { get; set; }
        public int FailedCount { get; set; }
        public List<string> Details { get; set; } = new();
    }
}
