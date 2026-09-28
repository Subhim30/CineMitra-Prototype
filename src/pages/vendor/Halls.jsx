import { useEffect, useMemo, useState } from "react";
import {
  Building2,
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
  getVendorBranches,
} from "@/services/vendorApi";

import {
  getVendorHalls,
  createVendorHall,
  updateVendorHall,
  deleteVendorHall,
} from "@/services/vendorApi";


export default function VendorHalls() {
  const [halls, setHalls] = useState([]);
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [editingHall, setEditingHall] = useState(null);
  const [deletingHall, setDeletingHall] = useState(null);

  const [form, setForm] = useState({
    branch: "",
    name: "",
    capacity: "",
  });

  const [error, setError] = useState("");


  async function loadData() {
    try {
      setLoading(true);
      setError("");

      const [hallsData, branchesData] = await Promise.all([
        getVendorHalls(),
        getVendorBranches(),
      ]);

      setHalls(hallsData);
      setBranches(branchesData);
    } catch (err) {
      setError(
        err.message || "Failed to load halls."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadData();
  }, []);


  const filteredHalls = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return halls;
    }

    return halls.filter((hall) =>
      [
        hall.name,
        hall.branch_name,
        hall.capacity,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [halls, search]);


  function openCreateDialog() {
    setEditingHall(null);

    setForm({
      branch: "",
      name: "",
      capacity: "",
    });

    setError("");
    setDialogOpen(true);
  }


  function openEditDialog(hall) {
    setEditingHall(hall);

    setForm({
      branch: String(hall.branch),
      name: hall.name || "",
      capacity: String(hall.capacity || ""),
    });

    setError("");
    setDialogOpen(true);
  }


  function closeDialog() {
    if (saving) return;

    setDialogOpen(false);
    setEditingHall(null);

    setForm({
      branch: "",
      name: "",
      capacity: "",
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

    if (!form.branch) {
      setError("Please select a branch.");
      return;
    }

    if (!form.name.trim()) {
      setError("Please enter a hall name.");
      return;
    }

    if (!form.capacity || Number(form.capacity) <= 0) {
      setError("Capacity must be greater than 0.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        branch: Number(form.branch),
        name: form.name.trim(),
        capacity: Number(form.capacity),
      };

      if (editingHall) {
        const updatedHall = await updateVendorHall(
          editingHall.id,
          payload
        );

        setHalls((previous) =>
          previous.map((hall) =>
            hall.id === editingHall.id
              ? updatedHall
              : hall
          )
        );
      } else {
        const newHall = await createVendorHall(
          payload
        );

        setHalls((previous) => [
          newHall,
          ...previous,
        ]);
      }

      closeDialog();
    } catch (err) {
      setError(
        err.message || "Failed to save hall."
      );
    } finally {
      setSaving(false);
    }
  }


  function openDeleteDialog(hall) {
    setDeletingHall(hall);
    setDeleteDialogOpen(true);
  }


  async function handleDelete() {
    if (!deletingHall) return;

    try {
      setSaving(true);
      setError("");

      await deleteVendorHall(
        deletingHall.id
      );

      setHalls((previous) =>
        previous.filter(
          (hall) =>
            hall.id !== deletingHall.id
        )
      );

      setDeleteDialogOpen(false);
      setDeletingHall(null);
    } catch (err) {
      setError(
        err.message || "Failed to delete hall."
      );
    } finally {
      setSaving(false);
    }
  }


  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading halls...
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
            My Halls
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            Manage the cinema halls inside your branches.
          </p>
        </div>

        <Button
          onClick={openCreateDialog}
          className="bg-red-600 hover:bg-red-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Hall
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
              placeholder="Search halls or branches..."
              className="border-white/10 bg-slate-950 pl-10 text-white placeholder:text-slate-500"
            />
          </div>
        </CardContent>
      </Card>


      {/* HALLS */}
      {filteredHalls.length === 0 ? (
        <Card className="border-white/10 bg-slate-900">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5">
              <Building2 className="h-7 w-7 text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold">
              No halls found
            </h2>

            <p className="mt-1 max-w-md text-sm text-slate-500">
              {search
                ? "Try a different search."
                : "Create your first cinema hall to get started."}
            </p>

            {!search && (
              <Button
                onClick={openCreateDialog}
                className="mt-5 bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Hall
              </Button>
            )}

          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

          {filteredHalls.map((hall) => (
            <Card
              key={hall.id}
              className="border-white/10 bg-slate-900 transition hover:border-white/20"
            >

              <CardHeader>
                <div className="flex items-start justify-between gap-3">

                  <div className="min-w-0">
                    <CardTitle className="truncate text-lg text-white">
                      {hall.name}
                    </CardTitle>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                      <Building2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {hall.branch_name}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-red-500/10 px-3 py-1 text-xs font-medium text-red-400">
                    Hall #{hall.id}
                  </span>

                </div>
              </CardHeader>


              <CardContent>

                <div className="mb-5 rounded-xl bg-white/[0.03] p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-500">
                    Capacity
                  </p>

                  <p className="mt-1 text-2xl font-bold text-white">
                    {hall.capacity}
                  </p>

                  <p className="text-xs text-slate-500">
                    seats
                  </p>
                </div>


                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      openEditDialog(hall)
                    }
                    className="flex-1 border-white/10 bg-transparent text-white hover:bg-white/5"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() =>
                      openDeleteDialog(hall)
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
              {editingHall
                ? "Edit Hall"
                : "Add Hall"}
            </DialogTitle>

            <DialogDescription className="text-slate-400">
              {editingHall
                ? "Update the cinema hall information."
                : "Create a new hall inside one of your branches."}
            </DialogDescription>
          </DialogHeader>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* BRANCH */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Branch
              </label>

              <Select
                value={form.branch}
                onValueChange={(value) =>
                  setForm((previous) => ({
                    ...previous,
                    branch: value,
                  }))
                }
              >
                <SelectTrigger className="border-white/10 bg-slate-950 text-white">
                  <SelectValue placeholder="Select a branch" />
                </SelectTrigger>

                <SelectContent className="border-white/10 bg-slate-900 text-white">

                  {branches.map((branch) => (
                    <SelectItem
                      key={branch.id}
                      value={String(branch.id)}
                    >
                      {branch.name} — {branch.city}
                    </SelectItem>
                  ))}

                </SelectContent>
              </Select>
            </div>


            {/* HALL NAME */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Hall Name
              </label>

              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Hall 1"
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>


            {/* CAPACITY */}
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Capacity
              </label>

              <Input
                name="capacity"
                type="number"
                min="1"
                value={form.capacity}
                onChange={handleChange}
                placeholder="e.g. 120"
                className="border-white/10 bg-slate-950 text-white placeholder:text-slate-500"
              />
            </div>


            {/* FORM ERROR */}
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
                disabled={saving}
                className="bg-red-600 hover:bg-red-700"
              >
                {saving && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {editingHall
                  ? "Update Hall"
                  : "Create Hall"}
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
              Delete {deletingHall?.name}?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-slate-400">
              This will permanently delete this hall.
              Any seats belonging to this hall may also
              be deleted depending on your database
              relationships.
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