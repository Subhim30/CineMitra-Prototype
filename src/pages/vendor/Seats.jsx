import { useEffect, useMemo, useState } from "react";
import {
  Armchair,
  Edit,
  Loader2,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
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

import { Input } from "@/components/ui/input";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  getVendorHalls,
  getVendorSeats,
  createVendorSeat,
  updateVendorSeat,
  deleteVendorSeat,
} from "@/services/vendorApi";


export default function VendorSeats() {
  const [seats, setSeats] = useState([]);
  const [halls, setHalls] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingSeat, setEditingSeat] = useState(null);
  const [deletingSeat, setDeletingSeat] = useState(null);

  const [form, setForm] = useState({
    hall: "",
    row: "",
    number: "",
    seat_type: "STANDARD",
  });

  const [error, setError] = useState("");


  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [seatsData, hallsData] = await Promise.all([
        getVendorSeats(),
        getVendorHalls(),
      ]);

      setSeats(seatsData);
      setHalls(hallsData);
    } catch (err) {
      setError(
        err.message || "Failed to load seats."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  const filteredSeats = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return seats;
    }

    return seats.filter((seat) =>
      [
        seat.row,
        seat.number,
        seat.hall_name,
        seat.branch_name,
        seat.seat_type,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [seats, search]);


  function openCreateDialog() {
    setEditingSeat(null);

    setForm({
      hall: "",
      row: "",
      number: "",
      seat_type: "STANDARD",
    });

    setError("");
    setDialogOpen(true);
  }


  function openEditDialog(seat) {
    setEditingSeat(seat);

    setForm({
      hall: String(seat.hall),
      row: seat.row || "",
      number: String(seat.number || ""),
      seat_type: seat.seat_type || "STANDARD",
    });

    setError("");
    setDialogOpen(true);
  }


  function closeDialog() {
    if (saving) return;

    setDialogOpen(false);
    setEditingSeat(null);

    setForm({
      hall: "",
      row: "",
      number: "",
      seat_type: "STANDARD",
    });
  }


  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }


  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.hall) {
      setError("Please select a hall.");
      return;
    }

    if (!form.row.trim()) {
      setError("Please enter a seat row.");
      return;
    }

    if (!form.number || Number(form.number) <= 0) {
      setError("Seat number must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        hall: Number(form.hall),
        row: form.row.trim().toUpperCase(),
        number: Number(form.number),
        seat_type: form.seat_type,
      };

      if (editingSeat) {
        const updatedSeat = await updateVendorSeat(
          editingSeat.id,
          payload
        );

        setSeats((previous) =>
          previous.map((seat) =>
            seat.id === editingSeat.id
              ? updatedSeat
              : seat
          )
        );
      } else {
        const newSeat = await createVendorSeat(
          payload
        );

        setSeats((previous) => [
          newSeat,
          ...previous,
        ]);
      }

      closeDialog();
    } catch (err) {
      setError(
        err.message || "Failed to save seat."
      );
    } finally {
      setSaving(false);
    }
  }


  function openDeleteDialog(seat) {
    setDeletingSeat(seat);
    setDeleteDialogOpen(true);
  }


  async function handleDelete() {
    if (!deletingSeat) return;

    try {
      setSaving(true);
      setError("");

      await deleteVendorSeat(
        deletingSeat.id
      );

      setSeats((previous) =>
        previous.filter(
          (seat) =>
            seat.id !== deletingSeat.id
        )
      );

      setDeleteDialogOpen(false);
      setDeletingSeat(null);
    } catch (err) {
      setError(
        err.message || "Failed to delete seat."
      );
    } finally {
      setSaving(false);
    }
  }


  function getSeatTypeLabel(type) {
    switch (type) {
      case "PREMIUM":
        return "Premium";

      case "VIP":
        return "VIP";

      default:
        return "Standard";
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading seats...
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">

      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            My Seats
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage the seats inside your cinema halls.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Seat
        </Button>

      </div>


      {/* ERROR */}
      {error && !dialogOpen && (
        <div className="mb-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}


      {/* SEARCH */}
      <Card className="mb-6 border-white/10 bg-slate-900">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />

            <Input
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search seats, halls or branches..."
              className="border-white/10 bg-slate-950 pl-10 text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>


      {/* SEATS */}
      {filteredSeats.length === 0 ? (
        <Card className="border-white/10 bg-slate-900">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <Armchair className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold">
              No seats found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different search."
                : "Create your first seat to get started."}
            </p>

            {!search && (
              <Button
                onClick={openCreateDialog}
                className="mt-5 bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Seat
              </Button>
            )}

          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {filteredSeats.map((seat) => (
            <Card
              key={seat.id}
              className="border-white/10 bg-slate-900 transition hover:border-white/20"
            >

              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">

                  <div className="flex items-center gap-3">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-500/10">
                      <Armchair className="h-5 w-5 text-red-400" />
                    </div>

                    <div>
                      <CardTitle className="text-xl text-white">
                        {seat.row}
                        {seat.number}
                      </CardTitle>

                      <p className="text-xs text-slate-500">
                        Seat #{seat.id}
                      </p>
                    </div>

                  </div>

                  <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300">
                    {getSeatTypeLabel(
                      seat.seat_type
                    )}
                  </span>

                </div>
              </CardHeader>


              <CardContent>

                <div className="space-y-2 text-sm">

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Hall
                    </span>

                    <span className="max-w-[150px] truncate font-medium text-white">
                      {seat.hall_name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">
                      Branch
                    </span>

                    <span className="max-w-[150px] truncate text-slate-300">
                      {seat.branch_name}
                    </span>
                  </div>

                </div>


                <div className="mt-5 flex gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      openEditDialog(seat)
                    }
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      openDeleteDialog(seat)
                    }
                    className="border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                </div>

              </CardContent>
            </Card>
          ))}

        </div>
      )}


      {/* ADD / EDIT DIALOG */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!saving) {
            setDialogOpen(open);
          }
        }}
      >
        <DialogContent className="border-white/10 bg-slate-900 text-white sm:max-w-lg">

          <DialogHeader>
            <DialogTitle>
              {editingSeat
                ? "Edit Seat"
                : "Add Seat"}
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              {editingSeat
                ? "Update the seat information."
                : "Create a new seat inside one of your halls."}
            </DialogDescription>
          </DialogHeader>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* HALL */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hall
              </label>

              <Select
                value={form.hall}
                onValueChange={(value) =>
                  setForm((previous) => ({
                    ...previous,
                    hall: value,
                  }))
                }
              >
                <SelectTrigger className="border-white/10 bg-slate-950 text-white">
                  <SelectValue placeholder="Select a hall" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-white">

                  {halls.map((hall) => (
                    <SelectItem
                      key={hall.id}
                      value={String(hall.id)}
                    >
                      {hall.name} — {hall.branch_name}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>


            {/* ROW */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Row
              </label>

              <Input
                name="row"
                value={form.row}
                onChange={handleChange}
                maxLength={5}
                placeholder="e.g. A"
                className="border-white/10 bg-slate-950 uppercase text-white placeholder:text-slate-500"
              />
            </div>


            {/* NUMBER */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seat Number
              </label>

              <Input
                name="number"
                type="number"
                min="1"
                value={form.number}
                onChange={handleChange}
                placeholder="e.g. 1"
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>


            {/* SEAT TYPE */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seat Type
              </label>

              <Select
                value={form.seat_type}
                onValueChange={(value) =>
                  setForm((previous) => ({
                    ...previous,
                    seat_type: value,
                  }))
                }
              >
                <SelectTrigger className="border-white/10 bg-slate-950 text-white">
                  <SelectValue />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-white">

                  <SelectItem value="STANDARD">
                    Standard
                  </SelectItem>

                  <SelectItem value="PREMIUM">
                    Premium
                  </SelectItem>

                  <SelectItem value="VIP">
                    VIP
                  </SelectItem>

                </SelectContent>
              </Select>
            </div>


            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </div>
            )}


            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
                disabled={saving}
                className="border-white/10 bg-transparent text-white hover:bg-white/5"
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving || halls.length === 0}
                className="bg-red-600 hover:bg-red-700"
              >
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {editingSeat
                  ? "Update Seat"
                  : "Create Seat"}
              </Button>

            </DialogFooter>

          </form>

        </DialogContent>
      </Dialog>


      {/* DELETE DIALOG */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!saving) {
            setDeleteDialogOpen(open);
          }
        }}
      >
        <AlertDialogContent className="border-white/10 bg-slate-900 text-white">

          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete seat{" "}
              {deletingSeat &&
                `${deletingSeat.row}${deletingSeat.number}`}?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-400">
              This will permanently delete this seat.
              If this seat is already associated with
              shows or bookings, the deletion may be
              restricted by your database relationships.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>

            <AlertDialogCancel
              disabled={saving}
              className="border-white/10 bg-transparent text-white hover:bg-white/5"
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={saving}
              className="bg-red-600 hover:bg-red-700"
            >
              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              Delete
            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>
      </AlertDialog>

    </div>
  );
}
