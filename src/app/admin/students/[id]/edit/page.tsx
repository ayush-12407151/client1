"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2, Save, Plus, Trash2, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Payment {
  _id: string;
  month: string;
  amount: number;
  datePaid: string;
  receiptId: string;
}

export default function EditStudentPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [addingPayment, setAddingPayment] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    fatherName: "",
    motherName: "",
    schoolName: "",
    className: "",
    monthlyFee: 0,
    isEnrolled: false,
  });
  const [payments, setPayments] = useState<Payment[]>([]);

  // New Payment State
  const [newPayment, setNewPayment] = useState({
    month: "",
    amount: 0,
    receiptId: "",
  });

  useEffect(() => {
    fetchStudent();
  }, [params.id]);

  const fetchStudent = async () => {
    try {
      const res = await fetch(`/api/admin/students/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setFormData({
          name: data.name || "",
          email: data.email || "",
          fatherName: data.fatherName || "",
          motherName: data.motherName || "",
          schoolName: data.schoolName || "",
          className: data.className || "",
          monthlyFee: data.monthlyFee || 0,
          isEnrolled: data.isEnrolled || false,
        });
        setPayments(data.feePayments || []);
        setNewPayment(prev => ({ ...prev, amount: data.monthlyFee || 0 }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value });
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/students/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingPayment(true);
    try {
      const res = await fetch(`/api/admin/students/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPayment }),
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.student.feePayments);
        setNewPayment({ month: "", amount: formData.monthlyFee, receiptId: "" });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setAddingPayment(false);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!confirm("Remove this payment record?")) return;
    try {
      const res = await fetch(`/api/admin/students/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removePaymentId: paymentId }),
      });
      if (res.ok) {
        const data = await res.json();
        setPayments(data.student.feePayments);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex items-center gap-4">
        <Link href="/admin/students" className="text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">Edit Student</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Profile Edit */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSaveProfile} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b pb-2">Profile Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Full Name</Label>
                <Input name="name" required value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input name="email" type="email" required value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Father's Name</Label>
                <Input name="fatherName" value={formData.fatherName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Mother's Name</Label>
                <Input name="motherName" value={formData.motherName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>School / College</Label>
                <Input name="schoolName" value={formData.schoolName} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Class</Label>
                <Input name="className" value={formData.className} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label>Monthly Fee Expected (₹)</Label>
                <Input name="monthlyFee" type="number" min="0" value={formData.monthlyFee} onChange={handleChange} />
              </div>
              <div className="flex items-end pb-2">
                <Label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" name="isEnrolled" checked={formData.isEnrolled} onChange={handleChange} className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500" />
                  <span className="font-semibold text-slate-700">Account Enrolled (Active)</span>
                </Label>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Save Changes
              </Button>
            </div>
          </form>
        </div>

        {/* Right Col: Fee Ledger */}
        <div className="space-y-6">
          
          <form onSubmit={handleAddPayment} className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 space-y-4">
            <h3 className="text-md font-bold text-slate-900 border-b pb-2 flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Record Payment
            </h3>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Month (e.g., "Jan 2026") *</Label>
                <Input required placeholder="Jan 2026" value={newPayment.month} onChange={(e) => setNewPayment({ ...newPayment, month: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Amount Paid (₹) *</Label>
                <Input type="number" required value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: Number(e.target.value) })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Receipt / Transaction ID</Label>
                <Input placeholder="Optional" value={newPayment.receiptId} onChange={(e) => setNewPayment({ ...newPayment, receiptId: e.target.value })} />
              </div>
              <Button type="submit" disabled={addingPayment || !newPayment.month} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                {addingPayment ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Plus className="w-4 h-4 mr-1" /> Add Payment</>}
              </Button>
            </div>
          </form>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
            <h3 className="text-md font-bold text-slate-900 border-b pb-2 mb-4">Payment History</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {payments.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No payments recorded.</p>
              ) : (
                payments.slice().reverse().map((payment) => (
                  <div key={payment._id} className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm flex justify-between items-center group">
                    <div>
                      <div className="font-bold text-slate-900">{payment.month}</div>
                      <div className="text-xs text-slate-500">{new Date(payment.datePaid).toLocaleDateString()}</div>
                      {payment.receiptId && <div className="text-[10px] text-slate-400 mt-0.5">Ref: {payment.receiptId}</div>}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-emerald-600">₹{payment.amount}</span>
                      <button onClick={() => handleDeletePayment(payment._id)} className="text-slate-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
