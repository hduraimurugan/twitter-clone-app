import { Link } from "react-router-dom";
import { useState } from "react";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdPassword } from "react-icons/md";
import { MdDriveFileRenameOutline } from "react-icons/md";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SignUpPage = () => {
	const [formData, setFormData] = useState({
		email: "",
		username: "",
		fullName: "",
		password: "",
	});

	const [errors, setErrors] = useState({}); // To store validation errors

	const queryClient = useQueryClient();

	const { mutate, isError, isPending, error } = useMutation({
		mutationFn: async ({ email, username, fullName, password }) => {
			try {
				const res = await fetch("/api/auth/signup", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ email, username, fullName, password }),
				});

				const data = await res.json();
				if (!res.ok) throw new Error(data.message || data.error || "Failed to create account");
				return data;
			} catch (error) {
				toast.error(error.message)
				throw error;
			}
		},
		onSuccess: () => {
			toast.success("Account created successfully");
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	// Validation rules
	const validateForm = () => {
		const validationErrors = {};
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		const usernameRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9_]{3,}$/; // At least 3 characters, must contain at least one letter
		const fullNameRegex = /^[a-zA-Z\s]+$/; // Only letters and spaces, no numbers
		const passwordRegex = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/; // At least 6 characters, 1 number, 1 special character

		if (!formData.email || !emailRegex.test(formData.email)) {
			validationErrors.email = "Please enter a valid email.";
		}
		if (!formData.username || !usernameRegex.test(formData.username)) {
			validationErrors.username = "Username must be at least 3 characters long and contain at least one letter.";
		}
		if (!formData.fullName || !fullNameRegex.test(formData.fullName)) {
			validationErrors.fullName = "Full name can only contain letters and spaces.";
		}
		if (!formData.password || !passwordRegex.test(formData.password)) {
			validationErrors.password = "Password must be at least 6 characters long, contain at least one number, and one special character.";
		}

		return validationErrors;
	};


	const handleSubmit = (e) => {
		e.preventDefault(); // Prevent page reload

		// Perform validation
		const validationErrors = validateForm();

		setErrors(validationErrors);

		// If no validation errors, proceed with the mutation
		if (Object.keys(validationErrors).length === 0) {
			mutate(formData);
		}
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
		setErrors({ ...errors, [e.target.name]: "" }); // Clear error for the field when typing
	};

	return (
		<div className='max-w-screen-xl mx-auto flex h-screen px-10'>
			<div className='flex-1 hidden lg:flex items-center justify-center'>
				<XSvg className='lg:w-2/3 fill-white' />
			</div>
			<div className='flex-1 flex flex-col justify-center items-center'>
				<form className='lg:w-2/3 mx-auto md:mx-20 flex gap-4 flex-col' onSubmit={handleSubmit}>
					<XSvg className='w-24 lg:hidden fill-white' />
					<h1 className='text-4xl font-extrabold text-white'>Join today.</h1>

					<label className={`input input-bordered rounded flex items-center gap-2 ${errors.email ? "border-red-500" : ""}`}>
						<MdOutlineMail />
						<input
							type='email'
							className='grow'
							placeholder='Email'
							name='email'
							onChange={handleInputChange}
							value={formData.email}
						/>
					</label>
					{errors.email && <p className='text-red-500'>{errors.email}</p>}

					<div className='flex gap-4 flex-wrap'>
						<label className={`input input-bordered rounded flex items-center gap-2 flex-1 ${errors.username ? "border-red-500" : ""}`}>
							<FaUser />
							<input
								type='text'
								className='grow'
								placeholder='Username'
								name='username'
								onChange={handleInputChange}
								value={formData.username}
							/>
						</label>
						{errors.username && <p className='text-red-500'>{errors.username}</p>}

						<label className={`input input-bordered rounded flex items-center gap-2 flex-1 ${errors.fullName ? "border-red-500" : ""}`}>
							<MdDriveFileRenameOutline />
							<input
								type='text'
								className='grow'
								placeholder='Full Name'
								name='fullName'
								onChange={handleInputChange}
								value={formData.fullName}
							/>
						</label>
						{errors.fullName && <p className='text-red-500'>{errors.fullName}</p>}
					</div>

					<label className={`input input-bordered rounded flex items-center gap-2 ${errors.password ? "border-red-500" : ""}`}>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					{errors.password && <p className='text-red-500'>{errors.password}</p>}

					<button className='btn rounded-full btn-primary text-white'>
						{isPending ? "Loading..." : "Sign up"}
					</button>

					{isError && <p className='text-red-500'>{error.message}</p>}
				</form>

				<div className='flex flex-col lg:w-2/3 gap-2 mt-4'>
					<p className='text-white text-lg'>Already have an account?</p>
					<Link to='/login'>
						<button className='btn rounded-full btn-primary text-white btn-outline w-full'>Sign in</button>
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SignUpPage;
