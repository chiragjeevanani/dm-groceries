import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutGrid,
  List,
  ChevronRight,
  Search,
  FolderOpen,
  Folder,
  Tag,
  Layers,
  ArrowRight,
  Package,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";
import Card from "@shared/components/ui/Card";
import Badge from "@shared/components/ui/Badge";
import { toast } from "sonner";

const CategoryHierarchy = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Selection State for Miller Columns
  const [selectedHeader, setSelectedHeader] = useState(null);
  const [selectedLevel2, setSelectedLevel2] = useState(null);

  // Stats
  const stats = useMemo(() => {
    let headers = 0;
    let l2 = 0;
    let subs = 0;

    const traverse = (items) => {
      items.forEach((item) => {
        if (item.type === "header") headers++;
        if (item.type === "category") l2++;
        if (item.type === "subcategory") subs++;
        if (item.children) traverse(item.children);
      });
    };
    traverse(categories);
    return { headers, l2, subs, total: headers + l2 + subs };
  }, [categories]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await adminApi.getCategoryTree();
      if (res.data.success) {
        setCategories(res.data.results || res.data.result || []);
      }
    } catch (error) {
      toast.error("Failed to fetch category hierarchy");
    } finally {
      setIsLoading(false);
    }
  };

  // Filter Logic
  const filteredHeaders = useMemo(() => {
    if (!searchTerm) return categories.filter((c) => c.type === "header");
    return categories.filter(
      (c) =>
        c.type === "header" &&
        c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [categories, searchTerm]);

  const activeLevel2 = useMemo(() => {
    if (!selectedHeader) return [];
    return selectedHeader.children || [];
  }, [selectedHeader]);

  const activeSubs = useMemo(() => {
    if (!selectedLevel2) return [];
    return selectedLevel2.children || [];
  }, [selectedLevel2]);

  // Handle Selection
  const handleHeaderSelect = (header) => {
    setSelectedHeader(header);
    setSelectedLevel2(null);
  };

  const handleLevel2Select = (l2) => {
    setSelectedLevel2(l2);
  };

  // Components
  const ColumnHeader = ({ title, icon: Icon, count, color }) => (
    <div
      className={`p-4 border-b border-slate-100 bg-white sticky top-0 z-10 flex items-center justify-between ${color}`}>
      <div className="flex items-center gap-2 font-bold text-slate-700 text-xs uppercase tracking-wider">
        <Icon className="w-4 h-4 text-emerald-600" />
        <span>{title}</span>
      </div>
      <Badge variant="neutral" className="bg-slate-50 text-slate-600 font-mono text-[10px] px-2 py-0.5 border border-slate-100/50">
        {count}
      </Badge>
    </div>
  );

  const ListItem = ({ item, isSelected, onClick, hasChildren, type }) => {
    const activeClass = isSelected
      ? "bg-emerald-50/50 border-emerald-200/50 text-[#154D1A] shadow-sm z-10"
      : "hover:bg-slate-50/50 border-transparent text-slate-600";

    const iconColor = isSelected ? "text-[#154D1A]" : "text-slate-400";

    return (
      <motion.div
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={onClick}
        className={`
          group flex items-center justify-between p-3.5 mx-2.5 my-1.5 rounded-xl border cursor-pointer transition-all duration-200
          ${activeClass}
        `}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div
            className={`
              w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
              ${isSelected ? "bg-white shadow-sm border border-emerald-100/30" : "bg-slate-50 border border-slate-100/30 group-hover:bg-white group-hover:shadow-sm"}
            `}>
            {item.image?.url || item.image ? (
              <img
                src={item.image?.url || item.image}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            ) : type === "header" ? (
              <FolderOpen className={`w-4 h-4 ${iconColor}`} />
            ) : type === "category" ? (
              <Folder className={`w-4 h-4 ${iconColor}`} />
            ) : (
              <Tag className={`w-4 h-4 ${iconColor}`} />
            )}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="font-bold text-xs tracking-tight text-slate-800">{item.name}</span>
            <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold mt-0.5 truncate">
              {item.slug}
            </span>
          </div>
        </div>

        {hasChildren && (
          <ChevronRight
            className={`w-4 h-4 transition-transform group-hover:translate-x-0.5 ${isSelected ? "text-emerald-600" : "text-slate-300"}`}
          />
        )}
      </motion.div>
    );
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col gap-4 animate-in fade-in duration-500 font-['Poppins',_sans-serif] bg-[#F7F9F7] p-1 pb-4">
      {/* Top Bar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-5 rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] shrink-0 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#154D1A]" />
            Category Hierarchy Explorer
          </h1>
          <p className="text-slate-500 text-xs font-semibold mt-0.5">
            Visual overview of your catalog structure ({stats.total} items)
          </p>
        </div>

        <div className="flex items-center gap-4 text-sm font-bold text-slate-500 bg-slate-50 border border-slate-100/50 px-4 py-2.5 rounded-xl self-start sm:self-auto">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#154D1A]"></span>
            <span>
              Headers: <b className="text-slate-800 font-bold">{stats.headers}</b>
            </span>
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>
              Level 2: <b className="text-slate-800 font-bold">{stats.l2}</b>
            </span>
          </div>
          <div className="w-px h-3 bg-slate-200"></div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>
              Subcategories: <b className="text-slate-800 font-bold">{stats.subs}</b>
            </span>
          </div>
        </div>
      </div>

      {/* Miller Columns View */}
      <div className="flex-1 min-h-0 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden">
        {/* Column 1: Headers */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden min-h-0 h-full">
          <ColumnHeader
            title="Header Categories"
            icon={LayoutGrid}
            count={filteredHeaders.length}
            color="border-l-4 border-l-[#154D1A]"
          />

          <div className="p-3 border-b border-slate-100/80">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Filter headers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border-none rounded-xl text-xs font-semibold focus:ring-2 focus:ring-emerald-100 transition-all outline-none"
              />
            </div>
          </div>

          <div
            className="flex-1 min-h-0 overflow-y-auto py-2 custom-scrollbar overscroll-contain touch-pan-y"
            tabIndex={0}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
          >
            {isLoading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                Loading structure...
              </div>
            ) : filteredHeaders.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
                No headers found
              </div>
            ) : (
              filteredHeaders.map((header) => (
                <ListItem
                  key={header._id || header.id}
                  item={header}
                  type="header"
                  isSelected={
                    selectedHeader &&
                    (selectedHeader._id || selectedHeader.id) ===
                    (header._id || header.id)
                  }
                  onClick={() => handleHeaderSelect(header)}
                  hasChildren={header.children && header.children.length > 0}
                />
              ))
            )}
          </div>
        </div>

        {/* Column 2: Level 2 */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden min-h-0 h-full transition-all duration-300">
          <ColumnHeader
            title="Level 2 Categories"
            icon={Folder}
            count={activeLevel2.length}
            color="border-l-4 border-l-emerald-600"
          />

          {!selectedHeader ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <ArrowRight className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                Select a Header Category
                <br />
                to view its contents
              </p>
            </div>
          ) : (
            <div
              className="flex-1 min-h-0 overflow-y-auto py-2 custom-scrollbar overscroll-contain touch-pan-y"
              tabIndex={0}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {activeLevel2.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold leading-relaxed">
                  No Level 2 categories in <br />
                  <span className="font-bold text-slate-600">
                    "{selectedHeader.name}"
                  </span>
                </div>
              ) : (
                activeLevel2.map((l2) => (
                  <ListItem
                    key={l2._id || l2.id}
                    item={l2}
                    type="category"
                    isSelected={
                      selectedLevel2 &&
                      (selectedLevel2._id || selectedLevel2.id) ===
                      (l2._id || l2.id)
                    }
                    onClick={() => handleLevel2Select(l2)}
                    hasChildren={l2.children && l2.children.length > 0}
                  />
                ))
              )}
            </div>
          )}
        </div>

        {/* Column 3: Subcategories */}
        <div className="bg-white rounded-[20px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col overflow-hidden min-h-0 h-full">
          <ColumnHeader
            title="Subcategories"
            icon={Tag}
            count={activeSubs.length}
            color="border-l-4 border-l-emerald-50"
          />

          {!selectedLevel2 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50">
              <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-3">
                <ArrowRight className="w-5 h-5 opacity-40" />
              </div>
              <p className="text-xs font-semibold leading-relaxed">
                Select a Level 2 Category
                <br />
                to view subcategories
              </p>
            </div>
          ) : (
            <div
              className="flex-1 min-h-0 overflow-y-auto py-2 custom-scrollbar overscroll-contain touch-pan-y"
              tabIndex={0}
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
            >
              {activeSubs.length === 0 ? (
                <div className="p-8 text-center text-slate-400 text-xs font-semibold leading-relaxed">
                  No subcategories in <br />
                  <span className="font-bold text-slate-600">
                    "{selectedLevel2.name}"
                  </span>
                </div>
              ) : (
                activeSubs.map((sub) => (
                  <ListItem
                    key={sub._id || sub.id}
                    item={sub}
                    type="subcategory"
                    isSelected={false}
                    onClick={() => { }}
                    hasChildren={false}
                  />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryHierarchy;
