"use client";

import { useState, useEffect } from "react";
import SummaryCard from "@/components/SummaryCard";
import ExpenseForm from "@/components/ExpenseForm";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const res = await fetch("/api/summary");
            const data = await res.json();
            setSummary(data);
        } catch (error) {
            console.error("Failed to fetch summary", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSummary();
    }, []);

    if (loading)
        return (
            <div className="flex h-64 items-center justify-center">
                <Loader2 className="animate-spin text-gray-400" size={40} />
            </div>
        );

    return (
        <div className="flex flex-col gap-10 animate-fade-in">
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase italic text-(--foreground)">Dashboard</h1>
                <p className="text-(--muted-foreground) font-medium mt-1">Real-time financial overview & quick entry</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <SummaryCard title="Total Spent" amount={summary?.totalSpend || 0} subtitle="All partners combined" />
                {summary?.partnerBalances.map((partner) => (
                    <SummaryCard
                        key={partner.id}
                        title={`${partner.name}`}
                        amount={partner.amountPaid}
                        subtitle="Total contributed"
                    />
                ))}
            </div>

            <div className="max-w-3xl">
                <ExpenseForm onExpenseAdded={fetchSummary} />
            </div>
        </div>
    );
}
