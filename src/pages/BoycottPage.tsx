import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, AlertTriangle, ChevronRight, ShoppingBag, X, Loader2 } from 'lucide-react';
import { BoycottIsraeliClient, BoycottIsraeliRequests } from '@islamicnetwork/sdk';

interface Category {
    name: string;
    description?: string | null;
}

const client = BoycottIsraeliClient.create();

const BoycottPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchResults, setSearchResults] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const response = await client.categories(
                new BoycottIsraeliRequests.CategoriesRequest(
                    new BoycottIsraeliRequests.PaginationOptions({ limit: 20 })
                )
            );
            setCategories((response.data as unknown as Category[]) || []);
        } catch {
            // silent fail — categories are optional
        }
    }, []);

    useEffect(() => { fetchCategories(); }, [fetchCategories]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        setIsLoading(true);
        setHasSearched(true);
        try {
            const response = await client.search(
                new BoycottIsraeliRequests.SearchRequest(
                    searchQuery,
                    new BoycottIsraeliRequests.PaginationOptions({ limit: 20 })
                )
            );
            setSearchResults((response.data as unknown as Category[]) || []);
        } catch {
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearSearch = () => {
        setSearchQuery('');
        setSearchResults([]);
        setHasSearched(false);
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-20">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                {/* Header */}
                <div className="text-center space-y-2 py-4">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 mb-3">
                        <AlertTriangle className="w-7 h-7 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-[var(--text-main)]">Cek Produk Boikot</h1>
                    <p className="text-sm text-[var(--text-muted)] max-w-sm mx-auto">
                        Cari tahu apakah sebuah brand terafiliasi dengan gerakan yang perlu dihindari.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none" />
                    <input
                        type="text"
                        placeholder="Cari nama brand atau produk..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-28 py-3.5 rounded-2xl
                            bg-white/80 dark:bg-slate-800/70
                            border border-white/60 dark:border-white/8
                            shadow-sm focus:shadow-glow
                            focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary/50
                            text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60
                            text-sm font-medium transition-all"
                    />
                    <AnimatePresence>
                        {searchQuery && (
                            <motion.button
                                type="button"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                onClick={clearSearch}
                                aria-label="Hapus pencarian"
                                className="absolute right-20 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-[var(--text-muted)] transition-colors"
                            >
                                <X className="w-3.5 h-3.5" />
                            </motion.button>
                        )}
                    </AnimatePresence>
                    <button
                        type="submit"
                        disabled={isLoading || !searchQuery.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl
                            bg-primary text-white text-sm font-bold
                            hover:bg-primary/90 transition-colors
                            disabled:opacity-50 disabled:cursor-not-allowed
                            flex items-center gap-1.5"
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isLoading ? 'Mencari' : 'Cari'}
                    </button>
                </form>

                {/* Search Results */}
                <AnimatePresence mode="wait">
                    {hasSearched && (
                        <motion.div
                            key="results"
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                        >
                            {isLoading ? (
                                <div className="space-y-3">
                                    {[1, 2, 3].map(n => <div key={n} className="h-20 rounded-2xl shimmer" />)}
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div className="space-y-3">
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
                                        {searchResults.length} hasil untuk "{searchQuery}"
                                    </p>
                                    {searchResults.map((item, i) => (
                                        <div key={i} className="glass-card p-4 flex items-start gap-4 border-red-100/60 dark:border-red-900/20">
                                            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/15 flex items-center justify-center flex-shrink-0">
                                                <ShoppingBag className="w-5 h-5 text-red-500" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-[var(--text-main)] truncate">{item.name}</h4>
                                                <span className="inline-block mt-1 px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide">
                                                    Terboikot
                                                </span>
                                                {item.description && (
                                                    <p className="text-xs text-[var(--text-muted)] mt-1.5 line-clamp-2">{item.description}</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="glass-card p-10 text-center">
                                    <ShoppingBag className="w-10 h-10 text-[var(--text-muted)]/30 mx-auto mb-3" />
                                    <p className="font-medium text-[var(--text-main)]">Tidak ditemukan untuk "{searchQuery}"</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-1">Pastikan ejaan benar atau coba kata kunci lain.</p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Categories (default view) */}
                    {!hasSearched && (
                        <motion.div
                            key="categories"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-3"
                        >
                            {categories.length > 0 && (
                                <>
                                    <p className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider px-1">
                                        Kategori Produk
                                        <span className="ml-1.5 font-normal normal-case tracking-normal bg-gray-100 dark:bg-white/10 px-1.5 py-0.5 rounded-md">
                                            {categories.length}
                                        </span>
                                    </p>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {categories.map((cat, i) => (
                                            <button
                                                key={i}
                                                onClick={() => setSearchQuery(cat.name)}
                                                className="group glass-card p-4 text-left hover:border-primary/25 transition-all"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div className="w-8 h-8 rounded-xl bg-primary/10 group-hover:bg-primary text-primary group-hover:text-white flex items-center justify-center transition-colors">
                                                        <ShoppingBag className="w-4 h-4" />
                                                    </div>
                                                    <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-primary transition-colors" />
                                                </div>
                                                <p className="text-sm font-semibold text-[var(--text-main)] group-hover:text-primary transition-colors truncate">
                                                    {cat.name}
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                <p className="text-center text-xs text-[var(--text-muted)]/50">
                    Data disediakan oleh Islamic Network SDK
                </p>
            </motion.div>
        </div>
    );
};

export default BoycottPage;
