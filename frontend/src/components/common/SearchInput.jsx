import { useQuery } from "@tanstack/react-query";
import { IoSearchSharp } from "react-icons/io5";
import toast from "react-hot-toast";
import { useState } from "react";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton";
import { Link } from "react-router-dom";
import { MdVerified } from "react-icons/md";
import useFollow from "../../hooks/useFollow";
import LoadingSpinner from "./LoadingSpinner";


const SearchInput = () => {

    const [search, setSearch] = useState("");
    const [searchedUser, setSearchedUser] = useState(null);
    const { data: authUser } = useQuery({ queryKey: ["authUser"] });

    const { data: allUsers, isLoading } = useQuery({
        queryKey: ["allUsers"],
        queryFn: async () => {
            try {
                const res = await fetch("/api/users/all");
                const data = await res.json();
                if (!res.ok) {
                    throw new Error(data.error || "Something went wrong!");
                }
                // console.log("allUsers", data);
                return data;
            } catch (error) {
                throw new Error(error.message);
            }
        },
    });

    const { follow, isPending } = useFollow();
    const amIFollowing = authUser?.following.includes(searchedUser?._id);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!search) return;
        if (search.length < 3) {
            return toast.error("Search term must be at least 3 characters long");
        }
        const searchedUser = allUsers.find((c) => c.fullName.toLowerCase().includes(search.toLowerCase()));

        if (searchedUser) {
            setSearchedUser(searchedUser);
            setSearch("")
        } else toast.error("No such user found!");
    }

    return (
        <>
            <form onSubmit={handleSubmit} className='flex items-center justify-around gap-2'>
                <div className="flex items-center gap-2 my-3">
                    <input
                        type='text'
                        placeholder='Search…'
                        className='input input-bordered rounded-full'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type='submit' className='btn btn-circle bg-sky-500 text-white'>
                        <IoSearchSharp className='w-6 h-6 outline-none' />
                    </button>
                </div>
            </form>

            {!searchedUser ? <div></div> :
                <div>
                    {isLoading ? (
                        <>
                            <RightPanelSkeleton />
                        </>
                    ) :
                        <>
                            <div className="px-4 flex flex-col my-3">
                                <p className='font-bold mb-5'>Searched Results</p>

                                <Link
                                    to={`/profile/${searchedUser?.username}`}
                                    className='flex justify-center'
                                >
                                    <div className="flex items-center justify-between gap-4">
                                        <div className='flex gap-2 items-center'>
                                            <div className='avatar'>
                                                <div className='w-8 rounded-full'>
                                                    <img src={searchedUser?.profileImg || "/avatar-placeholder-3.jpg"} />
                                                </div>
                                            </div>
                                            <div className='flex flex-col'>
                                                <span className='font-semibold flex items-center gap-1 tracking-tight truncate w-28'>
                                                    {searchedUser?.fullName}{searchedUser?.isVerified && <MdVerified className='inline text-blue-400 text-xl' />}
                                                </span>
                                                <span className='text-sm text-slate-500'>@{searchedUser?.username}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <button
                                                className='btn btn-primary text-black bg-gray-100  hover:opacity-90 rounded-full btn-sm'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    follow(searchedUser?._id);
                                                }}
                                            >
                                                {isPending && <LoadingSpinner size='sm' />}
                                                {!isPending && amIFollowing && "Unfollow"}
                                                {!isPending && !amIFollowing && "Follow"}
                                            </button>
                                        </div>
                                    </div>

                                </Link>
                                <div className="flex justify-start my-2">
                                    <button className="btn btn-link rounded-full text-slate-700" onClick={()=>{setSearchedUser(null);}}>
                                        Clear Searched results
                                    </button>
                                </div>
                            </div>
                        </>
                    }
                </div>
            }
        </>
    );
};
export default SearchInput;