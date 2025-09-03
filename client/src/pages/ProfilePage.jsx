import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {

    const {authUser, updateProfile} = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState(null);
    const navigate = useNavigate();
    const[name , setName] = useState(authUser.fullName);
    const[bio , setBio] = useState(authUser.bio);

    const handleSubmit = async(e) => {
        e.preventDefault();

        let base64Image = authUser.profilePic;

        // If user selected a new image, convert it to base64
        if (selectedImg) {
            const reader = new FileReader();
            reader.readAsDataURL(selectedImg);

            reader.onload = async () => {
                base64Image = reader.result;
                await updateProfile({ profilePic: base64Image, fullName: name, bio });
                navigate('/');
        };
        } else {
             // If no new image, keep old profilePic
            await updateProfile({ profilePic: base64Image, fullName: name, bio });
            navigate('/');
        }
    };

    return (
        <div className='min-h-screen flex items-center text-white justify-center bg-cover bg-no-repeat'>

            <div className='w-5/6 max-w-2xl backdrop-blur-2xl to-gray-300 border-2 border-gray-600 
            flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>

                <form onSubmit={handleSubmit} className='p-10 flex flex-col gap-5 flex-1'>
                    <h3 className='text-lg text-white'>Profile details</h3>

                    <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
                        <input onChange={(e) => setSelectedImg(e.target.files[0])}
                        type='file' id='avatar' accept='.png, .jpg, .jpeg' hidden/>

                        <img src={selectedImg ? URL.createObjectURL(selectedImg) : authUser?.profilePic || 
                        assets.avatar_icon} alt=" " className={` w-12 h-12 ${selectedImg && 'rounded-full '}`} />
                            Upload Profile Image
                    </label>

                    <input onChange={(e) => setName(e.target.value)} value={name} type="text" 
                    required placeholder='Your Name' className=' p-2 border text-white border-gray-500 rounded-md 
                    focus:outline-none focus:ring-2 focus:ring-violet-500 ' />

                    <textarea onChange={(e) => setBio(e.target.value)} value={bio} required
                    placeholder='Write your bio...'  className='p-2 border text-white border-gray-500 rounded-md
                    focus:outline-none focus:ring-2 focus:ring-violet-500' rows={4}></textarea>

                    <button type='submit' className=' bg-gradient-to-r from-purple-400 to-violet-600 text-white 
                    p-2 rounded-full text-lg cursor-pointer'>Save</button>
                </form>

                <img className={`max-w-35 aspect-square text-white rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} 
                src={selectedImg? URL.createObjectURL(selectedImg) : authUser?.profilePic || assets.logo_icon } alt="" />

            </div>

        </div>
    )
}

export default ProfilePage