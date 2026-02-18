import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Search, AlertTriangle, ChevronRight, Info, ShoppingBag } from 'lucide-react';
import { BoycottIsraeliClient, BoycottIsraeliRequests } from '@islamicnetwork/sdk';

interface Category {
    name: string;
    description?: string | null;
}

// Initialize SDK Client
const client = BoycottIsraeliClient.create();

const BoycottPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchResults, setSearchResults] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'search' | 'categories'>('search');

    const fetchCategories = useCallback(async () => {
        try {
            const response = await client.categories(
                new BoycottIsraeliRequests.CategoriesRequest(
                    new BoycottIsraeliRequests.PaginationOptions({ limit: 20 })
                )
            );
            setCategories((response.data as unknown as Category[]) || []);
        } catch (error) {
            console.error("Failed to fetch categories:", error);
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setActiveTab('search');
        try {
            const response = await client.search(
                new BoycottIsraeliRequests.SearchRequest(
                    searchQuery,
                    new BoycottIsraeliRequests.PaginationOptions({ limit: 20 })
                )
            );
            setSearchResults((response.data as unknown as Category[]) || []);
        } catch (error) {
            console.error("Failed to search:", error);
            setSearchResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 pb-24 max-w-4xl">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 mb-4">
                        <AlertTriangle className="w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Cek Produk Boikot</h1>
                    <p className="text-gray-600 dark:text-gray-300 max-w-lg mx-auto">
                        Cari tahu apakah sebuah brand atau produk terafiliasi dengan gerakan yang perlu dihindari.
                    </p>
                </div>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="relative max-w-xl mx-auto">
                    <input
                        type="text"
                        placeholder="Cari nama brand atau produk (contoh: Starbucks)"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-6 py-4 pl-14 rounded-2xl bg-white dark:bg-slate-800 shadow-lg border-2 border-transparent focus:border-red-400 focus:outline-none text-gray-800 dark:text-white placeholder-gray-400 transition-all text-lg"
                    />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 -translate-y-1/2 px-4 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                        {isLoading ? 'Mencari...' : 'Cari'}
                    </button>
                </form>

                {/* Tabs / Content */}
                <div className="mt-8">
                    {/* Search Results */}
                    {searchResults.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white px-2">Hasil Pencarian</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                {searchResults.map((item, index) => (
                                    <div key={index} className="bg-white dark:bg-slate-800 p-5 rounded-xl shadow-sm border border-red-100 dark:border-red-900/20 flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-900/10 flex items-center justify-center shrink-0">
                                            <ShoppingBag className="w-6 h-6 text-red-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 dark:text-gray-100 text-lg">{item.name}</h4>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="px-2 py-0.5 rounded textxs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs uppercase tracking-wide">
                                                    Terboikot
                                                </span>
                                            </div>
                                            {/* Assuming API returns some description or reason */}
                                            {item.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                                                    {item.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* No Results State */}
                    {activeTab === 'search' && !isLoading && searchQuery && searchResults.length === 0 && (
                        <div className="text-center py-12 bg-white/50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                            <Info className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Tidak ditemukan data untuk "{searchQuery}"</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500">Pastikan ejaan benar atau coba kata kunci lain.</p>
                        </div>
                    )}

                    {/* Categories List (Default View) */}
                    {searchResults.length === 0 && !searchQuery && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-gray-800 dark:text-white px-2 flex items-center gap-2">
                                Kategori Produk
                                <span className="text-xs font-normal text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
                                    {categories.length}
                                </span>
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {categories.map((cat, index) => (
                                    <div
                                        key={index}
                                        className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 hover:border-primary/30 dark:hover:border-primary/30 hover:shadow-md transition cursor-pointer group"
                                        onClick={() => {
                                            setSearchQuery(cat.name);
                                            // Optional: Auto trigger search
                                        }}
                                    >
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                                                <ShoppingBag className="w-4 h-4" />
                                            </span>
                                            <ChevronRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-primary transition-colors" />
                                        </div>
                                        <h4 className="font-medium text-gray-700 dark:text-gray-200 group-hover:text-primary transition-colors truncate">
                                            {cat.name}
                                        </h4>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-gray-400 dark:text-gray-500 mt-8">
                    Data disediakan oleh Islamic Network SDK
                </div>
            </motion.div>
        </div>
    );
};

export default BoycottPage;
