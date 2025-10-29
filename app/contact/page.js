  "use client";
  import React from "react";
  import { useForm } from "react-hook-form";

  const Contact = () => {
    const {
      register,
      handleSubmit,
      formState: { errors, touchedFields },
    } = useForm();

    const onSubmit = (data) => {
      console.log(data);
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-5 max-w-md mx-auto text-black bg-white p-6 rounded-xl shadow-lg"
      >
        {/* Username */}
        <input
          type="text"
          placeholder="👤 Enter your cool username"
          {...register("username", {
            required: "Username is required",
            minLength: { value: 3, message: "Minimum 3 characters" },
            maxLength: { value: 8, message: "Maximum 8 characters" },
          })}
          className={`border p-3 rounded-lg w-full placeholder-gray-400 
            focus:outline-none focus:ring-2 
            ${
              !errors.username && touchedFields.username
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {errors.username && <p className="text-red-500">{errors.username.message}</p>}

        {/* Password */}
        <input
          type="password"
          placeholder="🔑 Create a strong password"
          {...register("password", {
            required: "Password is required",
            minLength: { value: 6, message: "At least 6 characters" },
          })}
          className={`border p-3 rounded-lg w-full placeholder-gray-400 
            focus:outline-none focus:ring-2 
            ${
              !errors.password && touchedFields.password
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}

        {/* Phone Number */}
        <input
          type="tel"
          placeholder="📱 Your 10-digit phone number"
          {...register("phoneNo", {
            required: "Phone number is required",
            pattern: { value: /^[0-9]{10}$/, message: "Must be 10 digits" },
          })}
          className={`border p-3 rounded-lg w-full placeholder-gray-400 
            focus:outline-none focus:ring-2 
            ${
              !errors.phoneNo && touchedFields.phoneNo
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {errors.phoneNo && <p className="text-red-500">{errors.phoneNo.message}</p>}

        {/* Email */}
        <input
          type="email"
          placeholder="📧 Enter your email address"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Enter a valid email",
            },
          })}
          className={`border p-3 rounded-lg w-full placeholder-gray-400 
            focus:outline-none focus:ring-2 
            ${
              !errors.email && touchedFields.email
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}

        {/* Year */}
        <input
          type="text"
          placeholder="📅 Year (e.g : 1st Year)"
          {...register("year", {
            required: "Year is required",
            pattern: { value: /^[0-9]{4}$/, message: "Enter a valid 4-digit year" },
          })}
          className={`border p-3 rounded-lg w-full placeholder-gray-400 
            focus:outline-none focus:ring-2 
            ${
              !errors.year && touchedFields.year
                ? "border-green-500 focus:ring-green-400"
                : "border-gray-300 focus:ring-blue-400"
            }`}
        />
        {errors.year && <p className="text-red-500">{errors.year.message}</p>}

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:opacity-90 transition"
        >
          🚀 Submit Form
        </button>
      </form>
    );
  };

  export default Contact;
