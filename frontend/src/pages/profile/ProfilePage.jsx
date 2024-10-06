import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";

import { POSTS } from "../../utils/db/dummy";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline, IoLocation, IoLocationOutline } from "react-icons/io5";
import { SlLocationPin } from "react-icons/sl";
import { FaLink } from "react-icons/fa";
import { MdEdit, MdVerified } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";

import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import LoadingSpinner from "../../components/common/LoadingSpinner";

const ProfilePage = () => {
	const [coverImg, setCoverImg] = useState(null);
	const [profileImg, setProfileImg] = useState(null);
	const [feedType, setFeedType] = useState("posts");

	const coverImgRef = useRef(null);
	const profileImgRef = useRef(null);

	const { username } = useParams();

	const { follow, isPending } = useFollow();
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const { data: posts } = useQuery({ queryKey: ["posts"] });

	const {
		data: user,
		isLoading,
		refetch,
		isRefetching,
	} = useQuery({
		queryKey: ["userProfile"],
		queryFn: async () => {
			try {
				const res = await fetch(`/api/users/profile/${username}`);
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();

	const isMyProfile = authUser._id === user?._id;
	const memberSinceDate = formatMemberSinceDate(user?.createdAt);
	const amIFollowing = authUser?.following.includes(user?._id);

	const handleImgChange = (e, state) => {
		// if(!isMyProfile){
		// 	setCoverImg(null)
		// 	setProfileImg(null)
		// }
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				state === "coverImg" && setCoverImg(reader.result);
				state === "profileImg" && setProfileImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	
	};

	useEffect(() => {
		refetch();
	}, [username, refetch]);

	return (
		<>
			<div className='flex-[4_4_0]  border-r border-gray-700 min-h-screen '>
				{/* HEADER */}
				{(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
				{!isLoading && !isRefetching && !user && <p className='text-center text-lg mt-4'>User not found</p>}
				<div className='flex flex-col'>
					{!isLoading && !isRefetching && user && (
						<>
							<div className='flex gap-10 px-4 py-2 items-center'>
								<Link to='/'>
									<FaArrowLeft className='w-4 h-4' />
								</Link>
								<div className='flex flex-col'>
									<p className='font-bold text-lg'>{user?.fullName}</p>
									<span className='text-sm text-slate-500'>{posts?.length} posts</span>
								</div>
							</div>
							{/* COVER IMG */}
							<div className='relative group/cover'>
								<img
									src={coverImg || user?.coverImg || "/cover.png"}
									className='h-52 w-full object-cover'
									alt='cover image'
								/>
								{isMyProfile && (
									<div
										className='absolute top-2 right-2 rounded-full p-2 bg-gray-800 bg-opacity-75 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
										onClick={() => coverImgRef.current.click()}
									>
										<MdEdit className='w-5 h-5 text-white' />
									</div>
								)}

								<input
									type='file'
									hidden
									accept='image/*'
									ref={coverImgRef}
									onChange={(e) => handleImgChange(e, "coverImg")}
								/>
								<input
									type='file'
									hidden
									accept='image/*'
									ref={profileImgRef}
									onChange={(e) => handleImgChange(e, "profileImg")}
								/>
								{/* USER AVATAR */}
								<div className='avatar absolute -bottom-16 left-4'>
									<div className='w-32 rounded-full border-4 border-black relative group/avatar'>
										<img src={profileImg || user?.profileImg || "/avatar-placeholder.png"} />
										{isMyProfile && (
											<div className='absolute top-5 right-3 p-1 bg-primary rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
												<MdEdit
													className='w-4 h-4 text-white'
													onClick={() => profileImgRef.current.click()}
												/>
											</div>
										)}
									</div>
								</div>
							</div>
							<div className='flex justify-end px-4 mt-5'>

								{isMyProfile && <EditProfileModal authUser={authUser} />}

								{!isMyProfile && (
									<button
										className='btn btn-primary bg-white border-0 rounded-full btn-sm px-7'
										onClick={() => follow(user?._id)}
									>
										{isPending && <span>Loading...</span>}
										{!isPending && amIFollowing && "Unfollow"}
										{!isPending && !amIFollowing && "Follow"}
									</button>
								)}
								{(coverImg || profileImg) && (
									<button
										className='btn btn-primary rounded-full btn-sm text-white px-4 ml-2'
										onClick={async () => {
											await updateProfile({ coverImg, profileImg });
											setProfileImg(null);
											setCoverImg(null);
										}}
									>
										{isUpdatingProfile ? "Updating..." : "Update"}
									</button>
								)}
							</div>

							<div className='flex flex-col gap-4 mt-14 px-4'>
								<div className='flex flex-col'>
									<span className='font-bold text-lg flex gap-1 items-center'>
										{user?.fullName}
										{user?.isVerified &&
											<div className="tooltip tooltip-bottom flex items-center hover:cursor-pointer" data-tip="User Verified">
												<MdVerified className='inline text-blue-400 text-xl' />
											</div>}
									</span>
									<span className='text-sm text-slate-500'>@{user?.username}</span>
									<span className='text-sm my-1'>{user?.bio}</span>
								</div>

								<div className='flex gap-3 flex-wrap'>
									<div className='flex gap-1 items-center'>
										<SlLocationPin className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>
											{user?.location || "Not provided"}
										</span>
									</div>
									{user?.link && (
										<div className='flex gap-1 items-center '>
											<>
												<FaLink className='w-3 h-3 text-slate-500' />
												<a
													href={user?.link}
													target='_blank'
													rel='noreferrer'
													className='text-sm text-blue-500 hover:underline'
												>
													{user?.link}
												</a>
											</>
										</div>
									)}
									<div className='flex gap-2 items-center'>
										<IoCalendarOutline className='w-4 h-4 text-slate-500' />
										<span className='text-sm text-slate-500'>{memberSinceDate}</span>
									</div>
								</div>
								<div className='flex gap-2'>
									<div className='flex gap-1 items-center hover:cursor-pointer'
										onClick={() => document.getElementById("following_modal" + user?._id).showModal()}>
										<span className='font-bold text-xs'>{user?.following.length}</span>
										<span className='text-slate-500 text-xs'>Following</span>
									</div>

									<div className='flex gap-1 items-center hover:cursor-pointer'
										onClick={() => document.getElementById("followers_modal" + user?._id).showModal()}>
										<span className='font-bold text-xs'>{user?.followers.length}</span>
										<span className='text-slate-500 text-xs'>Followers</span>
									</div>

								</div>

								<dialog id={`following_modal${user?._id}`} className='modal border-none outline-none'>
									<div className='modal-box rounded border border-gray-600'>
										<h3 className='font-bold text-lg mb-10'>Following({user?.following.length})</h3>
										<div className='flex flex-col gap-5 max-h-60 mb-5 overflow-auto'>
											{user?.following.length === 0 && (
												<p className='text-sm text-slate-500'>
													No following yet
												</p>
											)}
											{user?.following.map((following) => (
												<div key={following._id} className='flex gap-2 items-start'>
													<div className='avatar'>
														<div className='w-8 rounded-full'>
															<Link to={`/profile/${following.username}`}>
																<img
																	src={following.profileImg || "/avatar-placeholder.png"}
																/>
															</Link>
														</div>
													</div>
													<div className='flex flex-col'>
														<div className='flex items-center gap-1'>
															<Link to={`/profile/${following.username}`} className="flex gap-1 items-center">
																<span className='font-bold'>{following.fullName}</span>
																<span className='text-gray-700 text-sm'>
																	@{following.username}
																</span>
															</Link>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
									<form method='dialog' className='modal-backdrop mt-10'>
										<button className='outline-none'>close</button>
									</form>
								</dialog>

								<dialog id={`followers_modal${user?._id}`} className='modal border-none outline-none'>
									<div className='modal-box rounded border border-gray-600'>
										<h3 className='font-bold text-lg mb-10'>Followers({user?.followers.length})</h3>
										<div className='flex flex-col gap-5 max-h-60 mb-5 overflow-auto'>
											{user?.followers.length === 0 && (
												<p className='text-sm text-slate-500'>
													No followers yet
												</p>
											)}
											{user?.followers.map((follower) => (
												<div key={follower._id} className='flex gap-2 items-start'>
													<div className='avatar'>
														<div className='w-8 rounded-full'>
															<Link to={`/profile/${follower.username}`}>
																<img
																	src={follower.profileImg || "/avatar-placeholder.png"}
																/>
															</Link>
														</div>
													</div>
													<div className='flex flex-col'>
														<div className='flex items-center gap-1'>
															<Link to={`/profile/${follower.username}`} className="flex gap-1 items-center">
																<span className='font-bold'>{follower.fullName}</span>
																<span className='text-gray-700 text-sm'>
																	@{follower.username}
																</span>
															</Link>
														</div>
													</div>
												</div>
											))}
										</div>
									</div>
									<form method='dialog' className='modal-backdrop mt-10'>
										<button className='outline-none'>close</button>
									</form>
								</dialog>
							</div>
							<div className='flex w-full border-b border-gray-700 mt-4'>
								<div
									className={`flex justify-center ${feedType === "posts" ? "font-bold" : "font-light"
										} flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative`}
									onClick={() => setFeedType("posts")}
								>
									Posts
									{feedType === "posts" && (
										<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary' />
									)}
								</div>
								<div
									className={`flex justify-center ${feedType === "likes" ? "font-bold" : "font-light"
										} flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative`}
									onClick={() => setFeedType("likes")}
								>
									Likes
									{feedType === "likes" && (
										<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary' />
									)}
								</div>
							</div>
						</>
					)}

					<Posts feedType={feedType} username={username} userId={user?._id} />
				</div>
			</div>
		</>
	);
};
export default ProfilePage;