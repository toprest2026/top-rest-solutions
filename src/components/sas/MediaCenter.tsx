import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Image, Upload, FolderOpen, Trash2, Search, Grid, List, HardDrive } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface MediaFile {
  id: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size: number;
  folder: string;
  created_at: string;
}

const folders = ["الكل", "منتجات", "بنرات", "شعارات", "عام"];

const MediaCenter: React.FC = () => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState("الكل");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from("media_files").select("*").order("created_at", { ascending: false });
      if (activeFolder !== "الكل") query = query.eq("folder", activeFolder);
      const { data } = await query;
      setFiles((data as MediaFile[]) || []);
      setLoading(false);
    };
    fetch();
  }, [activeFolder]);

  const filtered = files.filter(f => f.file_name.includes(search));

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const totalSize = files.reduce((s, f) => s + (f.file_size || 0), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-black text-foreground">مركز الوسائط</h1>
          <p className="text-muted-foreground text-sm mt-1">مخزن سحابي مركزي (CDN) لجميع الصور والملفات</p>
        </div>
        <button className="btn-primary px-4 py-2 text-sm rounded-xl flex items-center gap-2">
          <Upload className="w-4 h-4" />
          رفع ملفات
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-4 text-center">
          <Image className="w-6 h-6 text-accent-water mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{files.length}</p>
          <p className="text-xs text-muted-foreground">إجمالي الملفات</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <HardDrive className="w-6 h-6 text-primary mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{formatSize(totalSize)}</p>
          <p className="text-xs text-muted-foreground">الحجم الإجمالي</p>
        </div>
        <div className="glass-card rounded-xl p-4 text-center">
          <FolderOpen className="w-6 h-6 text-warning mx-auto mb-2" />
          <p className="font-display font-bold text-xl text-foreground">{folders.length - 1}</p>
          <p className="text-xs text-muted-foreground">مجلدات</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex gap-1">
          {folders.map(f => (
            <button
              key={f}
              onClick={() => setActiveFolder(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                activeFolder === f ? "bg-accent-water text-white" : "bg-muted text-muted-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="relative">
          <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input pr-9 w-48 text-xs"
          />
        </div>
        <div className="flex border border-border rounded-lg overflow-hidden">
          <button onClick={() => setViewMode("grid")} className={`p-1.5 ${viewMode === "grid" ? "bg-accent-water text-white" : "text-muted-foreground"}`}>
            <Grid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-1.5 ${viewMode === "list" ? "bg-accent-water text-white" : "text-muted-foreground"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Files */}
      {loading ? (
        <p className="text-center text-muted-foreground py-12">جاري التحميل...</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center">
          <Image className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">لا توجد ملفات</p>
          <p className="text-xs text-muted-foreground mt-1">ارفع ملفات جديدة للبدء</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filtered.map(f => (
            <div key={f.id} className="glass-card rounded-xl overflow-hidden group cursor-pointer">
              <div className="aspect-square bg-muted flex items-center justify-center relative">
                {f.file_url ? (
                  <img src={f.file_url} alt={f.file_name} className="w-full h-full object-cover" />
                ) : (
                  <Image className="w-8 h-8 text-muted-foreground/30" />
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button className="p-1.5 bg-white/90 rounded-lg">
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-foreground truncate">{f.file_name}</p>
                <p className="text-[10px] text-muted-foreground">{formatSize(f.file_size)}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-2xl divide-y divide-border">
          {filtered.map(f => (
            <div key={f.id} className="flex items-center gap-3 p-3 hover:bg-muted/30">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                <Image className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{f.file_name}</p>
                <p className="text-xs text-muted-foreground">{f.folder} · {formatSize(f.file_size)}</p>
              </div>
              <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaCenter;
