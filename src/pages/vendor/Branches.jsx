import { useEffect, useState } from "react";
import {
  Building2,
  MapPin,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

import {
  createVendorBranch,
  deleteVendorBranch,
  getVendorBranches,
  updateVendorBranch,
} from "../../services/vendorApi";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const emptyForm = {
  name: "",
  city: "",
  address: "",
};

export default function Branches() {
  const [branches, setBranches] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const [editingBranch, setEditingBranch] =
    useState(null);

  const [branchToDelete, setBranchToDelete] =
    useState(null);

  const [form, setForm] = useState(emptyForm);

  const [error, setError] = useState("");

  async function loadBranches() {
    try {
      setLoading(true);
      setError("");

      const data = await getVendorBranches();

      setBranches(data);
    } catch (err) {
      setError(
        err.message ||
          "Failed to load branches."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBranches();
  }, []);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingBranch(null);
  }

  function openAddDialog() {
    resetForm();
    setError("");
    setDialogOpen(true);
  }

  function openEditDialog(branch) {
    setEditingBranch(branch);

    setForm({
      name: branch.name || "",
      city: branch.city || "",
      address: branch.address || "",
    });

    setError("");
    setDialogOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setSaving(true);
      setError("");

      const branchData = {
        name: form.name.trim(),
        city: form.city.trim(),
        address: form.address.trim(),
      };

      if (editingBranch) {
        await updateVendorBranch(
          editingBranch.id,
          branchData
        );
      } else {
        await createVendorBranch(branchData);
      }

      setDialogOpen(false);
      resetForm();

      await loadBranches();
    } catch (err) {
      setError(
        err.message ||
          "Failed to save branch."
      );
    } finally {
      setSaving(false);
    }
  }

  function openDeleteDialog(branch) {
    setBranchToDelete(branch);
    setDeleteOpen(true);
  }

  async function handleDelete() {
    if (!branchToDelete) {
      return;
    }

    try {
      setError("");

      await deleteVendorBranch(
        branchToDelete.id
      );

      setDeleteOpen(false);
      setBranchToDelete(null);

      await loadBranches();
    } catch (err) {
      setError(
        err.message ||
          "Failed to delete branch."
      );
    }
  }

  const filteredBranches = branches.filter(
    (branch) => {
      const query = search
        .toLowerCase()
        .trim();

      if (!query) {
        return true;
      }

      return (
        branch.name
          ?.toLowerCase()
          .includes(query) ||
        branch.city
          ?.toLowerCase()
          .includes(query) ||
        branch.address
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-950 p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* HEADER */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-red-500">
              Vendor Management
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              My Branches
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage the cinema branches belonging
              to your business.
            </p>
          </div>

          <Button
            onClick={openAddDialog}
            className="bg-red-600 hover:bg-red-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Branch
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
                placeholder="Search branches..."
                className="border-white/10 bg-slate-950 pl-10 text-white placeholder:text-slate-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* BRANCHES */}
        {loading ? (
          <div className="py-16 text-center text-slate-500">
            Loading branches...
          </div>
        ) : filteredBranches.length === 0 ? (
          <Card className="border-white/10 bg-slate-900">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="rounded-2xl bg-red-500/10 p-4">
                <Building2 className="h-8 w-8 text-red-500" />
              </div>

              <h2 className="mt-5 text-lg font-semibold">
                No branches found
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-500">
                Add your first cinema branch to
                start managing halls and shows.
              </p>

              <Button
                onClick={openAddDialog}
                className="mt-5 bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Branch
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredBranches.map((branch) => (
              <Card
                key={branch.id}
                className="group border-white/10 bg-slate-900 transition hover:border-red-500/30"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-red-500/10 p-3">
                        <Building2 className="h-5 w-5 text-red-500" />
                      </div>

                      <div>
                        <CardTitle className="text-white">
                          {branch.name}
                        </CardTitle>

                        <div className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                          <MapPin className="h-3.5 w-3.5" />
                          {branch.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent>
                  <p className="min-h-10 text-sm leading-5 text-slate-400">
                    {branch.address}
                  </p>

                  <div className="mt-6 flex gap-2 border-t border-white/5 pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openEditDialog(branch)
                      }
                      className="flex-1 border-white/10 bg-transparent text-slate-300 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil className="mr-2 h-4 w-4" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openDeleteDialog(branch)
                      }
                      className="border-red-500/20 bg-transparent text-red-400 hover:bg-red-500/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* ADD / EDIT */}
        <Dialog
          open={dialogOpen}
          onOpenChange={(open) => {
            setDialogOpen(open);

            if (!open) {
              resetForm();
            }
          }}
        >
          <DialogContent className="border-white/10 bg-slate-900 text-white">
            <DialogHeader>
              <DialogTitle>
                {editingBranch
                  ? "Edit Branch"
                  : "Add Branch"}
              </DialogTitle>

              <DialogDescription className="text-slate-400">
                {editingBranch
                  ? "Update your branch information."
                  : "Add a new cinema branch to your business."}
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {error && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">
                  Branch Name
                </Label>

                <Input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. CineMitra Kathmandu"
                  required
                  className="border-white/10 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">
                  City
                </Label>

                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  placeholder="e.g. Kathmandu"
                  required
                  className="border-white/10 bg-slate-950 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address
                </Label>

                <Input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="e.g. New Road, Kathmandu"
                  required
                  className="border-white/10 bg-slate-950 text-white"
                />
              </div>

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
                    : editingBranch
                      ? "Update Branch"
                      : "Add Branch"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* DELETE */}
        <AlertDialog
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
        >
          <AlertDialogContent className="border-white/10 bg-slate-900 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete Branch?
              </AlertDialogTitle>

              <AlertDialogDescription className="text-slate-400">
                Are you sure you want to delete{" "}
                <span className="font-medium text-white">
                  {branchToDelete?.name}
                </span>
                ? Any related halls may also be
                affected by Django's foreign-key
                rules.
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