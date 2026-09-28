import { useEffect, useState } from "react";
import { createMovie, updateMovie } from "../../services/movieApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const emptyForm = {
  title: "",
  description: "",
  genre: "",
  duration: "",
  release_date: "",
  rating: "",
};

export default function MovieForm({ movieToEdit, onMovieSaved }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  useEffect(() => {
    if (movieToEdit) {
      setFormData({
        title: movieToEdit.title,
        description: movieToEdit.description,
        genre: movieToEdit.genre,
        duration: movieToEdit.duration,
        release_date: movieToEdit.release_date,
        rating: movieToEdit.rating,
      });
    } else {
      setFormData(emptyForm);
    }
  }, [movieToEdit]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      const movieData = {
        ...formData,
        duration: Number(formData.duration),
        rating: Number(formData.rating),
      };

      let savedMovie;

      if (movieToEdit) {
        savedMovie = await updateMovie(movieToEdit.id, movieData);
      } else {
        savedMovie = await createMovie(movieData);
      }

      onMovieSaved(savedMovie);
      setFormData(emptyForm);
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <Card className="border-white/10 bg-slate-900/80 text-white shadow-xl">
      <CardHeader>
        <CardTitle className="text-xl">
          {movieToEdit ? "Edit Movie" : "Add New Movie"}
        </CardTitle>

        <p className="text-sm text-slate-400">
          {movieToEdit
            ? "Update the movie information below."
            : "Add a new movie to your CineMitra collection."}
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-slate-200">
              Movie Title
            </Label>

            <Input
              id="title"
              name="title"
              placeholder="Enter movie title"
              value={formData.title}
              onChange={handleChange}
              className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-200">
              Description
            </Label>

            <Textarea
              id="description"
              name="description"
              placeholder="Enter movie description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-28 border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Genre */}
          <div className="space-y-2">
            <Label htmlFor="genre" className="text-slate-200">
              Genre
            </Label>

            <Input
              id="genre"
              name="genre"
              placeholder="e.g. Action, Comedy, Drama"
              value={formData.genre}
              onChange={handleChange}
              className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              required
            />
          </div>

          {/* Duration + Rating */}
          <div className="grid gap-5 sm:grid-cols-2">

            <div className="space-y-2">
              <Label htmlFor="duration" className="text-slate-200">
                Duration
              </Label>

              <Input
                id="duration"
                type="number"
                name="duration"
                placeholder="Minutes"
                value={formData.duration}
                onChange={handleChange}
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                min="1"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating" className="text-slate-200">
                Rating
              </Label>

              <Input
                id="rating"
                type="number"
                name="rating"
                placeholder="0 - 10"
                min="0"
                max="10"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
                required
              />
            </div>

          </div>

          {/* Release Date */}
          <div className="space-y-2">
            <Label htmlFor="release_date" className="text-slate-200">
              Release Date
            </Label>

            <Input
              id="release_date"
              type="date"
              name="release_date"
              value={formData.release_date}
              onChange={handleChange}
              className="border-white/10 bg-slate-950 text-white"
              required
            />
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-md border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full bg-red-600 text-white hover:bg-red-700"
          >
            {movieToEdit ? "Update Movie" : "Add Movie"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}