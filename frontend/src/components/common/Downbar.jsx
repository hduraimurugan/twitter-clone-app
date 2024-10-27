import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaSearch, FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut, BiLogOutCircle } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import SearchInput from "./SearchInput";

const Downbar = () => {
	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (data) => {
			toast.success(data.message);
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});

	const { data: authUser } = useQuery({ queryKey: ["authUser"] });


	return (
		<div className='md:hidden fixed bottom-0 left-0 w-full bg-black'>
			<div className='flex flex-row justify-center items-center border-t border-gray-700 w-full py-2 px-4'>
				{/* <Link to='/' className='flex justify-center'>
					<XSvg className='px-2 w-10 h-10 rounded-full fill-white hover:bg-stone-900' />
				</Link> */}

				<ul className='flex flex-row justify-between gap-3'>
					<li className='flex justify-center'>
						<Link
							to='/'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<MdHomeFilled className='w-8 h-8' />
						</Link>
					</li>

					<li className='flex justify-center'>
						<div className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
							onClick={() => document.getElementById("search_modal" + authUser?._id).showModal()}>

							<FaSearch className='w-6 h-6' />
						</div>

						<dialog id={`search_modal${authUser?._id}`} className='modal border-none outline-none'>
							<div className='modal-box rounded border border-gray-600'>
								<SearchInput />
							</div>
							<form method='dialog' className='modal-backdrop mt-10'>
								<button className='outline-none'>close</button>
							</form>
						</dialog>
					</li>

					<li className='flex justify-center'>
						<Link
							to='/notifications'
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<IoNotifications className='w-7 h-7' />
						</Link>
					</li>

					<li className='flex justify-center'>
						<Link
							to={`/profile/${authUser?.username}`}
							className='flex gap-3 items-center hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer'
						>
							<FaUser className='w-6 h-6' />
						</Link>
					</li>

					<li>
						{authUser && (
							<Link
								to={`/profile/${authUser?.username}`}
								className='flex items-center transition-all duration-300 hover:bg-[#181818] py-2 px-4 rounded-full'
							>
								<BiLogOutCircle className='w-7 h-7 cursor-pointer'
									onClick={(e) => {
										e.preventDefault();
										logout();
									}} />
							</Link>
						)}
					</li>
				</ul>
			</div>
		</div>
	);
};

export default Downbar;

