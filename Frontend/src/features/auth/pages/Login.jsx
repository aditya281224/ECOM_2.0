import { useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth";

const INITIAL_FORM = {

    password: "",
    rememberMe: false,
};

const Icons = {
    user: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    ),
    lock: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    eye: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    ),
    eyeOff: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <path d="m2 2 20 20" />
        </svg>
    ),
    arrowRight: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    ),
    shieldCheck: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5 text-amber-500">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="m9 12 2 2 4-4" />
        </svg>
    ),
    check: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3 h-3 text-[#0e0e0e]">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    ),
};

function GeometricArt() {
    return (
        <svg className="w-full h-full" fill="none" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
            <circle cx="300" cy="400" r="280" stroke="#534434" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.6" />
            <circle cx="300" cy="400" r="210" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
            <circle cx="300" cy="400" r="140" stroke="#a08e7a" strokeWidth="0.75" opacity="0.4" />
            <line x1="20" y1="400" x2="580" y2="400" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />
            <line x1="300" y1="50" x2="300" y2="750" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />
            <polygon points="300,190 510,400 300,610 90,400" stroke="#f59e0b" strokeWidth="1" opacity="0.35" />
            <polygon points="300,260 440,400 300,540 160,400" stroke="#a08e7a" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.3" />
            <circle cx="300" cy="190" r="3" fill="#f59e0b" />
            <circle cx="510" cy="400" r="3" fill="#f59e0b" />
            <circle cx="300" cy="610" r="3" fill="#f59e0b" />
            <circle cx="90" cy="400" r="3" fill="#f59e0b" />
            <circle cx="300" cy="400" r="4.5" fill="#fbbf24" />
        </svg>
    );
}

export default function Login() {
    const { handleLogin } = useAuth();
    const [form, setForm] = useState(INITIAL_FORM);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        await handleLogin({
            email: form.email,
            password: form.password
        })

    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0e0e0e] flex font-['Plus_Jakarta_Sans']">
            <div className="hidden md:flex flex-col justify-between w-5/12 lg:w-1/2 p-8 lg:p-12 relative overflow-hidden bg-[#131313] border-r border-[#262626]/40">
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-amber-400/5 blur-[90px] pointer-events-none" />

                <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
                    <GeometricArt />
                </div>

                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#201f1f] flex items-center justify-center shadow-lg border border-[#27272a]/60">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500" fill="currentColor">
                            <path
                                d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                fill="none"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-wider uppercase text-[#e5e2e1]">AURA</span>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#a08e7a]">Fashion & Lifestyle</span>
                    </div>
                </div>

                <div className="relative z-10 my-auto max-w-sm">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1c1b1b] border border-[#27272a]/60 mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase">Your Style Awaits</span>
                    </div>
                    <h2 className="text-2xl lg:text-[1.75rem] lg:leading-9 font-semibold text-[#e5e2e1] mb-3 tracking-tight">
                        Discover your style. Define your statement.
                    </h2>
                    <p className="text-[0.8125rem] leading-5 text-[#d8c3ad]">
                        Explore timeless collections and find pieces that make every moment your own.
                    </p>
                </div>

                <div className="relative z-10 grid grid-cols-2 items-stretch gap-4 pt-6">
                    <div className="h-full p-3 rounded-lg bg-[#1c1b1b]/70 border border-[#27272a]/50 backdrop-blur-sm">
                        <span className="block text-[10px] font-semibold text-[#a08e7a] uppercase tracking-wider">
                            New Arrivals
                        </span>
                        <span className="text-xl font-semibold text-amber-500 tracking-tight">
                            Fresh <span className="text-xs text-[#d8c3ad] font-normal">Styles</span>
                        </span>
                    </div>

                    <div className="h-full p-3 rounded-lg bg-[#1c1b1b]/70 border border-[#27272a]/50 backdrop-blur-sm">
                        <span className="block text-[10px] font-semibold text-[#a08e7a] uppercase tracking-wider">
                            Made for You
                        </span>
                        <span className="text-xl font-semibold text-[#e5e2e1] tracking-tight">
                            Everyday <span className="text-xs text-amber-400 font-normal">Elegance</span>
                        </span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 py-6 overflow-hidden relative">
                <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md flex flex-col relative z-10">
                    <div className="mb-6 text-left">
                        <div className="flex items-center justify-between mb-1.5">
                            <h1 className="text-2xl md:text-[1.75rem] md:leading-9 font-semibold text-[#e5e2e1] tracking-tight">
                                Welcome Back
                            </h1>
                            <span className="md:hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#201f1f] text-amber-400 text-[11px] font-semibold border border-[#27272a]">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                AURA
                            </span>
                        </div>
                        <p className="text-[0.8125rem] leading-5 text-[#d8c3ad]">
                            Sign in to explore your collection and continue your style journey.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <Field label="Email">
                            <InputWithIcon
                                icon={Icons.user}
                                name="email"
                                type="email"
                                placeholder="Enter your email"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-semibold text-[#a08e7a] uppercase tracking-wider">
                                    Password
                                </span>
                                <a
                                    href="#"
                                    className="text-[11px] text-amber-400/90 hover:text-amber-300 font-medium transition-colors"
                                >
                                    Forgot password?
                                </a>
                            </div>
                            <div className="relative flex items-center group">
                                <span className="absolute left-3 text-[#a08e7a] group-focus-within:text-amber-400 transition-colors pointer-events-none">
                                    {Icons.lock}
                                </span>
                                <input
                                    className="w-full bg-[#1c1b1b] text-[#e5e2e1] text-[0.8125rem] leading-5 pl-9 pr-10 py-2.5 rounded-lg placeholder:text-[#534434] outline-none focus:bg-[#2a2a2a] transition-all border border-[#27272a] focus:border-amber-500/50"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    aria-label="Toggle password visibility"
                                    className="absolute right-3 text-[#a08e7a] hover:text-[#e5e2e1] transition-colors cursor-pointer"
                                    onClick={() => setShowPassword((v) => !v)}
                                >
                                    {showPassword ? Icons.eyeOff : Icons.eye}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-0.5">
                            <label
                                htmlFor="rememberMe"
                                className="flex items-center gap-2 cursor-pointer select-none group"
                            >
                                <div className="relative flex items-center">
                                    <input
                                        id="rememberMe"
                                        name="rememberMe"
                                        type="checkbox"
                                        checked={form.rememberMe}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-4 h-4 rounded bg-[#1c1b1b] border border-[#27272a] group-hover:border-[#534434] peer-checked:bg-amber-500 peer-checked:border-amber-500 transition-all flex items-center justify-center">
                                        {form.rememberMe && Icons.check}
                                    </div>
                                </div>
                                <span className="text-xs text-[#d8c3ad] group-hover:text-[#e5e2e1] transition-colors">
                                    Remember me
                                </span>
                            </label>

                            <div className="flex items-center gap-1 text-[11px] text-[#a08e7a]">
                                {Icons.shieldCheck}
                                <span>Secure Sign In</span>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all duration-200 text-[#0e0e0e] text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer group"
                        >
                            <span>Sign In</span>
                            {Icons.arrowRight}
                        </button>
                    </form>

                    <div className="mt-5 text-center">
                        <p className="text-[0.8125rem] leading-5 text-[#a08e7a]">
                            New to AURA?{" "}
                            <Link
                                to="/register"
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors ml-1"
                            >
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

function Field({ label, children }) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] font-semibold text-[#a08e7a] uppercase tracking-wider">
                {label}
            </span>
            {children}
        </div>
    );
}

function InputWithIcon({ icon, wrapClass = "", ...props }) {
    return (
        <div className={`relative flex items-center group ${wrapClass}`}>
            <span className="absolute left-3 text-[#a08e7a] group-focus-within:text-amber-400 transition-colors pointer-events-none">
                {icon}
            </span>
            <input
                className="w-full bg-[#1c1b1b] text-[#e5e2e1] text-[0.8125rem] leading-5 pl-9 pr-3 py-2.5 rounded-lg placeholder:text-[#534434] outline-none focus:bg-[#2a2a2a] transition-all border border-[#27272a] focus:border-amber-500/50"
                {...props}
            />
        </div>
    );
}