'use client'

import { useToast } from "@/context/ToastContext";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
// Make sure to adjust this import path to match your actual showToast utility

const page = () => {
    const router = useRouter();
    const {showToast} = useToast()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault(); 
    setIsLoading(true);

    // Remove accidental whitespace that could cause validation failures
    const payload = {
      email: formData.email.trim(),
      password: formData.password.trim()
    };

    try {
      const response = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json();

       if (response.ok) {
        localStorage.setItem('admin', JSON.stringify(result.admin) )
        router.replace('/dashboard')
      } else {
        showToast(result.message, 'error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      showToast("A network error occurred. Please try again.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex justify-center items-center h-screen">
        <div className="bg-white rounded-3xl p-10 min-w-137.5">
            <div className="flex justify-between mb-4">
                <div className="flex gap-2 text-2xl">
                    <Image src={'/icon.png'} alt="logo icon" width={40} height={40} />
                    <p className="font-bold text-2xl">Trukkas</p>
                </div>
                <div className="bg-[#E1E9FF] rounded-full w-14 h-6 flex justify-center items-center ">
                    <p className="text-[#0241E8] text-xs font-bold">Admin</p>
                </div>
            </div>
            <p className="font-bold text-3xl">Welcome back</p>
            <p className="text-[#757575] text-lg font-medium">Sign in to your admin account</p>
            
            <form onSubmit={handleSubmit} className="mt-5 grid gap-3">
                <div>
                    <label className="font-bold text-base text-[#131514]" htmlFor="email">Email:</label>
                    <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="name@trukkas.ng"
                    className="w-full border-[#BDBDBD] border rounded-lg p-2 text-medium outline-none"
                    disabled={isLoading}
                    />
                </div>

                <div>
                    <label className="font-bold text-base text-[#131514]" htmlFor="password">Password:</label>
                    <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    className="w-full border-[#BDBDBD] border rounded-lg p-2 text-medium outline-none"
                    disabled={isLoading}
                    />
                </div>

                <button 
                  type="submit" 
                  disabled={isLoading}
                  className={`bg-[#0241E8] rounded-full text-white py-3 mt-3 transition-opacity ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
            </form>
        </div>
    </section>
  )
}

export default page