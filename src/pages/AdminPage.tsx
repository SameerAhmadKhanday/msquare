import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Upload, LogOut, Plus, Image, Video } from "lucide-react";
import Logo from "@/components/Logo";

interface Project {
  id: string;
  title: string;
  description: string | null;
  category: string;
  featured: boolean;
  media: { id: string; media_url: string; media_type: string }[];
}

const AdminPage = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("construction");
  const [uploading, setUploading] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user) fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      const withMedia = await Promise.all(
        data.map(async (project) => {
          const { data: media } = await supabase
            .from("project_media")
            .select("*")
            .eq("project_id", project.id)
            .order("display_order");
          return { ...project, media: media || [] };
        })
      );
      setProjects(withMedia);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error("Title is required");
    setCreating(true);
    const { error } = await supabase.from("projects").insert({
      title: title.trim(),
      description: description.trim() || null,
      category,
    });
    setCreating(false);
    if (error) return toast.error(error.message);
    toast.success("Project created!");
    setTitle("");
    setDescription("");
    setCategory("construction");
    fetchProjects();
  };

  const handleUploadMedia = async (projectId: string, files: FileList) => {
    setUploading(true);
    for (const file of Array.from(files)) {
      const isVideo = file.type.startsWith("video/");
      const ext = file.name.split(".").pop();
      const path = `${projectId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("project-media")
        .upload(path, file);

      if (uploadError) {
        toast.error(`Upload failed: ${uploadError.message}`);
        continue;
      }

      const { data: publicUrl } = supabase.storage
        .from("project-media")
        .getPublicUrl(path);

      await supabase.from("project_media").insert({
        project_id: projectId,
        media_url: publicUrl.publicUrl,
        media_type: isVideo ? "video" : "image",
      });
    }
    setUploading(false);
    toast.success("Media uploaded!");
    fetchProjects();
  };

  const handleDeleteMedia = async (mediaId: string) => {
    await supabase.from("project_media").delete().eq("id", mediaId);
    toast.success("Media removed");
    fetchProjects();
  };

  const handleDeleteProject = async (projectId: string) => {
    await supabase.from("projects").delete().eq("id", projectId);
    toast.success("Project deleted");
    fetchProjects();
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground mb-4">You need admin privileges to access this page.</p>
          <Button onClick={() => { signOut(); navigate("/"); }}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-secondary border-b border-border px-4 py-3">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Logo className="w-7 h-7" />
            <span className="font-display text-lg font-bold text-secondary-foreground">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              View Site
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-1" /> Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Create Project */}
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h3 className="font-display text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5 text-primary" /> New Project
          </h3>
          <form onSubmit={handleCreateProject} className="space-y-4">
            <div>
              <Label className="text-foreground">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project name" className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground">Description</Label>
              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" className="mt-1" />
            </div>
            <div>
              <Label className="text-foreground">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="construction">Construction</SelectItem>
                  <SelectItem value="reconstruction">Reconstruction</SelectItem>
                  <SelectItem value="renovation">Renovation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create Project"}
            </Button>
          </form>
        </div>

        {/* Projects List */}
        <h3 className="font-display text-xl font-bold text-foreground mb-4">
          Your Projects ({projects.length})
        </h3>
        <div className="space-y-6">
          {projects.map((project) => (
            <div key={project.id} className="bg-card border border-border rounded-xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-display text-lg font-bold text-foreground">{project.title}</h4>
                  <span className="text-primary text-xs font-semibold uppercase tracking-widest">
                    {project.category}
                  </span>
                  {project.description && (
                    <p className="text-muted-foreground text-sm mt-1">{project.description}</p>
                  )}
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Media Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                {project.media.map((m) => (
                  <div key={m.id} className="relative group rounded-lg overflow-hidden aspect-square">
                    {m.media_type === "video" ? (
                      <video src={m.media_url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={m.media_url} alt="" className="w-full h-full object-cover" />
                    )}
                    <button
                      onClick={() => handleDeleteMedia(m.id)}
                      className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-1 left-1">
                      {m.media_type === "video" ? (
                        <Video className="w-4 h-4 text-primary-foreground drop-shadow" />
                      ) : (
                        <Image className="w-4 h-4 text-primary-foreground drop-shadow" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload */}
              <label className="inline-flex items-center gap-2 cursor-pointer text-sm font-medium text-primary hover:underline">
                <Upload className="w-4 h-4" />
                {uploading ? "Uploading..." : "Upload Images / Videos"}
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  className="hidden"
                  onChange={(e) => e.target.files && handleUploadMedia(project.id, e.target.files)}
                  disabled={uploading}
                />
              </label>
            </div>
          ))}

          {projects.length === 0 && (
            <p className="text-muted-foreground text-center py-12">
              No projects yet. Create your first project above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
