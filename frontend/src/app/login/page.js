"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
    const supabase = createClient();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--background) p-2 md:p-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div
                className="absolute top-0 left-0 w-full h-full opacity-5 md:opacity-10 pointer-events-none"
                style={{
                    backgroundImage: "radial-gradient(circle at 2px 2px, var(--muted-foreground) 1px, transparent 0)",
                    backgroundSize: "40px 40px",
                }}
            ></div>
            <div className="absolute -top-24 md:-top-48 -left-24 md:-left-48 w-64 md:w-96 h-64 md:h-96 bg-accent/20 rounded-full blur-[80px] md:blur-[120px]"></div>
            <div className="absolute -bottom-24 md:-bottom-48 -right-24 md:-right-48 w-64 md:w-96 h-64 md:h-96 bg-accent/10 rounded-full blur-[80px] md:blur-[120px]"></div>

            <div className="w-full max-w-[480px] animate-fade-in relative z-10 px-2">
                <div className="text-center mb-8 md:mb-10">
                    <div className="inline-flex h-14 md:h-16 w-14 md:w-16 bg-accent rounded-2xl items-center justify-center shadow-[0_0_30px_rgba(5,150,105,0.3)] mb-6 transition-transform hover:scale-110 duration-300">
                        <span className="text-white font-black text-xl md:text-2xl tracking-tighter">G&G</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight text-(--foreground) uppercase italic leading-tight">
                        Internal Access
                    </h1>
                    <p className="text-xs md:text-sm text-(--muted-foreground) mt-2 font-medium tracking-wide px-4">
                        Grand & Grey &mdash; Partner Expense Tracker
                    </p>
                </div>

                <form
                    onSubmit={handleLogin}
                    className="bg-(--card) border border-(--border) rounded-2xl md:rounded-[2.5rem] p-6 md:p-10 shadow-2xl space-y-6 md:space-y-8"
                >
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                            <Mail size={14} className="text-accent" /> Partner Email
                        </label>
                        <input
                            type="email"
                            required
                            className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 outline-none focus:border-accent text-(--foreground) transition-all font-bold placeholder:text-(--muted-foreground)/20 text-base"
                            placeholder="name@grandgrey.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-(--muted-foreground) uppercase tracking-[0.2em] flex items-center gap-2 ml-1">
                            <Lock size={14} className="text-accent" /> Security Key
                        </label>
                        <div className="relative group">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full bg-(--background) border border-(--border) rounded-2xl px-5 py-4 pr-14 outline-none focus:border-accent text-(--foreground) transition-all font-bold tracking-widest placeholder:text-(--muted-foreground)/20 text-base"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-2 top-1/2 -translate-y-1/2 p-3 text-(--muted-foreground) hover:text-accent transition-colors outline-none"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-destructive/10 border border-destructive/20 text-destructive text-[11px] font-bold p-4 rounded-xl text-center animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-accent text-white rounded-2xl py-4 md:py-5 font-black text-base md:text-lg shadow-[0_10px_30px_rgba(5,150,105,0.15)] hover:shadow-[0_15px_40px_rgba(5,150,105,0.2)] hover:-translate-y-1 active:translate-y-0 transition-all disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none flex items-center justify-center gap-3 uppercase tracking-[0.15em]"
                    >
                        {loading ? (
                            <Loader2 className="animate-spin" size={24} />
                        ) : (
                            <>
                                Authenticate
                                <ArrowRight size={22} className="hidden md:block" />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center mt-8 text-[10px] text-(--muted-foreground) uppercase font-black tracking-widest opacity-40 leading-relaxed px-6">
                    Authorized Personnel Only <br className="md:hidden" />
                </p>
            </div>
        </div>
    );
}
