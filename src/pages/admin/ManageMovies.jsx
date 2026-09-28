import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2, ImagePlus } from "lucide-react";

import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../../services/movieApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  duration: "",
  release_date: "",
  rating: "",
};

export default function ManageMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingMovie, setEditingMovie] = useState(null);
  const [movieToDelete, setMovieToDelete] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [poster, setPoster] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);

  const [error, setError] = useState("");

  // --------------------------------------------------
  // LOAD MOVIES
  // --------------------------------------------------

  async function loadMovies() {
    try {
      setLoading(true);
      setError("");

      const data = await getMovies();

      setMovies(
        Array.isArray(data)
          ? data
          : data.results || []
      );
    } catch (err) {
      setError(err.message || "Failed to load movies.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMovies();
  }, []);

  // --------------------------------------------------
  // FORM HANDLING
  // --------------------------------------------------

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setPoster(null);
    setPosterPreview(null);
    setEditingMovie(null);
  }

  function openAddDialog() {
    resetForm();
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(movie) {
    setEditingMovie(movie);

    setForm({
      title: movie.title || "",
      description: movie.description || "",
      genre: movie.genre || "",
      duration: movie.duration || "",
      release_date: movie.release_date || "",
      rating: movie.rating || "",
    });

    setPoster(null);

    if (movie.poster) {
      setPosterPreview(
        movie.poster.startsWith("http")
          ? movie.poster
          : `${import.meta.env.VITE_API_URL}${movie.poster}`
      );
    } else {
      setPosterPreview(null);
    }

    setError("");
    setDialogOpen(true);
  }

  // --------------------------------------------------
  // POSTER HANDLING
  // --------------------------------------------------

  function handlePosterChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Basic validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Poster image must be smaller than 5MB.");
      return;
    }

    setError("");
    setPoster(file);

    const previewUrl = URL.createObjectURL(file);
    setPosterPreview(previewUrl);
  }

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const movieData = {
        title: form.title.trim(),
        description: form.description.trim(),
        genre: form.genre.trim(),
        duration: Number(form.duration),
        release_date: form.release_date,
        rating: Number(form.rating),
      };

      // Only add poster when a new image has been selected.
      if (poster) {
        movieData.poster = poster;
      }

      if (editingMovie) {
        await updateMovie(
          editingMovie.id,
          movieData
        );
      } else {
        await createMovie(movieData);
      }

      setDialogOpen(false);
      resetForm();

      await loadMovies();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save movie."
      );
    } finally {
      setSaving(false);
    }
  }

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  function openDeleteDialog(movie) {
    setMovieToDelete(movie);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!movieToDelete) {
      return;
    }

    try {
      setError("");

      await deleteMovie(movieToDelete.id);

      setDeleteOpen(false);
      setMovieToDelete(null);

      await loadMovies();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete movie."
      );
    }
  }

  // --------------------------------------------------
  // SEARCH
  // --------------------------------------------------

  const filteredMovies = movies.filter((movie) => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return true;
    }

    return (
      movie.title?.toLowerCase().includes(query) ||
      movie.genre?.toLowerCase().includes(query) ||
      movie.description
        ?.toLowerCase()
        .includes(query)
    );
  });

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold sm:text-3xl">
              Manage Movies
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Add, edit, and manage movies in CineMitra.
            </p>
          </div>

          <Button
            onClick={openAddDialog}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Movie
          </Button>
        </div>

        {/* ERROR */}
        {error && !dialogOpen && (
          <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* SEARCH */}
        <Card className="border-white/10 bg-slate-900">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

              <Input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search movies..."
                className="border-white/10 bg-slate-950 pl-10 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* MOVIE TABLE */}
        <Card className="border-white/10 bg-slate-900">
          <CardHeader>
            <CardTitle className="text-white">
              Movies
              <span className="ml-2 text-sm font-normal text-slate-500">
                ({filteredMovies.length})
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-slate-400">
                Loading movies...
              </div>
            ) : filteredMovies.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                No movies found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-white/10 text-left text-sm text-slate-400">
                      <th className="px-6 py-4">
                        Movie
                      </th>

                      <th className="px-6 py-4">
                        Genre
                      </th>

                      <th className="px-6 py-4">
                        Duration
                      </th>

                      <th className="px-6 py-4">
                        Release Date
                      </th>

                      <th className="px-6 py-4">
                        Rating
                      </th>

                      <th className="px-6 py-4 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredMovies.map((movie) => {
                      const posterUrl = movie.poster
                        ? movie.poster.startsWith("http")
                          ? movie.poster
                          : `${import.meta.env.VITE_API_URL}${movie.poster}`
                        : null;

                      return (
                        <tr
                          key={movie.id}
                          className="border-b border-white/5 last:border-0 hover:bg-white/[0.02]"
                        >
                          {/* MOVIE */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              {posterUrl ? (
                                <img
                                  src={posterUrl}
                                  alt={movie.title}
                                  className="h-16 w-12 rounded-md object-cover"
                                />
                              ) : (
                                <div className="flex h-16 w-12 items-center justify-center rounded-md bg-slate-800">
                                  <ImagePlus className="h-5 w-5 text-slate-600" />
                                </div>
                              )}

                              <div>
                                <p className="font-medium text-white">
                                  {movie.title}
                                </p>

                                <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                                  {movie.description}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* GENRE */}
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className="border-white/10 text-slate-300"
                            >
                              {movie.genre}
                            </Badge>
                          </td>

                          {/* DURATION */}
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {movie.duration} min
                          </td>

                          {/* RELEASE DATE */}
                          <td className="px-6 py-4 text-sm text-slate-300">
                            {movie.release_date}
                          </td>

                          {/* RATING */}
                          <td className="px-6 py-4">
                            <span className="font-medium text-yellow-400">
                              ★ {movie.rating}
                            </span>
                          </td>

                          {/* ACTIONS */}
                          <td className="px-6 py-4">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openEditDialog(movie)
                                }
                                className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  openDeleteDialog(movie)
                                }
                                className="border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ADD / EDIT DIALOG */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);

            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogContent className="max-h-[90vh] overflow-y-auto border-white/10 bg-slate-900 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingMovie
                  ? "Edit Movie"
                  : "Add Movie"}
              </DialogTitle>

              <DialogDescription className="text-slate-400">
                {editingMovie
                  ? "Update the movie information and poster."
                  : "Add a new movie to CineMitra."}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* DIALOG ERROR */}
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              {/* POSTER */}
              <div className="space-y-3">
                <Label>
                  Movie Poster
                </Label>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  {/* PREVIEW */}
                  <div className="flex h-48 w-36 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-white/20 bg-slate-950">
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="Poster preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-600">
                        <ImagePlus className="h-8 w-8" />
                        <span className="text-xs">
                          No poster
                        </span>
                      </div>
                    )}
                  </div>

                  {/* FILE INPUT */}
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handlePosterChange}
                      className="cursor-pointer border-white/10 bg-slate-950 text-slate-300 file:mr-4 file:border-0 file:bg-slate-800 file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-slate-700"
                    />

                    <p className="mt-2 text-xs text-slate-500">
                      JPG, JPEG, PNG, or WebP. Maximum 5MB.
                    </p>

                    {editingMovie &&
                      !poster &&
                      editingMovie.poster && (
                        <p className="mt-2 text-xs text-slate-400">
                          Current poster will be kept unless
                          you select a new image.
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* TITLE */}
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title
                </Label>

                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter movie title"
                  required
                  className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  Description
                </Label>

                <Textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Enter movie description"
                  rows={4}
                  required
                  className="resize-none border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                />
              </div>

              {/* GENRE */}
              <div className="space-y-2">
                <Label htmlFor="genre">
                  Genre
                </Label>

                <Input
                  id="genre"
                  name="genre"
                  value={form.genre}
                  onChange={handleChange}
                  placeholder="e.g. Action, Drama"
                  required
                  className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                />
              </div>

              {/* DURATION + RATING */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="duration">
                    Duration (minutes)
                  </Label>

                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="1"
                    value={form.duration}
                    onChange={handleChange}
                    placeholder="e.g. 120"
                    required
                    className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rating">
                    Rating
                  </Label>

                  <Input
                    id="rating"
                    name="rating"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={form.rating}
                    onChange={handleChange}
                    placeholder="e.g. 8.5"
                    required
                    className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* RELEASE DATE */}
              <div className="space-y-2">
                <Label htmlFor="release_date">
                  Release Date
                </Label>

                <Input
                  id="release_date"
                  name="release_date"
                  type="date"
                  value={form.release_date}
                  onChange={handleChange}
                  required
                  className="border-white/10 bg-slate-950 text-white"
                />
              </div>

              {/* FOOTER */}
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                  className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {saving
                    ? "Saving..."
                    : editingMovie
                      ? "Update Movie"
                      : "Add Movie"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE CONFIRMATION */}
        <AlertDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        >
          <AlertDialogContent className="border-white/10 bg-slate-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Movie?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  {movieToDelete?.title}
                </span>
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
              <AlertDialogCancel className="border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white">
                Cancel
              </AlertDialogCancel>

              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}