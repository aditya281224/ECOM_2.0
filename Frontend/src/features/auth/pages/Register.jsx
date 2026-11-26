
import { useState, useCallback } from "react";
import { Link } from "react-router";
import { useAuth } from "../hook/useAuth"

/* ───────────────────── constants ───────────────────── */

const INITIAL_FORM = {
    fullname: "",
    email: "",
    contactNumber: "",
    password: "",
    isSeller: false,
};

function getPasswordScore(val) {
    let score = 0;
    if (val.length > 5) score++;
    if (val.length > 9) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
}

const STRENGTH = [
    { label: "Strength", color: "text-[#a08e7a]" },
    { label: "Weak", color: "text-red-400" },
    { label: "Moderate", color: "text-amber-400" },
    { label: "Strong", color: "text-amber-500" },
    { label: "Optimal", color: "text-green-400" },
];

const BAR_COLORS = [
    "bg-red-400",
    "bg-amber-500",
    "bg-amber-500",
    "bg-green-400",
];

/* ───────────────────── inline SVG icons ───────────────────── */

const Icons = {
    person: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <circle cx="12" cy="8" r="4" />
            <path d="M20 21a8 8 0 0 0-16 0" />
        </svg>
    ),

    mail: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    ),

    phone: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px]">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
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

    store: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="w-[16px] h-[16px]">
            <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
            <path d="M2 7h20" />
            <path d="M22 7v3a2 2 0 0 1-2 2a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" />
        </svg>
    ),

    chevron: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
            <path d="m6 9 6 6 6-6" />
        </svg>
    ),

    arrowRight: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[18px] h-[18px] transition-transform duration-200 group-hover:translate-x-1">
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    ),
};

/* ───────────────── geometric SVG background ───────────────── */

function GeometricArt() {
    return (
        <svg className="w-full h-full" fill="none" viewBox="0 0 600 800" xmlns="http://www.w3.org/2000/svg">
            {/* concentric circles */}
            <circle cx="300" cy="400" r="280" stroke="#534434" strokeWidth="0.75" strokeDasharray="4 8" opacity="0.6" />
            <circle cx="300" cy="400" r="210" stroke="#f59e0b" strokeWidth="1" opacity="0.3" />
            <circle cx="300" cy="400" r="140" stroke="#a08e7a" strokeWidth="0.75" opacity="0.4" />

            {/* cross-hair lines */}
            <line x1="20" y1="400" x2="580" y2="400" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />
            <line x1="300" y1="50" x2="300" y2="750" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" />

            {/* diamond shapes */}
            <polygon points="300,190 510,400 300,610 90,400" stroke="#f59e0b" strokeWidth="1" opacity="0.35" />
            <polygon points="300,260 440,400 300,540 160,400" stroke="#a08e7a" strokeWidth="0.75" strokeDasharray="2 4" opacity="0.3" />

            {/* node dots */}
            <circle cx="300" cy="190" r="3" fill="#f59e0b" />
            <circle cx="510" cy="400" r="3" fill="#f59e0b" />
            <circle cx="300" cy="610" r="3" fill="#f59e0b" />
            <circle cx="90" cy="400" r="3" fill="#f59e0b" />
            <circle cx="300" cy="400" r="4.5" fill="#fbbf24" />
        </svg>
    );
}

/* ═══════════════════════ component ═══════════════════════ */

export default function Register() {

    const { handleRegister } = useAuth();
    const [form, setForm] = useState(INITIAL_FORM);
    const [showPassword, setShowPassword] = useState(false);


    const score = getPasswordScore(form.password);

    const handleChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        await handleRegister({
            email: form.email,
            contact: form.contactNumber,
            password: form.password,
            fullname: form.fullname,
            isSeller: form.isSeller

        })

    };

    return (
        <div className="h-screen w-screen overflow-hidden bg-[#0e0e0e] flex font-['Plus_Jakarta_Sans']">

            {/* ────────── LEFT — decorative panel ────────── */}

            <div className="hidden md:flex flex-col justify-between w-5/12 lg:w-1/2 p-8 lg:p-12 relative overflow-hidden bg-[#131313]">

                {/* ambient glows */}
                <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-amber-500/10 blur-[100px] pointer-events-none" />
                <div className="absolute bottom-1/4 -right-24 w-80 h-80 rounded-full bg-amber-400/5 blur-[90px] pointer-events-none" />

                {/* geometric wireframe */}
                <div className="absolute inset-0 opacity-25 flex items-center justify-center pointer-events-none">
                    <GeometricArt />
                </div>

                {/* brand mark */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#201f1f] flex items-center justify-center shadow-lg">
                        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-500" fill="currentColor">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>

                    <div className="flex flex-col">
                        <span className="text-sm font-semibold tracking-wider uppercase text-[#e5e2e1]">
                            AURA
                        </span>
                        <span className="text-[10px] font-semibold tracking-widest uppercase text-[#a08e7a]">
                            Wear Your Identity
                        </span>
                    </div>
                </div>

                {/* center quote */}
                <div className="relative z-10 my-auto max-w-sm">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1c1b1b] mb-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        <span className="text-[11px] font-semibold text-amber-400 tracking-wide uppercase">
                            Discover Your Style
                        </span>
                    </div>

                    <h2 className="text-2xl lg:text-[1.75rem] lg:leading-9 font-semibold text-[#e5e2e1] mb-3 tracking-tight">
                        Style that speaks before you do.
                    </h2>

                    <p className="text-[0.8125rem] leading-5 text-[#d8c3ad]">
                        Discover pieces that match your personality. From everyday
                        essentials to statement looks, find your style and make every
                        outfit count.
                    </p>
                </div>
            </div>

            {/* ────────── RIGHT — registration form ────────── */}

            <div className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 lg:px-16 py-6 overflow-hidden relative">

                {/* ambient glow */}
                <div className="absolute w-72 h-72 rounded-full bg-amber-500/10 blur-[120px] pointer-events-none" />

                <div className="w-full max-w-md flex flex-col relative z-10">

                    {/* title */}
                    <div className="mb-5 text-left">
                        <div className="flex items-center justify-between mb-1.5">
                            <h1 className="text-2xl md:text-[1.75rem] md:leading-9 font-semibold text-[#e5e2e1] tracking-tight">
                                Create Account
                            </h1>

                            {/* mobile-only badge */}
                            <span className="md:hidden inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#201f1f] text-amber-400 text-[11px] font-semibold">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                AURA
                            </span>
                        </div>

                        <p className="text-[0.8125rem] leading-5 text-[#d8c3ad]">
                            Join AURA and discover a style that's uniquely yours.
                        </p>
                    </div>

                    {/* form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                        {/* Full Name */}
                        <Field label="Full Name">
                            <InputWithIcon
                                icon={Icons.person}
                                name="fullname"
                                type="text"
                                placeholder="e.g. Alex Morgan"
                                value={form.fullname}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        {/* Email */}
                        <Field label="Email Address">
                            <InputWithIcon
                                icon={Icons.mail}
                                name="email"
                                type="email"
                                placeholder="alex@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </Field>

                        {/* Contact Number */}
                        <Field label="Contact Number">
                            <div className="flex gap-2">
                                <div className="relative w-24 shrink-0">
                                    <select
                                        name="countryCode"
                                        defaultValue="+91"
                                        className="w-full bg-[#1c1b1b] text-[#e5e2e1] text-[0.8125rem] leading-5 pl-2.5 pr-6 py-2 rounded-lg outline-none focus:bg-[#2a2a2a] appearance-none cursor-pointer transition-all border border-[#27272a] focus:border-amber-500/50"
                                    >
                                        <option value="+91">+91 IN</option>
                                        <option value="+1">+1 US</option>
                                        <option value="+44">+44 UK</option>
                                        <option value="+49">+49 DE</option>
                                        <option value="+81">+81 JP</option>
                                        <option value="+33">+33 FR</option>
                                        <option value="+61">+61 AU</option>
                                    </select>

                                    <span className="absolute right-1.5 top-1/2 -translate-y-1/2 text-[#a08e7a] pointer-events-none">
                                        {Icons.chevron}
                                    </span>
                                </div>

                                <InputWithIcon
                                    icon={Icons.phone}
                                    name="contactNumber"
                                    type="tel"
                                    placeholder="98765 43210"
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    wrapClass="flex-1"
                                />
                            </div>
                        </Field>

                        {/* Password */}
                        <div className="flex flex-col gap-1">
                            <div className="flex justify-between items-center">
                                <span className="text-[11px] font-semibold text-[#a08e7a] uppercase tracking-wider">
                                    Password
                                </span>

                                <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${STRENGTH[score].color}`}>
                                    {STRENGTH[score].label}
                                </span>
                            </div>

                            <div className="relative flex items-center group">
                                <span className="absolute left-3 text-[#a08e7a] group-focus-within:text-amber-400 transition-colors pointer-events-none">
                                    {Icons.lock}
                                </span>

                                <input
                                    className="w-full bg-[#1c1b1b] text-[#e5e2e1] text-[0.8125rem] leading-5 pl-9 pr-10 py-2 rounded-lg placeholder:text-[#534434] outline-none focus:bg-[#2a2a2a] transition-all border border-[#27272a] focus:border-amber-500/50"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••••••"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
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

                            {/* strength bars */}
                            <div className="grid grid-cols-4 gap-1.5 mt-1">
                                {[0, 1, 2, 3].map((i) => (
                                    <div
                                        key={i}
                                        className={`h-1 rounded-full transition-colors duration-200 ${i < score ? BAR_COLORS[score - 1] : "bg-[#353534]"
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* isSeller toggle */}
                        <label
                            htmlFor="isSeller"
                            className="flex items-center justify-between p-2.5 rounded-lg bg-[#1c1b1b]/70 cursor-pointer hover:bg-[#201f1f] transition-colors border border-[#27272a] group"
                        >
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-md bg-[#201f1f] flex items-center justify-center text-amber-400 group-hover:bg-amber-500/15 transition-colors shrink-0">
                                    {Icons.store}
                                </div>

                                <div className="flex flex-col">
                                    <span className="text-sm font-medium text-[#e5e2e1] leading-none">
                                        Register as a Seller
                                    </span>
                                    <span className="text-[11px] text-[#a08e7a] leading-tight mt-0.5">
                                        Unlock merchant tools &amp; storefront
                                    </span>
                                </div>
                            </div>

                            <div className="relative inline-flex items-center shrink-0">
                                <input
                                    className="sr-only peer"
                                    id="isSeller"
                                    name="isSeller"
                                    type="checkbox"
                                    checked={form.isSeller}
                                    onChange={handleChange}
                                />

                                <div className="w-9 h-5 bg-[#353534] rounded-full peer-checked:bg-amber-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#e5e2e1] after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                            </div>
                        </label>

                        {/* submit */}
                        <button
                            type="submit"
                            className="mt-1 w-full bg-amber-500 hover:bg-amber-400 active:scale-[0.99] transition-all duration-200 text-[#0e0e0e] text-sm font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/15 cursor-pointer group"
                        >
                            <span>Create Account</span>
                            {Icons.arrowRight}
                        </button>
                    </form>

                    {/* sign-in link */}
                    <div className="mt-4 text-center">
                        <p className="text-[0.8125rem] leading-5 text-[#a08e7a]">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="text-amber-400 hover:text-amber-300 font-medium transition-colors ml-1"
                            >
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ─── small helpers ─── */

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
                className="w-full bg-[#1c1b1b] text-[#e5e2e1] text-[0.8125rem] leading-5 pl-9 pr-3 py-2 rounded-lg placeholder:text-[#534434] outline-none focus:bg-[#2a2a2a] transition-all border border-[#27272a] focus:border-amber-500/50"
                {...props}
            />
        </div>
    );
}
